const del = require('del');
const loki = require('lokijs')

const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const loadCollection = function (colName, db) {
    return db.getCollection(colName) || db.addCollection(colName);
}

module.exports = { imageFilter, loadCollection }