// main user logic
function userKeyDownAction(key) {
  // check user action against last segment on first move
  // or when trying to pick banana
  // but check against second last segment on subsequent move
  if (playerScore == 0 || key == "spacebar") {
    var lastSegmentElement = $("#tree").children().last();
  } else {
    var lastSegmentElement = $("#tree").children().eq(secondLastSegment);
  }
  var lastSegmentDirection = lastSegmentElement.attr("class") + "-arrow";

  // return banana present true/false
  // and banana type
  var bananaPlaceholder = lastSegmentElement.children(".branch-wrapper").children(".banana-placeholder");
  var bananaPlaceholderClass = bananaPlaceholder.attr("class").split(" ")
  var bananaPresent = (bananaPlaceholderClass.length > 1);
  var bananaType = (bananaPlaceholderClass[bananaPlaceholderClass.length - 1]);

  // when user navigates left/right
  if (key == "left-arrow" || key == "right-arrow") {
    if (key == lastSegmentDirection) {
      if (playerScore == 0) {
        // start timer on first move
        progress();
        $("#monkey-start").hide();
      } else {
        // remove last segment on subsequent move
        $("#tree").children().last().remove();
      }

      // increase time decay when threshold reached
      if (playerScore % timeObj.next_level_threshold == timeObj.next_level_threshold - 1) {
        timeObj.time_decay += timeObj.time_decay_factor;
        level++;
        flashLevel(level);
      }

      // show and hide monkey depending on user action
      if (lastSegmentDirection == "left-arrow") {
        $("#monkey-right").hide();
        $("#monkey-left").show();
      } else {
        $("#monkey-left").hide();
        $("#monkey-right").show();
      }
      
      if (playerScore > 0) {
        addRandomTreeSegmentToDom("prepend");
      }

      playerScore++;
      $("#score").text(playerScore);

    } else {
      // when user misstep after the first move
      if (playerScore > 0) {
        timeObj.time_left -= timeObj.time_decay_penalise_user;
      }
    }
  } else {
  // when user grabs banana
    if (bananaPresent && bananaType == "banana") {
      // user cue: add +2 bonus
      bubbleBonusPoints();
      increaseTime();
      bananaPlaceholder.removeClass("banana");
      playerScore ++;
    } else {
      // when user grabs nothing or rotten banana
      timeObj.time_left -= timeObj.time_decay_penalise_user;
    }
  }
}

// increase time when user makes correct move
function increaseTime() {
  timeObj.time_left = Math.min(timeObj.time_left + 2000, timeObj.time_total);
  $("#progress").width(Math.min(progressElementMaxWidth, $("#progress").width() + 10));
}

// decrease time 
function progress() {
  timeObj.time_left -= timeObj.time_decay;
  var percentageRemain = timeObj.time_left / timeObj.time_total
  var progressBarWidth = percentageRemain * 100;
  if (percentageRemain >= 0.30) {
    $("#progress").css("background-color", "green");
  } else {
    $("#progress").css("background-color", "red");
  }
  $("#progress").width(progressBarWidth);
  if (timeObj.time_left > 0) {
    setTimeout(function() {
      progress();
    }, 50);
  }
  else {
    // showGameOver();
  }
}

function bubbleBonusPoints() {
  $("#score-wrapper").append("<div class=\"bonus-points\">+2</div>");
  var angle = Math.floor(Math.random() * 50) + 50;
  // animate each bonus point to the top (bottom 100%) and reduce opacity as it moves
  // callback function used to remove complete animations
  $(".bonus-points").animate({
      "top": "-80px",
      "left": (15 + angle) + "px",
      "opacity" : "-=0.7"
  }, 2000, function() {
    $(this).remove();
  });    
}

function flashLevel(level) {
  $("#score-wrapper").append("<div class=\"level\"></div>")
  $(".level").text("LEVEL " + level).fadeIn();
  setTimeout(function() {
    $(".level").fadeOut(function() {
      $(this).remove();
    });
  }, 1000);
}

startGame()