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
  
  // randomise adding of banana class
  if (playerScore > 20) {
    var randomNumber = Math.floor(Math.random() * 4);
    if (randomNumber == 0) {
      bananaElement.addClass("banana");
    }
  }

  var branchElement = $("<div>", {"class": "branch"});
  branchWrapperElement.append(bananaElement).append(branchElement);
  var emptyBranchElement = $("<div>", {"class": "empty-branch"});
  var trunkElement = $("<div>", {"class": "trunk"});
  
  // create left or right branch
  if (direction == "left") {
    var treeSegmentElement = divElement.append([branchWrapperElement, trunkElement, emptyBranchElement]);
  } else {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, branchWrapperElement]);
  }
  return treeSegmentElement;
}

function addRandomTreeSegmentToDom(addBeforeOrAfter) {
  // randomise left or right branch
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

function createInitialTree() {
  for (var i = 0; i < 7; i++) {
    addRandomTreeSegmentToDom("append");
  };
  running = true;
}

// start or reset game
function startGame() {
  running = true;
  $("#tree").html("");
  createInitialTree();

  playerScore = 0;
  $("#score").text(playerScore);

  $("#progress").width("50%");
  timeObj = {"time_left": 5000,
             "time_total": 10000,
             "time_decay": 350
            }
  $("#progress").css("background-color", "green");

  $("#monkey-left, #monkey-right").hide(); 
  $("#monkey-start").show();   

  $("#game-start, #game-over").hide();
  $("#game-running").show();
}

// show user score
function showGameOver() {
  running = false;
  $("#game-running").hide();
  $("#final-score").text("Your Score: " + playerScore);
  $("#game-over").show();
}


function keyUp(key) {
  // user cue: mimic releasing of button
  $("#" + key + "-arrow").css("transform", "scale(1)");
}

// main user logic
function userAction(key) {
  // user cue: mimic pressing of button
  $("#" + key + "-arrow").css("transform", "scale(0.9)");
  
  // check user action against last segment on first move
  // but check against second last segment on subsequent move
  if (playerScore == 0) {
    var lastSegmentDirection = $("#tree").children().last().attr("class")
  } else {
    var lastSegmentDirection = $("#tree").children().eq(5).attr("class")
  }

  if (lastSegmentDirection == key) {
    if (playerScore == 0) {
      // start timer on first move
      progress();
      $("#monkey-start").hide();
    } else {
      // remove last segment on subsequent move
      $("#tree").children().last().remove();
    }

    // increase time decay for every 20 points
    if (playerScore % 20 == 19) {
      timeObj.time_decay += 50;
    }

    // show and hide monkey depending on user action
    if (key == "left") {
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

    // increase time left only if it's not the max
    if (timeObj.time_left <= timeObj.time_total) {
      increaseTime();
    }
  } else {
    // showGameOver();
  }
}

// if user uses keyboard to play
$(document).keydown(function(key) {
  if (running == true) {
    if (key.which == 37) {
      userAction("left");
    }
    if (key.which == 39) {
      userAction("right");
    }
    if (key.which == 32) {
      userAction("spacebar");
    }
  }
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

// if user uses mouse to play
$("#left-arrow").on("mousedown", function() {
  if (running == true) {
    userAction("left");
  }
})

$("#left-arrow").on("mouseup", function() {
  if (running == true) {
    keyUp("left");
  }
})

$("#right-arrow").on("mousedown", function() {
  if (running == true) {
    userAction("right");
  }
})

$("#right-arrow").on("mouseup", function() {
  if (running == true) {
    keyUp("right");
  }
})

// increase time when user makes correct move
function increaseTime() {
  console.log("time left from increaseTime(): " + timeObj.time_left);
  timeObj.time_left = Math.min(timeObj.time_left + 2000, timeObj.time_total);
  $("#progress").width(Math.min(100,$("#progress").width() + 10));
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
    reduceTime = setTimeout(function() {
      progress();
    }, 50);
  }
  else {
    // showGameOver();
  }
}

startGame()