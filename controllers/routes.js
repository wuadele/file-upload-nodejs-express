const Api = require('./api')

module.exports = function(app){
	// API Server Endpoints
    app.post('/image', Api.uploadPhoto);
    app.get('/images', Api.getPhotos);
}