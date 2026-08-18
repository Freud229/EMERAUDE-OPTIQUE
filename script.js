document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('navBurger');
  var liens = document.getElementById('navLiens');
  if (burger && liens) {
    burger.addEventListener('click', function () {
      liens.classList.toggle('ouvert');
    });
    liens.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { liens.classList.remove('ouvert'); });
    });
  }
});
