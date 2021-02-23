document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, options);
});

// Or with jQuery

$(document).ready(function () {
  $("select").formSelect();
});
var instance = M.Tabs.init(el, options);

// Or with jQuery

$(document).ready(function () {
  $(".tabs").tabs();
});
