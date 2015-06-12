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
        "title":"GCIS BAU",
        "content":"Improved the performance of the Cogen Customer Excluder job. It used to take 6.5 hours, now it will only take 2.5 hours."
      }
    },
    {
      "id":1434027472772,
      "date":"2015-07-13",
      "content":
      {
        "title":"AAI NZ",
        "content":"Search by phone number functinality. Now QuickAssist can let the consultant search customers' information by his/her phone number for NZ customers."
      }
    },
    {
      "id":1434027472773,
      "date":"2015-07-28",
      "content":
      {
        "title":"GIO Packages",
        "content":"GIO Packages Renew products release. Now GCIS will have a ability to add a new Protect customer who is renewal from the legacy Cogen System customer."
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

