// This is called a closure which makes sure that all variables stay local.
// Start script when everything is loaded properly.
window.onload = (function () {
    var data = [10, 20, 30];
    var canvas = d3.select('#canvas').append('svg:svg');
    var update = function (data) {
        // This selection is the same for appending, updating, and removing elements
        // for this reason I am using a variable here. I think this pattern makes it
        // little bit more clear why we are using selectAll here
        var circles = canvas.selectAll('circle').data(data);
        // Append new data points.
        circles.enter().append('circle');
        // Updating existing data points (including the ones created above).
        circles
           .attr('cx', function (d, i) {return d * 6})
           .attr('cy', 40)
           .attr('r', function (d, i) {return d})
           .attr('fill', 'blue')
           // modify data on mouse click event, then update viz
           .on('click', function (d, i) {
               data.splice(i, 1);
               update(data);
           });
        // Remove elements that are not longer covered by data.
        circles.exit().remove();
    };
    update(data);
}())