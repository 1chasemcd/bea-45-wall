window.addEventListener('orientationchange', function(event){ setTimeout(onChange, 200); });
window.addEventListener("load", function() {onLoad();}, false);

var topNav;
var canvas;
var img;
var inroute;
var form;
var lowDiv;
var wall;
var warningLabel;
var focused = false;
var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function onLoad() {
  //Locate HTML elements
  topNav = document.getElementById("topnav");
  canvas = document.getElementById("viewcanvas");
  img = document.getElementById("img");
  inroute = document.getElementById("inroute");
  form = document.getElementById("routeform");
  lowDiv = document.getElementById("bottom");
  warningLabel = document.getElementById("warningLabel");

  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * (1200/900);
  wall = new Wall(canvas, img);

  canvas.addEventListener('click', function(event) {
    wall.update(event.pageX, event.pageY);
    wall.draw();
  });

  // Code for form submit
  form.onsubmit = function(e) {
    e.preventDefault();
    formSubmit();
  };

  onChange();

  setInterval(inputSafety, 100);
}

function formSubmit(e) {
  var name = form.elements["name"].value;
  var setter = form.elements["setter"].value;
  var grade = form.elements["grade"].value;

  if (name == "") {
    warningLabel.innerHTML = "<br>⚠️ Enter Route Name ⚠️";
    return false;
  }

  if (setter == "") {
    warningLabel.innerHTML = "<br>⚠️ Enter Setter Name ⚠️";
    return false;
  }

  if (grade == "v" || grade == "") {
    warningLabel.innerHTML = "<br>⚠️ Enter Route Grade ⚠️";
    return false;
  }

  if (wall.holds.length < 2) {
    warningLabel.innerHTML = "<br>⚠️ Select at Least 2 Holds ⚠️";
    return false;
  }

  database.ref("/routes").once("value").then( function(snapshot) {
    var i = 0;
    if (snapshot.numChildren() != 0) {
      snapshot.forEach(function(childSnapshot) {
        if (i == snapshot.numChildren() - 1) {
          writeRouteData(parseInt(childSnapshot.key) + 1, name, setter, grade);
        }
        i++;
      })
    } else {
      writeRouteData("0", name, setter, grade);
    }
  });

  // Return false to prevent the default form behavior
  return false;
}

function onChange() {
  // Setup canvas
  canvas.style.marginTop = topNav.offsetHeight - 20 + "px";
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * (1200/900);
  wall.changeCanvas(canvas);

// Code for bottom spacefiller div
  if (window.innerHeight > canvas.height + topNav.offsetHeight){
    lowDiv.style.height = (window.innerHeight -
    (inroute.offsetTop + inroute.offsetHeight)) + 2 + "px";
  } else {
    lowDiv.style.height = "0px";
  }
}

function writeRouteData(index, name, setter, grade) {
  database.ref("routes/" + index).set({
    name: name,
    setter: setter,
    grade: grade
  }, function(error) {
    if (error) {
      document.write(error);
    } else {
      writeHoldData(index);
    }
  });
}

function writeHoldData(index) {
  database.ref("holds/" + index).set({
    list: wall.getHolds()
  }, function(error) {
    if (error) {
      document.write(error);
    } else {
      openIndex();
    }
  });
}

// Return to the main page.
function openIndex() {
  location.href='index.html';
}

function inputSafety() {
  if (focused && form.elements["grade"].value.length == 0) {
    form.elements["grade"].value = "v";
  } else if (focused == false && form.elements["grade"].value == "v") {
    form.elements["grade"].value = "";
  }

  if (focused && form.elements["grade"].value[0] != "v") {
    form.elements["grade"].value = "v" + form.elements["grade"].value[0];
  }

  if (form.elements["grade"].value.length > 1 &&
      !digits.includes(form.elements["grade"].value[form.elements["grade"].value.length - 1])) {
    form.elements["grade"].value = form.elements["grade"].value.substring(0, form.elements["grade"].value.length - 1);
  }
}
