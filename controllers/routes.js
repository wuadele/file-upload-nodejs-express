const Api = require('./api')

module.exports = function(app){
	// API Server Endpoints
    app.post('/upload', Api.uploadPhoto);
    app.get('/images', Api.getPhotos);
    app.get('/images/:id', Api.getPhotoById);
}