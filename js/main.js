const FP = new fullpage('#fullpage', {
  autoScrolling: true,
  navigation: true,
});

document.getElementById('scroll-down').addEventListener('click', function () {
  fullpage_api.moveSectionDown();
});