// if user uses keyboard to play
$(document).keydown(function(key) {
  if (running == true) {
    if (key.which == 37) {
      $("#left-arrow").css("transform", "translateY(4px)");
      userKeyDownAction("left-arrow");
    }
    if (key.which == 39) {
      $("#right-arrow").css("transform", "translateY(4px)");
      userKeyDownAction("right-arrow");
    }
    if (key.which == 32) {
      $("#spacebar").css("transform", "translateY(4px)");
      userKeyDownAction("spacebar");
    }
  }
})

$(document).keyup(function(key) {
  if (running == true) {
    if (key.which == 37) {
      $("#left-arrow").css("transform", "");
    }
    if (key.which == 39) {
      $("#right-arrow").css("transform", "");
    }
    if (key.which == 32) {
      $("#spacebar").css("transform", "");
    }
  }
})

// if user uses mouse to play
$("#left-arrow").on("mousedown", function() {
  if (running == true) {
    userKeyDownAction("left-arrow");
  }
})

$("#right-arrow").on("mousedown", function() {
  if (running == true) {
    userKeyDownAction("right-arrow");
  }
})

$("#spacebar").on("mousedown", function() {
  if (running == true) {
    userKeyDownAction("spacebar");
  }
})
