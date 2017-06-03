'use strict';

module.exports = function(app){
    var controller = require('../controllers/ListControllers');

    app.route('/create_user/')
        .get(controller.createUser);

    app.route('/create_room/')
        .post(controller.createRoom);

    app.route('/setup_room/')
        .post(controller.setupRoom);

    app.route('/finished/')
        .post(controller.finished);

    app.route('/room/:uid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})')
        .get(controller.roomInfo)
        .post(controller.vote)

    app.route('/room/:uid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/movies')
        .post(controller.roomMovies)

    app.route('/room/:uid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/results')
        .get(controller.results)

};