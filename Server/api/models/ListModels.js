var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./data/database.db');
db.run("PRAGMA foreign_keys = ON;")
var room = Room.prototype;
var movies = Movie.prototype;
var votes = Vote.prototype;
var users = User.prototype;
var roomMovies = RoomMovies.prototype;

function Room(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS rooms (uid TEXT PRIMARY KEY, title TEXT, description TEXT, deadline DATETIME, admin TEXT, finish INTEGER DEFAULT 0)", function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function Movie(){   //full movies
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS movies(uid TEXT PRIMARY KEY,title TEXT, synopsis TEXT, shortSynopsis TEXT, mediumSynopsis TEXT,"
        +"ratings INTEGER, duration INTEGER, year INTEGER, dvdReleaseDate DATETIME, category TEXT, lastUpdateDate DATETIME, imageCover TEXT, imageBanner TEXT,"
        +"trailerUrl TEXT)", function(err){
            if(err){
                console.log(err);
            }
        });
        var jsonFile = require('../../data/MoviesData')
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
        });
    });
}

function User(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS users(uid INTEGER PRIMARY KEY)",function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function RoomMovies(){  //5 movies of eah category
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS roomMovies(roomId TEXT, movieId TEXT, FOREIGN KEY(roomId) REFERENCES rooms(uid) ON DELETE CASCADE, FOREIGN KEY(movieId) REFERENCES movies(uid) ON DELETE CASCADE)",function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function Vote(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS votes ("
            +"userId INTEGER REFERENCES users(uid),"
            +"roomId TEXT REFERENCES rooms(uid),"
            +"movieId TEXT REFERENCES movies(uid),"
            +"like INTEGER, dislike INTEGER,"
            +"PRIMARY KEY(userId, roomId, movieId)"
        +")",
        function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

room.newRoom = function(key,admin,callback){
    db.serialize(function(){
        //need to generate a key for the room
        db.run("INSERT INTO rooms(uid,admin) VALUES (?,?)",key,admin,callback);
    });
}

room.deleteRoom = function(roomId){
    db.serialize(function(){
        db.run("DELETE FROM rooms WHERE uid=?",roomId,function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

room.setup = function(roomId,title,description,deadline,callback){
    db.serialize(function(){
        db.run("UPDATE rooms SET title = ?, description = ?, deadline = ? WHERE uid = ?",title,description,deadline,roomId,callback);
    });
}

room.setDeadline = function(roomId,deadline){
    db.serialize(function(){
        db.run("UPDATE rooms SET deadline = ? WHERE key = ?",deadline,roomId,function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

roomMovies.addMovie = function(roomId,movieId){
    db.serialize(function(){
        db.run("INSERT INTO roomMovies(roomId,movieId) VALUES (?,?)",roomId,movieId,function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

votes.addVote = function(userId,roomId,movieId,like,dislike,callback){
    db.serialize(function(){
        db.run("INSERT INTO votes(userId,roomId,movieId,like,dislike) VALUES (?,?,?,?,?)",userId,roomId,movieId,like,dislike,callback);
    });
}

users.addUser = function(callback){
    var result = null;
    db.serialize(function(){
        db.run("INSERT INTO users(uid) VALUES (?)",null,callback);
    });
}

movies.addMovie = function(uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate,category,lastUpdateDate,imageCover,imageBanner,trailerUrl,callback){
    db.serialize(function(){
        db.run("INSERT INTO movies(uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate,category,lastUpdateDate,imageCover,imageBanner,trailerUrl)"
        +" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate,category,lastUpdateDate,imageCover,imageBanner,trailerUrl,callback);
    });
}

movies.getCategories = function(callback){
    db.serialize(function(){
        db.all("SELECT DISTINCT category FROM movies",callback);
    })
}

movies.getFromCategory = function(category, callback){
    db.serialize(function(){
        db.all("SELECT * FROM movies WHERE category = ?", category,callback);
    })
}

room.addFinished = function(roomId,callback){
    db.serialize(function(){
        db.run("UPDATE rooms SET finish = finish + 1 WHERE uid=?",roomId,callback)
    });
}

room.getInfo = function(roomId,callback){
    db.serialize(function(){
        db.get("SELECT * FROM rooms WHERE uid=?",roomId,callback);
    });
}

roomMovies.getMoviesByRoomIdAndCategory = function(roomId,category,callback){
    db.serialize(function(){      
            db.all("SELECT uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate,category,lastUpdateDate,imageCover,imageBanner,trailerUrl FROM roomMovies INNER JOIN movies ON roomMovies.movieId = movies.uid WHERE category in (?,?,?,?,?) AND roomId = ?",category[0],category[1],category[2],category[3],category[4],roomId,callback);
            });
            
}

movies.getInfo = function(movieId,callback){
    db.serialize(function(){
            db.get("SELECT * FROM movies WHERE uid=?",movieId,callback);
    });
}

module.exports = {Room,Movie,Vote,User,RoomMovies};