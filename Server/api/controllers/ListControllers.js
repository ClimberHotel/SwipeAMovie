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

    new models.Room().setup(roomId,title,description,dateTime,function(err){
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }else{
            return res.sendStatus(200);
        }
    });   
}

