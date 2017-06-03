var cors = require('cors')

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors())

populateDB();

var routes = require('./api/routes/ListRoutes');
routes(app);

app.listen(port);

console.log('Server started on port: ' + port);


function populateDB(){
    var models = require('./api/models/ListModels')
    var movies = new models.Movie()
}