var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

populateDB();

var routes = require('./api/routes/ListRoutes');
routes(app);

app.listen(port);

console.log('Server started on port: ' + port);


function populateDB(){
    var models = require('./api/models/ListModels')
    var jsonFile = require('./data/MoviesData')


    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./data/database.db');

    db.serialize(function(){
        var movies = new models.Movie()
        db.get("SELECT count(uid) AS number FROM movies",function(err,result){
            if(err){
                return new Error("Database Error!");
            }else{
                console.log(result['number']);
                console.log(result)
                if(result['number']==0){
                    jsonFile.forEach(function(movie) {
                        var uid = movie['id'];
                        var title = movie['title'];
                        var synopsis = movie['synopsis'];
                        var shortSynopsis = movie['shortSynopsis'];
                        var mediumSynopsis = movie['mediumSynopsis'];
                        var ratings = parseInt(movie['ratings']);
                        var duration = parseInt(movie['duration']);
                        var year = parseInt(movie['year']);
                        var dvdReleaseDate = new Date(movie['dvdReleaseDate']);
                        var category = movie['genres'];
                        var lastUpdateDate = new Date(movie['lastUpdateDate']);
                        var imageCover = movie['imageCover'];
                        var imageBanner = movie['imageBanner'];
                        var trailerUrl = movie['trailerUrl'];

                        movies.addMovie(uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate.toISOString(),category,lastUpdateDate.toISOString(),imageCover,imageBanner,trailerUrl,function(){});
                    }, this);
                }
            }
        })
    });

}