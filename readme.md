A file upload sample project. Includes customized image resizing mechanism.

###### File upload with NodeJs, Express, Mutler
1. Install [nodejs](https://nodejs.org/en/) (version 7.5+) and [npm](https://www.npmjs.com/).
2. Go to project directory, run `npm install`.
3. Start the application, run `node server.js`.
4. Go to `localhost:3000`

###### API End Points
1. Upload an image via `POST localhost:3000/image`, avatar field.
2. View list of images via `GET localhost:3000/images`.

###### Photo Caching
1. The original image path: `upload/original`
   <br>Resized file path: `upload/small`, `upload/medium`, `upload/large`
2. Once the server restart, the image info will be discarded due to the data was cached in memory storage.

###### Config
1. You can change the settings in file `config/config.js` to customize 3 scaling width/height of images.
2. Modify the config file to customize server port. 