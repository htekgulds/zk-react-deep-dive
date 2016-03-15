import d3 from 'd3';
import mimeTypes from '../../core/mime-types';

export default function(groups, parentNode, config) {
    var radius = Math.min(config.width, config.height),
        arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius / 2),
        labelArc = d3.svg.arc()
            .outerRadius(radius - 5)
            .innerRadius(radius - 5),
        pie = d3.layout.pie()
            .sort(null)
            .value(d => d.count);

    var data = pie(groups),
        keyFn = x => x.data.type;

    var parent = d3.select(parentNode);

    // Pie slices -------------------------- //
    var path = parent.selectAll('path')
        .data(data, keyFn);

    path.enter()
        .append('path');

    path.attr('d', arc)
        .state('fill', d => mimeTypes.types[d.data.type].color);
};