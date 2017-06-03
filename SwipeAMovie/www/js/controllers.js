serverName = "192.168.0.104:3000";



angular.module('app.controllers', [])

.controller('createAnEventCtrl', ['$scope', '$state', '$stateParams', '$cordovaSocialSharing', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName

function ($scope, $state, $stateParams, $cordovaSocialSharing) {
    var vm = this;
    /*$scope.test=function(){
      $cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');
    }*/
    vm.entity = { 
        date: new Date(), 
        description: "",
        time: new Date(new Date().getHours()*3600000+new Date().getMinutes()*60000), 
        title : "Swipe a Movie"
    };    

    vm.submit = function(){
        var userID = -1,
            roomID = -1;
        console.log("Lets begin");

        var getRoomRequest = function (){
            var name = "__SAMROOMID__=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    roomID = c.substring(name.length, c.length);
                    console.log(">>>>>>>>>" + roomID);
                    $state.go('votingGenres', {"userID": userID, "roomID": roomID});
                }
            }

            var getRoom = new XMLHttpRequest();
            getRoom.open('POST', 'http://'+serverName+'/create_room', true);
            getRoom.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            getRoom.onload = function() {
                try {
                    if (getRoom.status >= 200 && getRoom.status < 400) {
                        var data = JSON.parse(getRoom.responseText);
                        roomID = data['roomId'];
                        var d = new Date(vm.entity.date.getTime() + 172800000);
                        var expires = "expires="+ d.toUTCString();
                        document.cookie = "__SAMROOMID__=" +  roomID  + ";" + expires + ";path=/";

                        var setupRoom = new XMLHttpRequest();
                        setupRoom.open('POST', 'http://'+serverName+'/setup_room', true);
                        setupRoom.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                        setupRoom.send(JSON.stringify({ 
                            "title" : vm.entity.title, 
                            "roomId" : roomID, 
                            "description": vm.entity.description, 
                            "date": vm.entity.date ? vm.entity.date.toISOString().split("T")[0] : null, 
                            "time": vm.entity.time ? vm.entity.time.toISOString().split("T")[1] : null 
                        }, null, 4)); 

                        setupRoom.onload = function() { 
                            if(setupRoom.status < 200 || setupRoom.status >= 400){
                                console.error("Oh Noes! Something went wrong in the server\n"+setupRoom.responseText);
                                alert("Oh Noes! Something went wrong in the server");
                            } else {
                                $state.go('votingGenres', {"userID": userID, "roomID": roomID});
                            }
                        }
                        
                        setupRoom.onerror = function() {
                            console.error("Oh Noes! Something went wrong in the server\n"+setupRoom.responseText);
                            alert("Oh Noes! Something went wrong in the server");
                        }
                    } else {
                        console.error("Oh Noes! Something went wrong in the server\n"+getRoom.responseText);
                        alert("Oh Noes! Something went wrong in the server");
                    }
                } catch(e) {
                    console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                    alert("Oh Noes! Something went wrong in the client");
                }
            };

            getRoom.onerror = function() {
                console.error("Oh Noes! Something went wrong in the server\n"+getRoom.responseText);
                alert("Oh Noes! Something went wrong in the server");
            };

            getRoom.send(JSON.stringify({ "userId": userID }, null, 4));
        };

        var name = "__SAMUSERID__=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                userID = parseInt(c.substring(name.length, c.length));
                console.log(">>>>>>>>>" + userID);
                getRoomRequest();
                $state.go('votingGenres', {"userID": userID, "roomID": roomID});
            }
        }
        
        var getUser = new XMLHttpRequest();
        getUser.open('GET', 'http://'+serverName+'/create_user', true);

        getUser.onload = function() {
            try{
                if (getUser.status >= 200 && getUser.status < 400) {
                    var data = JSON.parse(getUser.responseText);
                    console.log(data)
                    userID = data["userId"];
                    console.log(userID)
                    var d = new Date(vm.entity.date.getTime() + 172800000);
                    var expires = "expires="+ d.toUTCString();
                    console.log(expires)
                    document.cookie = "__SAMUSERID__=" + userID + ";" + expires + ";path=/";
                    console.log(document.cookie);
                    
                    getRoomRequest();
                } else {
                    console.error("Oh Noes! Something went wrong in the server\n"+getUser.responseText);
                    alert("Oh Noes! Something went wrong in the server");
                }
            } catch(e) {
                console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                alert("Oh Noes! Something went wrong in the client");
            }
        };

        getUser.onerror = function() {
            console.error("Oh Noes! Something went wrong in the server\n"+getUser.responseText);
            alert("Oh Noes! Something went wrong in the server");
        };

        getUser.send();
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
    genres = ["Action","Comedy","Drama","Family","Horror","Romance","Sci-Fi","Thriller"];
    
    $scope.remainingGenres = 5;
    $scope.onMouseClick = function (index) {
        var newValue = !vm.selectedGenres[index];
        if (newValue && $scope.remainingGenres > 0 || !newValue && $scope.remainingGenres <= 5)
            vm.selectedGenres[index] = newValue;

        $scope.remainingGenres = 5;
        for (var i = 0; i < vm.selectedGenres.length; i++)
            if (vm.selectedGenres[i]) $scope.remainingGenres --;
    }

    vm.submit = function(){
        preferedGenres = [];
        for(g in selectedGenres){
            if(vm.selectedGenres[g]){
                preferedGenres.push(genres[g]);
            }
        }
        $state.go('votingMovies',{"preferedGenres":preferedGenres, "userID":userID, "roomID":roomID})
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
