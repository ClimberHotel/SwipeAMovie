'use strict';

var models = require('../models/ListModels')
const uuidV4 = require('uuid/v4');


exports.createUser = function(req,res){
    new models.User().addUser(function(err){
        if(err){
            return res.status(500).send(err);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"userId":this.lastID}));
        }
    });
}

exports.createRoom = function(req,res){
    var contentType = req.headers['content-type'];
    if(!contentType || contentType.indexOf('application/json') != 0){
        return res.sendStatus(400);
    }
    if(!('userId' in req.body)){
        return res.sendStatus(400);
    } 
    var id = req.body['userId']
    var roomId = uuidV4();
    new models.Room().newRoom(roomId,id,function(err){
        if(err){
            return res.status(500).send(err);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({"roomId":roomId}));
            var movies = new models.Movie()
            movies.getCategories(function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    rows.forEach(function(row) {
                        movies.getFromCategory(row['category'],function(err,moviesByCategory){
                            if(err){
                                console.log(err)
                            }else{
                                moviesByCategory.forEach(function(movie){
                                    new models.RoomMovies().addMovie(roomId,movie['uid']);
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

exports.setupRoom = function(req,res){
    var contentType = req.headers['content-type'];
    if(!contentType || contentType.indexOf('application/json') != 0){
        return res.sendStatus(400);
    }
    if(!(('userId' in req.body) || ('roomId' in req.body))){
        return res.sendStatus(400);
    }
    var roomId = req.body['roomId']
    var title = ('title' in req.body ? req.body['title'] : null);
    var description = ('description' in req.body ? req.body['description'] : null);
    var date = ('date' in req.body ? req.body['date'] : null);
    var time = ('time' in req.body ? req.body['time'] : null);
    var dateTime = new Date(date+" "+time);
    console.log(dateTime);
    new models.Room().setup(roomId,title,description,dateTime.toISOString(),function(err){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }else{
            return res.sendStatus(200);
        }
    });   
}

exports.finished = function(req,res){
    var contentType = req.headers['content-type'];
    if(!contentType || contentType.indexOf('application/json') != 0){
        return res.sendStatus(400);
    }
    if(!(('userId' in req.body) || ('roomId' in req.body))){
        return res.sendStatus(400);
    }
    var roomId = req.body['roomId']
    new models.Room().addFinished(roomId,function(err){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }else{
            return res.sendStatus(200);
        }
    });
}

exports.roomInfo = function(req,res){
    var roomId = req.params['uid'];
    console.log(roomId)
    new models.Room().getInfo(roomId,function(err,result){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }else{
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify(result))
        }
    });
}

exports.vote = function(req, res){
    var roomID = req.params['uid'];
    var movieID = req.body['movieId'];
    var userID = req.body['userId'];
    var isLike = req.body['isLike'].toLowerCase() == 'true';
    
    new models.Vote().addVote(
        userID,
        roomID,
        movieID,
        isLike ? 1 : 0,
        isLike ? 0 : 1,
        err => res.sendStatus(err ? 500 : 200)
    );    
}

exports.roomMovies = function(req,res){
    var roomId = req.params['uid'];
    var contentType = req.headers['content-type'];
    if(!contentType || contentType.indexOf('application/json') != 0){
        return res.sendStatus(400);
    }
    if(!(('userId' in req.body) || ('categories' in req.body))){
        return res.sendStatus(400);
    }

    var categories = req.body['categories'];
    var movies = {};
    new models.RoomMovies().getMoviesByRoomIdAndCategory(roomId,categories,function(err,result){
        if(err){
            return res.sendStatus(500);
        }else{
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify(result,null,4));
        }
    });

}