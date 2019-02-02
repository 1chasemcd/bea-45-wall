//window.addEventListener('resize', function(event){setup()});
window.addEventListener("load", function() {setup()}, false);

function setup() {
  var topNav = document.getElementById("topnav");
  var content = document.getElementById("content");

  content.style.marginTop = topNav.offsetHeight + 16 + "px";
  getRouteData();
}

function getRouteData() {
  database.ref("/routes").on("value", function(snapshot) {
    content.innerHTML = "";
    snapshot.forEach( function(childSnapshot) {
      addHTMLRoute(childSnapshot.key,
        childSnapshot.child("name").val(),
        childSnapshot.child("setter").val(),
        childSnapshot.child("grade").val());
    })
  });
}

function addHTMLRoute(i, name, setter, grade) {
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

  div.appendChild(nameHeading);
  div.appendChild(setterHeading);
  div.appendChild(gradeHeading);

  content.insertBefore(div, content.childNodes[0]);
  div.classList.add("route");
  div.setAttribute("onclick", "openRoute(" + i + ")");
}

function openRoute(i) {
  location.href='viewroute.html#' + i;
}

function openNew() {
  location.href='newroute.html';
}
