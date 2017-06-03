'use strict';

module.exports = function(app){
    var controller = require('../controllers/ListControllers');

    app.route('/create_user/')
        .get(controller.createUser);

    app.route('/create_room/')
        .post(controller.createRoom);

    app.route('/setup_room/')
        .post(controller.setupRoom);
//    app.route('/room/')

};