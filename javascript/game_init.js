var running = false;
var bgAudioElement = $("#bg-audio").get(0);
var initialNumOfBranches = 3;
var numOfEvents = 8;
var secondLastSegment = 2;
var progressElementMaxWidth = 98;
var playerScore,
    level,
    addAppleThreshold,
    addRottenAppleThreshold,
    timeObj;

function randomAddOfApple(appleElement) {
  // randomise adding of apple class
  // only when user points passes a certain threshold
  if (playerScore > addAppleThreshold) {
    var randomNumber = Math.floor(Math.random() * numOfEvents);
    if (randomNumber == 0 || randomNumber == 1) {
      appleElement.addClass("apple");
    }
    if (playerScore > addRottenAppleThreshold) {
      if (randomNumber == 2) {
        appleElement.addClass("rotten-apple");
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
                       "transform": "translate(" + randomNumBetween(1,20) + "px," + translateY + "px)"
                      })
    trunkElement.append(ridgesElement);
    translateY += 50;
  }
}

function createTreeSegment(direction, mainOrBackground) {
  var divElement = $("<div>", {"class": direction});
  var leavesWrapperElement = $("<div>", {"class": "leaves-wrapper"});
  var leavesElement = $("<div>", {"class": "leaves leaves-" + direction});
  var leavesBackgroundElement = $("<div>", {"class": "leaves-bg leaves-bg-" + direction});
  leavesWrapperElement.append(leavesElement).append(leavesBackgroundElement);

  var branchWrapperElement = $("<div>", {"class": "branch-wrapper"});
  var appleElement = $("<div>", {"class": "apple-placeholder apple-placeholder-"  + direction});
  randomAddOfApple(appleElement);
  var branchElement = $("<div>", {"class": "branch " + direction + "-branch"});
  branchWrapperElement.append(appleElement).append(leavesWrapperElement).append(branchElement);
  
  var emptyBranchElement = $("<div>", {"class": "empty-branch"});
  if (direction == "empty") {
    var emptyBranchElement2 = $("<div>", {"class": "empty-branch"});
  }

  var trunkElement = $("<div>", {"class": "trunk"});
  addRidges(trunkElement);

  // create left or right branch
  if (direction == "left") {
    var treeSegmentElement = divElement.append([branchWrapperElement, trunkElement, emptyBranchElement]);
  } else if (direction == "right") {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, branchWrapperElement]);
  } else {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, emptyBranchElement2]);
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
  for (var i = 0; i < initialNumOfBranches; i++) {
    addRandomTreeSegmentToDom($("#tree"), "append");
  };
  $("#tree").append(createTreeSegment("empty", "main"));
  running = true;
}

function scrollBackground() {
  var currentBottom = parseInt($("#scrolling-bg").css("bottom").slice(0,-2));
  var minBottom = parseInt($("#scrolling-bg").css("height").slice(0,-2)) - 600;
  if (currentBottom > -minBottom) {
    $("#scrolling-bg").css({bottom: "-=150px"});
  }
}

function createBackgroundTrunk(translateX) {
  var backgroundTreeElement = $("<div>", {"class": "background-tree"});
  backgroundTreeElement.css({width: randomNumBetween(15,20),
                             height: randomNumBetween(2500,5000),
                             opacity: Math.random() * (0.4 - 0.2) + 0.2 ,
                             transform: "rotate(" + randomNumBetween(0,2) + "deg) translate(" + translateX + "px)"
                            });
  $("#forest-bg").append(backgroundTreeElement);
}

function createBackgroundCloud(translateX, translateY) {
  var backgroundCloudElement = $("<div>", {"class": "background-cloud"});
  var cloudSize = Math.random() * (0.6 - 0.4) + 0.4;
  backgroundCloudElement.css({transform: "scale(" + cloudSize + ") translate(" + translateX + "px, " + translateY + "px)"
                             });
  $("#sky-bg").append(backgroundCloudElement);
}

function createBackgroundStar(translateX, translateY) {
  var backgroundStarElement = $("<div>", {"class": "fa fa-star"});
  var starSize = randomNumBetween(1, 20);
  backgroundStarElement.css({color: "silver",
                             "font-size": starSize + "px",
                             transform: "translate(" + translateX + "px, " + translateY + "px)"
                             });
  $("#space-bg").append(backgroundStarElement);
}

function createBackground() {
  var trunkTranslateX = 50;
  for (var i = 0; i < window.innerWidth * 0.0095; i++) {
    createBackgroundTrunk(trunkTranslateX);
    trunkTranslateX += randomNumBetween(50, 100);
  }
  
  var cloudTranslateY = -3500;
  for (var i = 0; i < 12; i++) {
    var cloudTranslateX = randomNumBetween(50,window.innerWidth);
    createBackgroundCloud(cloudTranslateX, cloudTranslateY);
    cloudTranslateY += 500;
  }

  var starTranslateY = 10;
  for (var i = 0; i < 300; i++) {
    var starTranslateX = randomNumBetween(0,1300);
    createBackgroundStar(starTranslateX, starTranslateY);
    starTranslateY += 10;
  }
}

// start or reset game
function startGame() {
  running = true;
  $("#tree").html("");
  $("#forest-bg, #sky-bg, #space-bg").html("");
  $("#scrolling-bg").css("bottom", "0px");
  addAppleThreshold = 30;
  addRottenAppleThreshold = 60;
  playerScore = 0;
  $("#score").text(playerScore);
  level = 0;

  createInitialTree();
  createBackground();

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
  bgAudioElement.pause();
  bgAudioElement.currentTime = 0;
  $("#game-running").hide();
  $("#final-score").text("Your Score: " + playerScore);
  $("#game-over").show();
}