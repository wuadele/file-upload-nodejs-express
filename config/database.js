const loki = require('lokijs')
var db = new loki('db.json')

db.addCollection('images', {indices: ['path', 'name']})
db.saveDatabase();