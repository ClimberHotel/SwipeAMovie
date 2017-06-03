angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('createAnEvent', {
    url: '/events/new',
    templateUrl: 'templates/createAnEvent.html',
    controller: 'createAnEventCtrl'
  })

  .state('invitationReceived', {
    url: '/events/{event}/invitation',
    templateUrl: 'templates/invitationReceived.html',
    controller: 'invitationReceivedCtrl'
  })

  .state('votingMovies', {
    url: '/events/{event}/voting/movies',
    templateUrl: 'templates/votingMovies.html',
    controller: 'votingMoviesCtrl'
  })

  .state('votingMoviesDetails', {
    url: '/voting/movies/{movie}/details',
    templateUrl: 'templates/votingMoviesDetails.html',
    controller: 'votingMoviesDetailsCtrl'
  })

  .state('votingGenres', {
    url: '/events/{id}/voting/genres',
    templateUrl: 'templates/votingGenres.html',
    controller: 'votingGenresCtrl'
  })

  .state('resultsCountdownUser', {
    url: '/events/{id}/result/countdown',
    templateUrl: 'templates/resultsCountdownUser.html',
    controller: 'resultsCountdownUserCtrl'
  })

  .state('resultsCountdownAdmin', {
    url: '/page9',
    templateUrl: 'templates/resultsCountdownAdmin.html',
    controller: 'resultsCountdownAdminCtrl'
  })

  .state('resultsDecision', {
    url: '/events/{id}/result/decision',
    templateUrl: 'templates/resultsDecision.html',
    controller: 'resultsDecisionCtrl'
  })

$urlRouterProvider.otherwise('/events/new')


});