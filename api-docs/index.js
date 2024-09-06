const apiInfo = require('./apiInfo');
const components = require('./component');
const auth = require('./paths/auth');

const deepmerge = require('deepmerge');

// Merge all imported objects with deep merge package
const mergedDocs = deepmerge.all([
    apiInfo, 
    components, 
    auth,
    
]);

module.exports = mergedDocs;