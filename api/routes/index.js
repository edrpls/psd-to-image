'use strict';
// requires
const fs = require('fs');

// Dynamically include all route files in the routes/ folder
module.exports = function (router, app) {
    // Read all files from the routes/ directory
    fs.readdirSync(__dirname).forEach(function (file) {
        var name;
        // Only include files that end in .js
        if (file.search(/.js$/) !== -1) {
            name = file.substr(0, file.indexOf('.'));
            if (file == 'index.js') {
                return;
            }
            require('./' + name)(router, app); // Pass the router and app to each of the route files
        }
    });
};
