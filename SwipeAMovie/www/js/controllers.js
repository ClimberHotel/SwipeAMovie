angular.module('app.controllers', [])

.controller('createAnEventCtrl', ['$scope', '$stateParams', '$cordovaSocialSharing', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaSocialSharing) {
    var vm = this;

    vm.entity = { date: new Date(), time: new Date(1970, 0, 0, 12, 34, 0, 0) };

    $scope.test=function(){
      $cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');
    }

}])

.controller('invitationReceivedCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('votingMoviesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    var vm = this;

}])

.controller('votingMoviesDetailsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('votingGenresCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    var vm = this;
    
    vm.selectedGenres = [false, false, false, false, false, false, false, false];
    
    $scope.remainingGenres = 5;
    $scope.onMouseClick = function (index) {
        var newValue = !vm.selectedGenres[index];
        if (newValue && $scope.remainingGenres > 0 || !newValue && $scope.remainingGenres <= 5)
            vm.selectedGenres[index] = newValue;

        $scope.remainingGenres = 5;
        for (var i = 0; i < vm.selectedGenres.length; i++)
            if (vm.selectedGenres[i]) $scope.remainingGenres --;
    }

}])

.controller('resultsCountdownUserCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('resultsCountdownAdminCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('resultsDecisionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
