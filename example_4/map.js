window.onload = (function () {
// mostly adapted from http://bost.ocks.org/mike/map/

var width = 500,
    height =500;

var svg = d3.select('#canvas').append('svg')
    .attr('width', width)
    .attr('height', height)

d3.json('ca_counties.json', function(error, data) {
    if (error) return console.error(error);

    var counties = topojson.feature(data, data.objects.ca_counties);

    var projection = d3.geo.mercator()
        .scale(2000)
        .center([-119.5, 37.15])
        .translate([width/2, height/2]);

    var path = d3.geo.path().projection(projection);

    var colorscale = d3.scale.linear()
        .range(['darkred', 'white', 'darkgreen'])
        .domain([-0.025, 0, 0.025])

    svg.selectAll('.counties')
        .data(counties.features)
    .enter().append('path')
        .attr('d', path)
        .attr('stroke', 'white')
        .attr('stroke-width', .3)
        .attr('fill', function(d, i) {
            change = (d.properties.POP2012 - d.properties.POP2010)/d.properties.POP2010
            return colorscale(change)
        })

    legend_entries = [
        [0, -.025, '2.5% loss'],
        [1, -.01, '1% loss'],
        [2, 0, 'no change'],
        [3, .01, '1% gain'],
        [4, .025, '2.5% gain']
    ]

    svg.selectAll('rect')
        .data(legend_entries)
    .enter().append('rect')
        .attr('x', 300)
        .attr('y', function(d, i) {return 30 + i * 15})
        .attr('fill', function(d, i) {return colorscale(d[1])})
        .attr('stroke-width', .2)
        .attr('stroke', 'black')
        .attr('height', 10)
        .attr('width', 20)

    svg.selectAll('text')
        .data(legend_entries)
    .enter().append('text')
        .attr('x', 325)
        .attr('font-size', 9)
        .attr('y', function(d, i) {return 40 + i * 15})
        .text(function(d) {return d[2]})

});

})
