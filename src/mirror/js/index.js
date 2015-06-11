function renderData(data) {
  console.log(data);
  data.forEach(function(d) {
    var date = new Date(d.date);
    addDate(date, d.content);
  })
}

$(function () {
  if (!localStorage.allEvents) {
    localStorage.setItem("allEvents", "[]");
  }
  renderData(JSON.parse(localStorage.allEvents));
});

