$(function () {
  $(".timeline-date").datetimepicker({
    timepicker: false,
    format: 'Y,m,d'
  });

  $('#submit').click(function () {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/timeline',
      data: {
        "startDate": $('.timeline-date').val(),
        "headline": $('.timeline-release').val(),
        "text": $('.timeline-description').val()
      },
      complete: function () {
        location.reload();
      },
      dataType: 'application/json'
    });
  });
});

