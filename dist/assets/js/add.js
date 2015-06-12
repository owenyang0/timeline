$(function () {
  if (!localStorage.allEvents) {
    window.location.href = "/timeline/dist/";
  } else {
    console.log(localStorage.allEvents);
  }

  $(".timeline-date").datetimepicker({
    timepicker: false,
    format: 'Y-m-d'
  });

  $('#submit').click(function (e) {
    e.preventDefault();
    var allEvents = JSON.parse(localStorage.allEvents);
    allEvents.push({
      "id": new Date().getTime(),
      "date": $('.timeline-date').val(),
      "content": {
        "title": $('.timeline-release').val(),
        "content": $('.timeline-description').val()
      }
    });
    localStorage.setItem("allEvents", JSON.stringify(allEvents));
    window.location.href = "/timeline/dist/";
  });
});

