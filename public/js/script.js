var minimize = document.getElementById("minimize");
var square = document.getElementById("square");
var exit = document.getElementById("exit");
var titleBar = document.getElementById("title-bar");

var minimizeOwa = document.getElementById("minimize-owa");
var squareOwa = document.getElementById("square-owa");
var exitOwa = document.getElementById("exit-owa");
var titleBarOwa = document.getElementById("title-bar-owa");

////////////////// Hover listeners //////////////////
minimize.addEventListener("mouseover", function handleMouseOver() {
  minimize.style.backgroundColor = "#272727";
  minimize.style.cursor = "context-menu";
});

minimize.addEventListener("mouseout", function handleMouseOut() {
  minimize.style.backgroundColor = "black";
  minimize.style.cursor = "default";
});

minimizeOwa.addEventListener("mouseover", function handleMouseOver() {
  minimizeOwa.style.backgroundColor = "#272727";
  minimizeOwa.style.cursor = "context-menu";
});

minimizeOwa.addEventListener("mouseout", function handleMouseOut() {
  minimizeOwa.style.backgroundColor = "black";
  minimizeOwa.style.cursor = "default";
});

square.addEventListener("mouseover", function handleMouseOver() {
  square.style.backgroundColor = "#272727";
  square.style.cursor = "context-menu";
});

square.addEventListener("mouseout", function handleMouseOut() {
  square.style.backgroundColor = "black";
  square.style.cursor = "default";
});

squareOwa.addEventListener("mouseover", function handleMouseOver() {
  squareOwa.style.backgroundColor = "#272727";
  squareOwa.style.cursor = "context-menu";
});

squareOwa.addEventListener("mouseout", function handleMouseOut() {
  squareOwa.style.backgroundColor = "black";
  squareOwa.style.cursor = "default";
});

exit.addEventListener("mouseover", function handleMouseOver() {
  exit.style.backgroundColor = "red";
  exit.style.cursor = "context-menu";
});

exit.addEventListener("mouseout", function handleMouseOut() {
  exit.style.backgroundColor = "black";
  exit.style.cursor = "default";
});

exitOwa.addEventListener("mouseover", function handleMouseOver() {
  exitOwa.style.backgroundColor = "red";
  exitOwa.style.cursor = "context-menu";
});

exitOwa.addEventListener("mouseout", function handleMouseOut() {
  exitOwa.style.backgroundColor = "black";
  exitOwa.style.cursor = "default";
});

titleBar.addEventListener("mouseover", function handleMouseOver() {
  titleBar.style.cursor = "context-menu";
});

titleBar.addEventListener("mouseout", function handleMouseOver() {
  titleBar.style.cursor = "default";
});

titleBarOwa.addEventListener("mouseover", function handleMouseOver() {
  titleBarOwa.style.cursor = "context-menu";
});

titleBarOwa.addEventListener("mouseout", function handleMouseOver() {
  titleBarOwa.style.cursor = "default";
});
//////////////// Make window draggable start ////////////////
// Make the DIV element draggable:
var draggable = $("#window");
var title = $("#title-bar");


var draggableOwa = $("#window-owa");
var titleOwa = $("#title-bar-owa");

title.on("mousedown", function (e) {
  var dr = $(draggable).addClass("drag");
  height = dr.outerHeight();
  width = dr.outerWidth();
  (ypos = dr.offset().top + height - e.pageY),
    (xpos = dr.offset().left + width - e.pageX);
  $(document.body)
    .on("mousemove", function (e) {
      var itop = e.pageY + ypos - height;
      var ileft = e.pageX + xpos - width;
      if (dr.hasClass("drag")) {
        dr.offset({ top: itop, left: ileft });
      }
    })
    .on("mouseup", function (e) {
      dr.removeClass("drag");
    });
});


titleOwa.on("mousedown", function (e) {
  var dr = $(draggable).addClass("drag");
  height = dr.outerHeight();
  width = dr.outerWidth();
  (ypos = dr.offset().top + height - e.pageY),
    (xpos = dr.offset().left + width - e.pageX);
  $(document.body)
    .on("mousemove", function (e) {
      var itop = e.pageY + ypos - height;
      var ileft = e.pageX + xpos - width;
      if (dr.hasClass("drag")) {
        dr.offset({ top: itop, left: ileft });
      }
    })
    .on("mouseup", function (e) {
      dr.removeClass("drag");
    });
});
//////////////// Make window draggable end ////////////////

////////////////// Onclick listeners //////////////////
// X button functionality
$("#exit").click(function () {
  document.getElementById("login-btn").style.border =
    "1px solid rgb(39, 39, 39)";
  $("#lgImg").show();
  $("#lg-arrow").show();
  $("#lg-text").show();
  $("#login-spinner").hide();
  $("#window").css("display", "none");
});

$("#exit-owa").click(function () {
  document.getElementById("login-btn-owa").style.border =
    "1px solid rgb(39, 39, 39)";
  $("#lgImg-owa").show();
  $("#lg-arrow-owa").show();
  $("#lg-text-owa").show();
  $("#login-spinner-owa").hide();
  $("#window-owa").css("display", "none");
});

// Maximize button functionality
$("#square").click(enlarge);

$("#square-owa").click(enlargeOwa);

function enlarge() {
  if (square.classList.contains("enlarged")) {
    $("#window").css("width", "40%");
    $("#title-bar-width").css("width", "100%").css("width", "+=2px");
    $("#content").css("width", "100%");
    $("#square").removeClass("enlarged");
  } else {
    $("#window").css("width", "70%");
    $("#title-bar-width").css("width", "100%").css("width", "+=2px");
    $("#content").css("width", "100%");
    $("#square").addClass("enlarged");
  }
}

function enlargeOwa() {
  if (squareOwa.classList.contains("enlarged")) {
    $("#window-owa").css("width", "40%");
    $("#title-bar-width-owa").css("width", "100%").css("width", "+=2px");
    $("#content-owa").css("width", "100%");
    $("#square-owa").removeClass("enlarged");
  } else {
    $("#window-owa").css("width", "70%");
    $("#title-bar-width-owa").css("width", "100%").css("width", "+=2px");
    $("#content-owa").css("width", "100%");
    $("#square-owa").addClass("enlarged");
  }
}

//// Pop-up appear on click with delay ////
$("#login-btn").click(function () {
  document.getElementById("login-btn").style.border = "none";
  $("#lgImg").hide();
  $("#lg-arrow").hide();
  $("#lg-text").hide();
  $("#login-spinner").show();
  setTimeout(function () {
    $("#window").fadeIn(10);
  }, 1000);
});
$("#login-btn-2").click(function () {
  document.getElementById("login-btn-2").style.border = "none";
  
  setTimeout(function () {
    $("#window").fadeIn(10);
  }, 1000);
});

$("#login-btn-owa").click(function () {
  document.getElementById("login-btn-owa").style.border = "none";
  $("#lgImg-owa").hide();
  $("#lg-arrow-owa").hide();
  $("#lg-text-owa").hide();
  $("#login-spinner-owa").show();
  setTimeout(function () {
    $("#window-owa").fadeIn(10);
  }, 1000);
});
$("#login-btn-2-owa").click(function () {
  document.getElementById("login-btn-2-owa").style.border = "none";
  
  setTimeout(function () {
    $("#window-owa").fadeIn(10);
  }, 1000);
});

// setTimeout(function () {
//   $("#loader").hide();
//   $("#sign-in").show();
// }, 3000);
