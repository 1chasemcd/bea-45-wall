window.addEventListener('orientationchange', function(event){ setTimeout(onChange, 200); });
window.addEventListener("load", function() {setup();}, false);

var wall;
var topNav;
var canvas;
var img;
var pullup;
var inroute;
var lowDiv;
var routeId;

function setup() {
  //Locate HTML elements
  topNav = document.getElementById("topnav");
  canvas = document.getElementById("viewcanvas");
  img = document.getElementById("img");
  pullup = document.getElementById("pullup");
  inroute = document.getElementById("inroute");
  lowDiv = document.getElementById("bottom");
  routeId = location.hash.substr(1);

  setupRoute(routeId);

  // Setup canvas
  canvas.style.marginTop = topNav.offsetHeight - 20 + "px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * (1200/900);
  wall = new Wall(canvas, img);
  setupHolds(routeId);

  onChange();
}

function onChange() {
  // Code for sticky bottom tab
  var stickyY = inroute.offsetTop - window.innerHeight;
  if (window.innerHeight > canvas.height + topNav.offsetHeight){
    pullup.classList.add("pullupmove");
    pullup.classList.remove("pullupfixed");
  }
  window.onscroll = function() {
    if (window.pageYOffset > stickyY) {
      pullup.classList.add("pullupmove");
      pullup.classList.remove("pullupfixed");
    } else {
      pullup.classList.remove("pullupmove");
      pullup.classList.add("pullupfixed");
    }
  }

// Code for bottom spacefiller div
  if (window.innerHeight > canvas.height + topNav.offsetHeight){
    lowDiv.style.height = (window.innerHeight -
    (inroute.offsetTop + 246)) + 2 + "px";
  } else {
    lowDiv.style.height = "0px";
  }
}

function setupHolds(i) {
  database.ref("holds/" + i + "/").once("value").then(function(snapshot) {
    wall.setHolds(snapshot.child("list").val())
    wall.draw();
  });
}

function setupRoute(i) {
  database.ref("/routes/" + i + "/").once("value").then(function(snapshot) {
    addHTMLInRoute(snapshot.child("name").val(),
    snapshot.child("setter").val(), snapshot.child("grade").val());
  });
}

function addHTMLInRoute(name, setter, grade) {
  inroute.innerHTML = "";
  var div = document.createElement("div");
  var nameHeading = document.createElement("h3");
  var setterHeading = document.createElement("h4");
  var gradeHeading = document.createElement("h4");

  var nameText = document.createTextNode(name);
  var setterText = document.createTextNode("Setter: " + setter);
  var gradeText = document.createTextNode("Grade: " + grade);

  nameHeading.appendChild(nameText);
  setterHeading.appendChild(setterText);
  gradeHeading.appendChild(gradeText);

  inroute.appendChild(nameHeading);
  inroute.appendChild(setterHeading);
  inroute.appendChild(gradeHeading);
}

// Return to the main page.
function openIndex() {
  location.href='index.html';
}

// Slowly scroll to bottom on tab click.
function scrollToBottom() {
  window.scrollBy(0,10);
  if (window.pageYOffset < document.body.scrollHeight
    - window.innerHeight) {
    scrolldelay = setTimeout(scrollToBottom, 5);
  }
}
