var running = false;
var playerScore = 0;
var timeObj = {"time_left": 5000,
               "time_total": 10000,
               "time_decay": 350
              }
var reduceTime;

function createTreeSegment(direction) {
  var divElement = $("<div>", {"class": direction});
  var branchWrapperElement = $("<div>", {"class": "branch-wrapper"});
  var bananaElement = $("<div>", {"class": "banana-placeholder"});
  if (playerScore > 20) {
    var randomNumber = Math.floor(Math.random() * 4);
    if (randomNumber == 0) {
      bananaElement.addClass("banana");
    }
  }
  var branchElement = $("<div>", {"class": "branch"});
  branchWrapperElement.append(bananaElement).append(branchElement);
  var emptyBranchElement = $("<div>", {"class": "empty-branch"}).html("&nbsp;");
  var trunkElement = $("<div>", {"class": "trunk"}).html("&nbsp;");
  if (direction == "left") {
    var treeSegmentElement = divElement.append([branchWrapperElement, trunkElement, emptyBranchElement]);
  } else {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, branchWrapperElement]);
  }
  return treeSegmentElement;
}

function createRandomTreeSegment(addBeforeOrAfter) {
  var randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber == 0) {
    if (addBeforeOrAfter == "append") {
      $("#tree").append(createTreeSegment("left"));
    } else {
      $("#tree").prepend(createTreeSegment("left"));
    }
  } else {
    if (addBeforeOrAfter == "append") {
      $("#tree").append(createTreeSegment("right"));
    } else {
      $("#tree").prepend(createTreeSegment("right"));
    }
  }
}

function initialTree() {
  for (var i = 0; i < 7; i++) {
    createRandomTreeSegment("append");
  };
  running = true;
}

function start() {
  running = true;
  $("#tree").html("");
  initialTree();

  playerScore = 0;
  $("#score").text(playerScore);

  $("#progress").width("50%");
  timeObj = {"time_left": 5000,
             "time_total": 10000,
             "time_decay": 350
            }
  $("#progress").css("background-color", "green");
  $("#monkey-left").hide(); 
  $("#monkey-right").hide(); 
  $("#monkey-start").show();            
  $("#game-start").hide();
  $("#game-over").hide();
  $("#game-running").show();
}

function gameOver() {
  running = false;
  $("#game-running").hide();
  $("#final-score").text("Your Score: " + playerScore);
  $("#game-over").show();
}

function increaseTime() {
  console.log("time left from increaseTime(): " + timeObj.time_left);
  timeObj.time_left = Math.min(timeObj.time_left + 2000, timeObj.time_total);
  $("#progress").width(Math.min(100,$("#progress").width() + 10));
}

function keyUp(key) {
  $("#" + key + "-arrow").css("transform", "scale(1)");
}

function keyDown(key) {
  $("#" + key + "-arrow").css("transform", "scale(0.9)");
  if (playerScore == 0) {
    var lastSegmentDirection = $("#tree").children().last().attr("class")
  } else {
    var lastSegmentDirection = $("#tree").children().eq(5).attr("class")
  }
  if (lastSegmentDirection == key) {
    if (playerScore == 0) {
      progress($("#progress"));
      $("#monkey-start").hide();
    } else {
      $("#tree").children().last().remove();
    }

    if (playerScore % 20 == 19) {
      timeObj.time_decay += 50;
    }

    if (key == "left") {
      $("#monkey-right").hide();
      $("#monkey-left").show();
    } else {
      $("#monkey-left").hide();
      $("#monkey-right").show();
    }
    
    if (playerScore > 0) {
      createRandomTreeSegment("prepend");
    }
    playerScore++;
    $("#score").text(playerScore);
    if (timeObj.time_left <= timeObj.time_total) {
      increaseTime();
    }
  } else {
    // gameOver();
  }
}

$(document).keydown(function(key) {
  if (running == true) {
    if (key.which == 37) {
      keyDown("left");
    }
    if (key.which == 39) {
      keyDown("right");
    }
  }
})

$("#left-arrow").on("mousedown", function() {
  if (running == true) {
    keyDown("left");
  }
})

$("#left-arrow").on("mouseup", function() {
    keyUp("left");
})

$(document).keyup(function(key) {
  if (running == true) {
    if (key.which == 37) {
      keyUp("left");
    }
    if (key.which == 39) {
      keyUp("right");
    }
  }
})

$("#right-arrow").on("mousedown", function() {
  if (running == true) {
    keyDown("right");
  }
})

$("#right-arrow").on("mouseup", function() {
  if (running == true) {
    keyUp("right");
  }
})

function progress($animatedElement) {
  timeObj.time_left -= timeObj.time_decay;
  var percentageRemain = timeObj.time_left / timeObj.time_total
  var progressBarWidth = percentageRemain * 100;
  if (percentageRemain >= 0.30) {
    $animatedElement.css("background-color", "green");
  } else {
    $animatedElement.css("background-color", "red");
  }
  $animatedElement.width(progressBarWidth);
  if (timeObj.time_left > 0) {
    reduceTime = setTimeout(function() {
      progress($animatedElement);
    }, 50);
  }
  else {
    // gameOver();
  }
}

start()