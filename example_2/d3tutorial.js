// This is called a closure which makes sure that all variables stay local.
// Start script when everything is loaded properly.
window.onload = (function () {

    var base_url = 'https://ecoengine.berkeley.edu/api/search/?q=';

    // creating scales
    var yscale = d3.scale.linear()
        .domain([0, 100])
        .range([300, 0]);

    var xscale = d3.scale.ordinal()
        .rangePoints([0, 280]);

    // creating canvas
    var canvas = d3.select('#canvas')
        .append('svg:svg')
        .style('width', '400px')
        .style('height', '420px');

    /* The bar graph container (every container can hold its own transitions
    allowing for placing element in space: offset, rotation, zoom). It also gets
    added to the canvas (the svg element) */
    var g = canvas.append('svg:g')
        .attr('transform', 'translate(100, 20) scale(1, 1)')

    // mapping scales into axes
    var axis = d3.svg.axis()
        .orient('left')
        .scale(yscale);

    var categories = d3.svg.axis()
        .orient('bottom')
        .scale(xscale)

    // the container for the y-axis
    var yaxis = canvas.append('svg:g')
        .attr('class', 'axis')
        .attr('transform', 'translate(60, 20) scale(1, 1)')
        .call(axis);

    // the container for the x-axis
    var xaxis = canvas.append('svg:g')
        .attr('class', 'xaxis')
        .attr('transform', 'translate(100, 320) scale(1, 1)')
        .call(categories)

    // creating color scale (just called by index)
    var colors = d3.scale.category20()

    var update = function (data) {
        // This selection is the same for appending, updating, and removing elements
        // for this reason I am using a variable here. I think this pattern makes it
        // little bit more clear why we are using selectAll here
        var rect = g.selectAll('rect').data(data);
        // Append new data points.
        rect.enter().append('rect');
        // Updating existing data points (including the ones created above).
        rect
           .attr('x', function (d, i) {return xscale(d[0])})
           .attr('y', function (d, i) {return yscale(d[1])})
           .attr('height', function (d, i) {return yscale(0)-yscale(d[1])})
           .attr('width', 20)
           .attr('fill', function (d, i) {return colors(i)})
           // showing data on mouse click event, then update viz
           .on('click', function (d, i) {alert(d[0] + ': n=' + d[1]);});
        // Remove elements that are not longer covered by data.
        rect.exit().remove();
    };

    var loaddata = function(url) {
        // API call
        d3.json(url, function(d) {
            // formatting data
            var data = d['fields']['state_province'];
            // update graphing parameters
            var max = d3.max(data, function(d) {return d[1]})
            yscale.domain([0, max+10]);
            axis.scale(yscale);
            yaxis.call(axis);
            xscale.domain(data.map(function(d) {return d[0]}))
            categories.scale(xscale)
            xaxis.call(categories)
                .selectAll('text')
                .style("text-anchor", "end")
                .attr("transform", function(d) {
                    return "rotate(-65)"
                })
            update(data);
    })};

    // attach data loading and update to the selectors
    d3.select('select#selector').on('change', function() {
        value = d3.select('select#selector').node().value;
        url = base_url + value;
        loaddata(url);
    });

    // initial load of the graph
    loaddata(base_url + 'lynx');

}())
