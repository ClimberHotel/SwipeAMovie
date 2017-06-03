'use strict';

var models = require('../models/ListModels')
const uuidV4 = require('uuid/v4');


exports.createUser = function(req,res){
    new models.User().addUser(function(err){
        if(err){
            return res.status(500).send(err);
        }else{
            res.json(JSON.stringify({"userid":this.lastID}));
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
            res.json(JSON.stringify({"roomId":roomId}));
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
                                    new models.RoomMovies().addMovie(roomId,movie['uid'],row['category']);
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
            return res.json(JSON.stringify(result))
        }
    });
}

exports.vote = function(req,res){

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
    categories = categories.map(function(arg){
        return "\""+arg+"\""
    })
    new models.RoomMovies().getMoviesByRoomIdAndCategory(roomId,categories,function(err,result){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }else{
            console.log(result);
            console.log(this);
            return res.sendStatus(200);
        }
    });

}