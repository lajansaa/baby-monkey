var running = false;
var initialNumOfSegments = 4;
var numOfEvents = 8;
var secondLastSegment = 2;
var progressElementMaxWidth = 98;
var playerScore,
    level,
    addBananaThreshold,
    addRottenBananaThreshold,
    timeObj;

function randomAddOfBanana(bananaElement) {
  // randomise adding of banana class
  // only when user points passes a certain threshold
  if (playerScore > addBananaThreshold) {
    var randomNumber = Math.floor(Math.random() * numOfEvents);
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

function randomNumBetween(minInclusive, maxInclusive) {
  return Math.floor(Math.random() * maxInclusive) + minInclusive;
}

function addRidges(trunkElement) {
  var translateY = 0;
  for (var i = 1; i < 3; i++) {
    var ridgesElement = $("<div>", {"class": "ridges"});
    var widthHeight = randomNumBetween(10,13);
    ridgesElement.css({"width": widthHeight,
                       "height": widthHeight,
                       // "border-bottom-right-radius": randomNumBetween(70,100) + "px",
                       // "border-bottom-left-radius": randomNumBetween(70,100) + "px",
                       "transform": "translate(" + randomNumBetween(1,20) + "px," + translateY + "px)"
                      })
    trunkElement.append(ridgesElement);
    translateY += 50;
  }
}

function createTreeSegment(direction, mainOrBackground) {
  var divElement = $("<div>", {"class": direction});
  // if (mainOrBackground == "main") {
  //   var leavesElement = $("<div>", {"class": "leaves leaves-" + direction});
  // } else {
  //   var leavesElement = $("<div>", {"class": "leaves-bg leaves-bg-" + direction});
  // }
  var leavesWrapperElement = $("<div>", {"class": "leaves-wrapper"});
  var leavesElement = $("<div>", {"class": "leaves leaves-" + direction});
  // var leavesBackgroundElement = $("<div>", {"class": "leaves-bg leaves-bg-" + direction});
  // leavesWrapperElement.append(leavesElement).append(leavesBackgroundElement);
  leavesWrapperElement.append(leavesElement)
  var branchWrapperElement = $("<div>", {"class": "branch-wrapper"});
  var bananaElement = $("<div>", {"class": "banana-placeholder banana-placeholder-"  + direction});
  randomAddOfBanana(bananaElement);
  var branchElement = $("<div>", {"class": "branch " + direction + "-branch"});
  branchWrapperElement.append(bananaElement).append(leavesWrapperElement).append(branchElement);
  var emptyBranchElement = $("<div>", {"class": "empty-branch"});
  var trunkElement = $("<div>", {"class": "trunk"});
  addRidges(trunkElement);

  // create left or right branch
  if (direction == "left") {
    var treeSegmentElement = divElement.append([branchWrapperElement, trunkElement, emptyBranchElement]);
  } else {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, branchWrapperElement]);
  }
  return treeSegmentElement;
}

function addRandomTreeSegmentToDom(parentElem, addBeforeOrAfter) {
  // randomise left or right branch
  var randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber == 0) {
    if (addBeforeOrAfter == "append") {
      parentElem.append(createTreeSegment("left", "main"));
    } else {
      parentElem.prepend(createTreeSegment("left", "main"));
    }
  } else {
    if (addBeforeOrAfter == "append") {
      parentElem.append(createTreeSegment("right", "main"));
    } else {
      parentElem.prepend(createTreeSegment("right", "main"));
    }
  }
}

function createInitialTree() {
  for (var i = 0; i < initialNumOfSegments; i++) {
    addRandomTreeSegmentToDom($("#tree"), "append");
  };
  running = true;
}

// function createBackgroundTree(idNum, numOfSegments) {
//   var backgroundTreeElement = $("<div>", {"id": "background-tree-" + idNum, "class": "background-tree"});
//   for (var i = 0; i < numOfSegments; i++) {
//     backgroundTreeElement.append(createTreeSegment("right", "background"));
//     backgroundTreeElement.append(createTreeSegment("left", "background"));
//   }
//   $("#background").append(backgroundTreeElement);
// }

// function createBackground() {
//   createBackgroundTree(1, 10);
//   createBackgroundTree(2, 4);
//   createBackgroundTree(3, 8);
//   // createBackgroundTree(4);
//   $(".background-tree").children().children("div.trunk").css({"background-color":"darkolivegreen"});
//   $(".background-tree").children().children("div.branch-wrapper").children("div.branch").css({"border-bottom-color":"darkolivegreen"});
// }



// start or reset game
function startGame() {
  running = true;
  $("#tree").html("");
  $("#background").html("");
  addBananaThreshold = 30;
  addRottenBananaThreshold = 60;
  playerScore = 0;
  $("#score").text(playerScore);
  level = 0;

  createInitialTree();
  // createBackground();

  $("#progress").width("50%");
  timeObj = {"time_left": 10000,
             "time_total": 20000,
             "time_decay": 50,
             "time_increase_correct_branch": 300,
             "time_increase_fruit_pick": 1000,
             "time_decay_penalise_user": 5000,
             "next_level_threshold": 20,
             "time_decay_factor": 20
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