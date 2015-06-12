function renderData(data) {
  console.log(data);
  data.forEach(function(d) {
    var date = new Date(d.date);
    addDate(date, d.content);
  })
}

function initData() {
  return [
    {
      "id":1434027472771,
      "date":"2015-06-13",
      "content":
      {
        "title":"Project BAU",
        "content":"Improved the performance of one the batch jobs. It used to take 6.5 hours, now it will only take 1.3 hours."
      }
    },
    {
      "id":1434027472772,
      "date":"2015-07-13",
      "content":
      {
        "title":"Search Customers",
        "content":"Search by phone number functinality. Now our application can let the customer search his/her information by phone numbers."
      }
    },
    {
      "id":1434027472773,
      "date":"2015-07-28",
      "content":
      {
        "title":"Hot Fix",
        "content":"Hot fix release. Now our application will be able to add a new customer with his/her detailed information, e.g. name, phone number, abn, etc."
      }
    }
  ];
}

$(function () {
  if (!localStorage.allEvents) {
    localStorage.setItem("allEvents", JSON.stringify(initData()));
  } else {
    console.log(localStorage.allEvents);
  }
  renderData(JSON.parse(localStorage.allEvents));
});

