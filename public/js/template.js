var arr = [];
var as = [];
var obj;
var s = "";
var s2 = "";
function add() {
  var x = document.getElementById("name1");
  var pqx = document.getElementById("name2");
  var s1,
    d = "Hello";
  var option = document.getElementById("options").value;
  obj = {
    question: x.value,
    answer: pqx.value,
    options: option,
    noOfItem: [],
  };
  arr.push(obj);
  printData();
  //   if (option == "radio") {
  //     s +=
  //       "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
  //       x.value +
  //       "</p><input type='radio'><p id='changes'>" +
  //       d +
  //       "</p><input placeholder='Form description' style='width:90px;' type='text' id='name2' required/><a class='add btn-floating btn-large waves-effect waves-light blue' onclick='addOption(this)'><i class='material-icons'>+</i></a></div></div>";
  //     document.getElementById("contentItems").innerHTML = s;
  //   } else {
  //     s +=
  //       "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
  //       x.value +
  //       "</p><input placeholder='Form description' type='text' id='name' required/></div></div>";
  //     document.getElementById("contentItems").innerHTML = s;
  //   }
}
function printData() {
  s1 = "";
  arr.map(function (item, index) {
    if (item.options == "radio" || item.options == "checkbox") {
      s +=
        "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
        item.question +
        "</p><p class='card-text'>Answer: " +
        item.answer +
        "</p><input type='radio'><p id='changes'></p><input placeholder='Form description' class=" +
        index +
        " style='width:200px;' type='text' id='name2' required/><a id=" +
        index +
        " class='add btn-floating btn-large waves-effect waves-light blue' onclick='addOption(this)'><i class='material-icons'>+</i></a><p>";
      if (item.noOfItem != []) {
        item.noOfItem.map(function (items, oindex) {
          s +=
            "<input type='checkbox' style='margin-bottom:10px' checked='checked' " +
            +"class=" +
            index +
            "></input>" +
            items +
            "<button value=" +
            oindex +
            " id=" +
            index +
            " class='btn btn-sm btn-danger' style='margin-left:15px;margin-bottom:10px;' onclick='deleteItem(this)'><i class='fas fa-trash'></i></button><br>";
        });
      }
      s +=
        "</p></div><button id=" +
        index +
        " class='btn btn-danger' onclick='deleteOption(this)'>Remove</button></div>";
    } else if (item.options == "text") {
      s +=
        "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
        item.question +
        "</p><input placeholder='Form description' type='text' id='name2' required/></div><button id=" +
        index +
        " class='btn btn-danger' onclick='deleteOption(this)'>Remove</button></div>";
    } else if (item.options == "textarea") {
      s +=
        "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
        item.question +
        "</p><textarea rows='5' id=" +
        index +
        "></textarea></div><button id=" +
        index +
        " class='btn btn-danger' onclick='deleteOption(this)'>Remove</button></div>";
    } else if (item.options == "email") {
      s +=
        "<div class='card'><div class='card-body'><hr/><p class='card-text'>" +
        item.question +
        "</p><input placeholder='Form description' type='email' id='name2' required/></div><button id=" +
        index +
        " class='btn btn-danger' onclick='deleteOption(this)'>Remove</button></div>";
    } else {
      s +=
        "<div class='card'><div class='card-body'><hr/><input placeholder='Form description' type=" +
        item.options +
        " id='name2' required/></div><button id=" +
        index +
        " class='btn btn-danger' onclick='deleteOption(this)'>Remove</button></div>";
    }
    document.getElementById("contentItems").innerHTML = s;
  });
  s = "";
}
function addOption(e) {
  // var p = document.getElementById("changes");
  // var ad = document.getElementById("name2").value;
  // as.push(ad);
  // as.map(function (item, index) {
  //   s2 += "<p id='changes'>" + item + "</p>";
  //   p.innerHTML = s2;
  // });
  // s2 = "";
  console.log(e);
  arr[e.id].noOfItem.push(document.getElementsByClassName(e.id)[0].value);
  console.log(arr[e.id]);
  printData();
  //   p.innerHTML = ad;
}
function deleteItem(e) {
  arr[e.id].noOfItem.splice(e.value, 1);
  printData();
}
function deleteOption(e) {
  console.log(e);
  arr.splice(e.id, 1);
  console.log(arr);
  printData();
}
function openNav() {
  var x = document.getElementById("mySidepanel");
  if (x.style.display === "none") {
    x.style.display = "block";
    x.style.width = "22vw";
  } else {
    x.style.width = "0";
    x.style.display = "none";
  }
}
function apply() {
  document.querySelector("body").style.color = document.getElementById(
    "color"
  ).value;
  document.querySelector(
    ".top"
  ).style.backgroundColor = document.getElementById("color1").value;
  document.querySelector(".main").style.fontSize =
    document.getElementById("fsize").value + "px";
  document.querySelector(".main").style.fontFamily = document.getElementById(
    "ffamily"
  ).value;

  if (document.getElementById("image1").value == "") {
    document.querySelector("body").style.backgroundImage = "url()";
    document.querySelector(
      "body"
    ).style.backgroundColor = document.getElementById("bgcolor").value;
  } else {
    document.querySelector("body").style.backgroundColor = "#3b8cb5";
    document.querySelector("body").style.backgroundImage =
      "url(document.getElementById('image1').value)";
  }
  printData();
}
    function submit(event){
        var linke = event.target.dataset.user;

        try{
            const res = await fetch('/compose/'+linke,{
              method:'POST',
              body:JSON.stringify(arr),
              headers:{'Content-Type':'application/json'}
          })
          const data = await res.json();


          location.assign('/data/'+ linke);
        // changew this later to new page
        }catch(err){
            console.log(err);
          }
    }


    