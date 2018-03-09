function createTreeSegment(direction) {
  var divElement = $("<div>", {"class": direction});
  var branchElement = $("<div>", {"class": "branch"}).html("&nbsp;");
  var emptyBranchElement = $("<div>", {"class": "empty-branch"}).html("&nbsp;");
  var trunkElement = $("<div>", {"class": "trunk"}).html("&nbsp;");
  if (direction == "left") {
    var treeSegmentElement = divElement.append([branchElement, trunkElement, emptyBranchElement]);
  } else {
    var treeSegmentElement = divElement.append([emptyBranchElement, trunkElement, branchElement]);
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

function initialState() {
  for (var i = 0; i < 8; i++) {
    createRandomTreeSegment("append");
  };
}

initialState();

var playerScore = 0;


function keyUp(key) {
  $("#" + key + "-arrow").css("transform", "scale(1)");
}

function keyDown(key) {
  $("#" + key + "-arrow").css("transform", "scale(0.9)");
  var lastSegmentDirection = $("#tree").children().last().attr("class")
  if (lastSegmentDirection == key) {
    $("#tree").children().last().remove();
    createRandomTreeSegment("prepend");
    playerScore++;
    $("#score").text(playerScore);
  }
}

$(document).keydown(function(key) {
  if (key.which == 37) {
    keyDown("left");
  }
  if (key.which == 39) {
    keyDown("right");
  }
})

$(document).keyup(function(key) {
  if (key.which == 37) {
    keyUp("left");
  }
  if (key.which == 39) {
    keyUp("right");
  }
})
