var running = false;
var playerScore = 0;
var addBananaThreshold = 0;
var addRottenBananaThreshold = 40;
var secondLastSegment = 5;
var progressElementMaxWidth = 98;
var level = 0;
var timeObj;

function randomAddOfBanana(bananaElement) {
  // randomise adding of banana class
  // only when user points passes a certain threshold
  if (playerScore > addBananaThreshold) {
    var randomNumber = Math.floor(Math.random() * 5);
    if (randomNumber == 0 || randomNumber == 1) {
      bananaElement.addClass("banana");
    }
    if (playerScore > addRottenBananaThreshold) {
      if (randomNumber == 2) {
        bananaElement.addClass("rotten-banana");
      } 
    }
  }
}

function createTreeSegment(direction) {
  var divElement = $("<div>", {"class": direction});
  var branchWrapperElement = $("<div>", {"class": "branch-wrapper"});
  var bananaElement = $("<div>", {"class": "banana-placeholder"});
  randomAddOfBanana(bananaElement);
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
  timeObj = {"time_left": 10000,
             "time_total": 20000,
             "time_decay": 50,
             "time_decay_penalise_user": 5000,
             "time_decay_threshold": 30,
             "time_decay_factor": 25
            };
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