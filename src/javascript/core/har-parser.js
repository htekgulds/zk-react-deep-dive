import _ from 'lodash';
import Page from './Page.js';
import Entry from './Entry.js';

export default {
    parse: parse
};

function parse(har) {
    "use strict";

    var pageMap = {},
        pages = [];

    _.each(har.log.pages, function (p) {
        var page = new Page(p);
        pageMap[p.id] = page;
        pages.push(page);
    });

    _.each(har.log.entries, function (e) {
        var page = pageMap[e.pageref],
            entry = new Entry(e, page);

        page.entries.push(entry);
    });

    return pages;
}