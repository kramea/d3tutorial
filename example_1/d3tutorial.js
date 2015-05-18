// This is called a closure which makes sure that all variables stay local.
// Start script when everything is loaded properly.
window.onload = (function () {
    var data = [['red', 0],
                ['green', 30],
                ['blue', 60]];
    var canvas = d3.select('#canvas').append('svg:svg');
    var update = function (data) {
        // This selection is the same for appending, updating, and removing elements
        // for this reason I am using a variable here. I think this pattern makes it
        // little bit more clear why we are using selectAll here
        var rects = canvas.selectAll('rect').data(data);
        // Append new data points.
        rects.enter().append('rect');
        // Updating existing data points (including the ones created above).
        rects
           .attr('fill', function(d, i) {return d[0]})
           .attr('x', function(d, i) {return d[1] + 20})
           .attr('y', 20)
           .attr('height', 20)
           .attr('width', 20)
           // modify data on mouse click event, then update viz
           .on('click', function (d, i) {
               data.splice(i, 1);
               update(data);
           });
        // Remove elements that are not longer covered by data.
        rects.exit().remove();
    };
    update(data);
}())
