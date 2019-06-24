const FP = new fullpage('#fullpage', {
  autoScrolling: true,
  navigation: true,
  anchors: ["page1", "page2", "page3"]
});

document.getElementById('scroll-down').addEventListener('click', function () {
  fullpage_api.moveSectionDown();
});

var clientHeight = document.getElementById('chart').offsetHeight;
var margin = { top: 40, right: 20, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = clientHeight - margin.top - margin.bottom;

var formatPercent = d3.format(".1f"); // Value formats https://github.com/d3/d3-format

var colorPool = d3.scale.category20();

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Value:</strong> <span style='color:red'>" + d.value + "</span>"; // create Y axis with label and values
  })

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

fetch('https://demo2708427.mockable.io/users') //API request
  .then(response => response.json())
  .then(json => {
    x.domain(json.map(function (d) { return d.name; })); //parse Name key for X axis
    y.domain([0, d3.max(json, function (d) { return d.value; })]); //parse Value key for Y axis

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value"); // set label text for tooltip

    svg.selectAll(".bar")
      .data(json)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", function (d, i) { return colorPool(i); })
      .attr("x", function (d) { return x(d.name); }) //set X with Name key
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.value); }) // set Y with Value key
      .attr("height", function (d) { return height - y(d.value); })// set height with Value key
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  })