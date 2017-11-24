const multer = require('multer')
const fs = require('fs')
const loki = require('lokijs')
const jimp = require("jimp")
const mkdirp = require('mkdirp')
const config = require('../config/config.js')
const utils = require('../utils.js')

// define
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const UPLOAD_FIELD = 'avatar';

// setup
var db = new loki(DB_NAME)

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
		callback(null, `${UPLOAD_PATH}/original`)
	},
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.originalname)
	}
})
var upload = multer({storage: storage, fileFilter: utils.imageFilter}).single(UPLOAD_FIELD);
var prepareFolders = function() {
    mkdirp.sync(`${UPLOAD_PATH}/original`);
    mkdirp.sync(`${UPLOAD_PATH}/small`);
    mkdirp.sync(`${UPLOAD_PATH}/medium`);
    mkdirp.sync(`${UPLOAD_PATH}/large`);
}

// function
var uploadPhoto = (req, res) => {
    prepareFolders();
    upload(req, res, function (err) {
        if (err) {
            res.status(400).send({ error: "Incorrect file format" });
        } else {
            //console.log('file path: ' + req.file.path);
            var collection = utils.loadCollection(COLLECTION_NAME, db);

            var filename = req.file.filename;
            var mimetype = req.file.mimetype;
            var originalImagePath = `${UPLOAD_PATH}/original/${filename}`;
            var smallImagePath = `${UPLOAD_PATH}/small/${filename}`;
            var mediumImagePath = `${UPLOAD_PATH}/medium/${filename}`;
            var largeImagePath = `${UPLOAD_PATH}/large/${filename}`;
            var resultArray = {};
            try {
                jimp.read(req.file.path, function (err, img) {
                    if (err) throw err;
                    img.resize(config.image.small.h, jimp.AUTO)
                        .quality(100)
                        .write(smallImagePath);
                    img.resize(config.image.medium.h, jimp.AUTO)
                        .quality(100)
                        .write(mediumImagePath);
                    img.resize(config.image.large.h, jimp.AUTO)
                        .quality(100)
                        .write(largeImagePath);
                });
                // original image
                var result = collection.insert({path: originalImagePath, name: filename, mimetype: mimetype});
                console.log('original:' + result.$loki);
                // resized images
                result = collection.insert({path: smallImagePath, name: filename, mimetype: mimetype});
                resultArray['image_s_id'] = result.$loki;
                result = collection.insert({path: mediumImagePath, name: filename, mimetype: mimetype});
                resultArray['image_m_id'] = result.$loki;
                result = collection.insert({path: largeImagePath, name: filename, mimetype: mimetype});
                resultArray['image_l_id'] = result.$loki;
            } catch (err) {
                console.log('Fail resizing images')
            }
            res.setHeader('Content-Type', 'application/json')
            res.status(200).send(JSON.stringify(resultArray))
        }
    })
}

const getPhotos = (req, res) => {
    var rows = utils.loadCollection(COLLECTION_NAME, db);
    res.send(rows.data);
}

const getPhotoById = (req, res) => {
    try {
        var col = utils.loadCollection(COLLECTION_NAME, db);
        var result = col.get(req.params.id);

        if (!result) {
            res.sendStatus(404);
            return;
        };

        res.setHeader('Content-Type', result.mimetype);
        fs.createReadStream(result.path).pipe(res);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports = { uploadPhoto, getPhotos, getPhotoById }