$(function () {
  $(".timeline-date").datetimepicker({
    timepicker: false,
    format: 'Y-m-d'
  });

  var id = $(location)[0].search.split('=')[1];
  var allEvents = JSON.parse(localStorage.allEvents);
  console.log('id ', id);

  var updatedItem = allEvents.filter(function(evt) {
    return evt.id == id;
  })[0];

  display(updatedItem);


  $('#submit').click(function (e) {
    e.preventDefault();
    var updated = {
      id: id || new Date().getTime(),
      date: $('.timeline-date').val(),
      content: {
        title: $('.timeline-release').val(),
        content: $('.timeline-description').val()
      }
    };

    allEvents = updateEvent(updated);

    localStorage.setItem("allEvents", JSON.stringify(allEvents));
    window.location.href = "/timeline/dist/";
  });

  function display(up) {
    $('.timeline-date').val(up.date);
    $('.timeline-release').val(up.content.title);
    $('.timeline-description').val(up.content.content);
  }

  function updateEvent(item) {
    return allEvents.map(function(evt) {
      if (evt.id == item.id) {
        return item;
      }

      return evt;
    });
  }
});

