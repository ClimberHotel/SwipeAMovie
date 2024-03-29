angular.module('app.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider


            .state('createAnEvent', {
                url: '/events/new',
                templateUrl: 'templates/createAnEvent.html',
                controller: 'createAnEventCtrl',
                controllerAs: 'vm'
            })

            .state('invitationReceived', {
                url: '/events/:roomId/invitation',
                templateUrl: 'templates/invitationReceived.html',
                controller: 'invitationReceivedCtrl',
                controllerAs: 'vm'
            })

            .state('votingMovies', {
                url: '/events/{event}/voting/movies',
                templateUrl: 'templates/votingMovies.html',
                controller: 'votingMoviesCtrl',
                controllerAs: 'vm',
                params:{
                    "movieList":[],"movieListIndex":0, "userID":-1, "roomID":-1, "deadline": new Date()
                }
            })

            .state('votingMoviesDetails', {
                url: '/voting/movies/{movie}/details',
                templateUrl: 'templates/votingMoviesDetails.html',
                controller: 'votingMoviesDetailsCtrl',
                controllerAs: 'vm',
                parent: 'votingMovies',
                params:{
                    "movieList":[],"movieListIndex":0, "userID":-1, "roomID":-1, "deadline": new Date()
                }
            })

            .state('votingGenres', {
                url: '/events/{id}/voting/genres',
                templateUrl: 'templates/votingGenres.html',
                controller: 'votingGenresCtrl',
                controllerAs: 'vm',
                params: {"userID": -1, "roomID":-1, "deadline": new Date() }
            })

            .state('resultsCountdownUser', {
                url: '/events/{id}/result/countdown',
                templateUrl: 'templates/resultsCountdownUser.html',
                controller: 'resultsCountdownUserCtrl',
                controllerAs: 'vm',
                params: { "roomID":-1, "deadline": new Date() }
            })

            .state('resultsCountdownAdmin', {
                url: '/events/{id}/result/status',
                templateUrl: 'templates/resultsCountdownAdmin.html',
                controller: 'resultsCountdownAdminCtrl',
                controllerAs: 'vm'
            })

            .state('resultsDecision', {
                url: '/events/{id}/result/decision',
                templateUrl: 'templates/resultsDecision.html',
                controller: 'resultsDecisionCtrl',
                controllerAs: 'vm'
            })

        $urlRouterProvider.otherwise('/events/new')


    });