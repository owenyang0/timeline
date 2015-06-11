function renderData(data) {
  console.log(data);
  data.forEach(function(d) {
    var date = new Date(d.date);
    addDate(date, d.content);
  })
}

$(function () {
  $.ajax({
    type: 'GET',
    'url': 'http://localhost:3000/timeline/fancy',
    success: function (doc) {
      renderData(doc);
    }
  });
});

