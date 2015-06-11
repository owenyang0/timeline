var margin = {top: 50, right: 30, bottom: 50, left: 30},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var t1 = new Date(2015, 0, 1),
    t2 = new Date(2016, 0, 1),
    t0 = d3.time.month.offset(t1, 0),
    t3 = d3.time.month.offset(t2, 0);


var x = d3.time.scale()
    .domain([t0, t3])
    .range([t0, t3].map(d3.time.scale()
      .domain([t1, t2])
      .range([0, width])))

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(10, 0);

var xLinear = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var xAxisPot = d3.svg.axis()
    .scale(xLinear)
    .orient("bottom")
    .ticks(120)
    .tickSize(10, 0);

var svg = d3.select(".time-line").append("svg")
    .attr('class', 'tick-mark')
    .attr("width", width + margin.left + margin.right)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var svg2 = d3.select(".time-line").append("svg")
    .attr('class', 'tick-pot')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 5 + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 50 + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 20)
    .attr("x", -10)
    .style("text-anchor", "start")

svg2.append("g")
    .attr("class", "x axis x-ticks")
    .call(xAxisPot)
  .selectAll("text")
    .style("display", "none")

var ticks = svg.selectAll('.tick');

ticks.select('g')
  .append("text")
  .attr("y", 220)
  .attr("x", -10)
  .text('Text')

ticks.each(function (t) {
  d3.select(this).selectAll('line').remove();
  d3.select(this).append('circle').attr('r', 3).attr('fill', randomColor())
})

function randomColor() {
  var r = Math.random() * 255;
  var g = Math.random() * 255;
  var b = Math.random() * 255;

  return d3.rgb(r, g, b);
}


var dropPath = "M22.5 81.2h-1.2000000000000002c-.3 0-.6 0-.9-.1h-.4c-.2 0-.4 0-.5-.1-4.8-.7-9.3-2.9-12.8-6.4-4.2-4.2-6.5-9.6-6.7-15.3v-5.5c0-.2 0-.3.1-.5 0-.2 0-.3.1-.5 0-.2 0-.3.1-.5 0-.1 0-.3.1-.4l.1-.5c0-.1 0-.3.1-.4l.1-.6c0-.1 0-.2.1-.3l.2-.7v-.1c1.6-6.4 5.1-10.7 8.8-15.2 5.8-7.1 12.5-15.3 12.5-34 0 0 0-.1.1-.1h.1s.1 0 .1.1c0 18.7 6.6 26.9 12.3 34.2 4.9 6.2 9.6 12.1 9.6 23.4v1.1c.1 12.3-9.8 22.4-22 22.4zm21.9-24.6v1.1-1.1zm-.2-2.9zm.1.9v.2-.2zm0 1v.5-.5zm.1 3.7z";
function addDate(date, text) {
  var xPos = x(date);

  var g = svg2.select('.axis')
    .append('g')
    .attr('class', 'ticks-new')
    .attr("transform", "translate(" + xPos + ",0)");

  var y2 = getRandomArbitrary(50, 300);

  function mo() {
    var parent = d3.select(this.parentNode);

    parent.select('line')
      .style('stroke-opacity', 1);
    parent.select('.water-drop')
      .style('fill-opacity', 1)
  }

  function mout() {
    var parent = d3.select(this.parentNode);

    parent.select('line')
      .style('stroke-opacity', .5);
    parent.select('.water-drop')
      .style('fill-opacity', 0.5)
  }

  var lineColor = randomColor();

  g.append('circle')
    .attr('transform', 'translate(0, ' + 0 +')')
    .attr('r', 3)
    .attr('fill', randomColor())


  g
    .append('path')
    .attr('class', 'water-drop')
    .attr({d: dropPath})
    .attr('transform', 'translate(-7, ' + 15 +') scale(0.3)')
    .attr('fill', lineColor)
    .style("stroke", 'none')
    .on('mouseenter', mo)
    .on('mouseout', mout)

  g
    .append('line')
    .attr('x1', 0)
    .attr('y1', 38)
    .attr('x2', 0)
    .attr('y2', y2)
    .style("stroke-width", 1)
    .style("stroke", lineColor)
    .style("stroke-opacity", .5)
    .style("fill", "none")
    .on('mouseover', mo)
    .on('mouseout', mout)

  g.append('text')
    .attr('class', 'release-desc')
    .attr("y", y2 + 20)
    .attr("x", -10)
    .text(text)
}

function r(name) {
  var date = getRandomArbitrary(t1.valueOf(), t2.valueOf());
  addDate(date, name)
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var re = ['GCIS BAU', 'Ignite R3', 'AAMI Release', 'Data Clobber', 'GIO Packages']

for (var i = 4; i >= 0; i--) {
  r(re[i]);
};
