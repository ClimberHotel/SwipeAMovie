var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./data/database.db');

var room = Room.prototype;
var movies = Movie.prototype;
var votes = Vote.prototype;
var users = User.prototype;
var roomMovies = RoomMovies.prototype;

function Room(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS rooms (uid TEXT PRIMARY KEY, title TEXT, description TEXT, deadline DATETIME, admin TEXT)", function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function Movie(){   //full movies
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS movies (uid TEXT PRIMARY KEY,title TEXT, synopsis TEXT, shortSynopsis Text, mediumSynopsis text,"
        +"rantings INTEGER, duration INTEGER, year INTEGER, dvdReleaseDate DATETIME, category TEXT, lastUpdateDate DATETIME, imageCover TEXT, imageBanner TEXT,"
        +"trailerUrl TEXT)", function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function User(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS users(uid TEXT PRIMARY KEY)",function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function RoomMovies(){  //5 movies of eah category
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS roomMovies(FOREIGN KEY(roomId) REFERENCES rooms(key) ON DELETE CASCADE, FOREIGN KEY(movieId) REFERENCES movies(uid) ON DELETE CASCADE)",function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

function Vote(){
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS votes (FOREIGN KEY(userId) REFERENCES users(uid), FOREIGN KEY(roomID) REFERENCES rooms(key) ON DELETE CASCADE, FOREIGN KEY(movieId) REFERENCES movies(uid) ON DELETE CASCADE,"
        +"like INTEGER, dislike INTEGER, category TEXT, PRIMARY KEY(userId,roomId,movieId))",function(err){
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
        db.run("INSERT INTO roomMovie(roomId,movieId) VALUES (?,?,?)",userId,movieId,roomId,function(err){
            if(err){
                console.log(err);
            }
        });
    });
}

votes.addVote = function(userId,roomId,movieId,like,dislike,category){
    db.serialize(function(){
        db.run("INSERT INTO votes(userId,roomId,movieId,likes,dislike,category) VALUES (?,?,?,?,?)",userId,roomId,movieId,like,dislike,category,function(err){
            if(err){
                console.log(err);
            }
        });
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
        +" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",uid,title,synopsis,shortSynopsis,mediumSynopsis,ratings,duration,year,dvdReleaseDate,category,lastUpdateDate,imageCover,imageBanner
        ,trailerUrl,callback);
    });
}

module.exports = {Room,Movie,Vote,User,RoomMovies};