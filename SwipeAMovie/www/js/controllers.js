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


.controller('votingMoviesCtrl', ['$scope', '$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $stateParams) {
    var vm = this;
    var currentIndex = $stateParams['movieListIndex'];
    if(currentIndex>=$stateParams['movieList']){
        $state.go('resultsCountdownUser');
    }

    

}])

.controller('votingMoviesDetailsCtrl', ['$scope', '$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $stateParams) {
    var vm = this;
    var movie = $stateParams['movieList'][$stateParams['movieListIndex']];
    vm.title = movie['title'];
    vm.year = movie['year'];
    vm.duration = movie['duration'];
    vm.ratings = movie['ratings'];
    vm.trailerUrl = movie['trailerUrl']
    vm.synopsis = movie['synopsis']

    vm.like = function(){
        var like = new XMLHttpRequest();
        like.open('POST', 'http://'+serverName+'/room/'+$stateParams['roomID'], true);
        like.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        like.onload = function(){
            try {
                if (like.status < 200 && like.status >= 400) {
                    console.error("Oh Noes! Something went wrong in the server\n"+like.responseText);
                    alert("Oh Noes! Something went wrong in the server\n");
                }else{
                    $state.go('votingMoviesCtrl',{'movieList':$stateParams['movieList'],
                    'movieListIndex':$stateParams['movieListIndex']+1,
                    'userID':$stateParams['userID'],
                    'roomID':$stateParams['roomID']
                    });
                }
            }catch(e){
                console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                alert("Oh Noes! Something went wrong in the client\n");
            }
        };

        like.onerror = function() {
            console.error("Oh Noes! Something went wrong in the server\n"+like.responseText);
            alert("Oh Noes! Something went wrong in the server\n");
        };

        like.send(JSON.stringify({ "movieId": movie['uid'],
            "userId": $stateParams['userID'],
            "isLike":"True"
        }, null, 4));
    };

    vm.dislike = function(){
        var dislike = new XMLHttpRequest();
        dislike.open('POST', 'http://'+serverName+'/room/'+$stateParams['roomID'], true);
        dislike.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        dislike.onload = function(){
            try {
                if (dislike.status < 200 && dislike.status >= 400) {
                    console.error("Oh Noes! Something went wrong in the server\n"+dislike.responseText);
                    alert("Oh Noes! Something went wrong in the server\n");
                }else{
                    $state.go('votingMoviesCtrl',{'movieList':$stateParams['movieList'],
                    'movieListIndex':$stateParams['movieListIndex']+1,
                    'userID':$stateParams['userID'],
                    'roomID':$stateParams['roomID']
                    });
                }
            }catch(e){
                console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                alert("Oh Noes! Something went wrong in the client\n");
            }
        };

        dislike.onerror = function() {
            console.error("Oh Noes! Something went wrong in the server\n"+dislike.responseText);
            alert("Oh Noes! Something went wrong in the server\n");
        };

        dislike.send(JSON.stringify({ "movieId": movie['uid'],
            "userId": $stateParams['userID'],
            "isLike":"False"
        }, null, 4));
    };

    vm.finish = function(){
        var finish = new XMLHttpRequest();
        finish.open('POST', 'http://'+serverName+'/finished/', true);
        finish.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        finish.onload = function(){
            try {
                if (finish.status < 200 && finish.status >= 400) {
                    console.error("Oh Noes! Something went wrong in the server\n"+finish.responseText);
                    alert("Oh Noes! Something went wrong in the server\n");
                }else{
                    $state.go('resultsCountdownUser');
                }
            }catch(e){
                console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                alert("Oh Noes! Something went wrong in the client\n");
            }
        };

        finish.onerror = function() {
            console.error("Oh Noes! Something went wrong in the server\n"+finish.responseText);
            alert("Oh Noes! Something went wrong in the server\n");
        };

        finish.send(JSON.stringify({ "roomId": $stateParams['roomID'],
            "userId": $stateParams['userID']
        }, null, 4));
    };

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
        for(g in vm.selectedGenres){
            if(vm.selectedGenres[g]){
                preferedGenres.push(genres[g]);
            }
        }

        var getMovies = new XMLHttpRequest();
        getMovies.open('POST', 'http://'+serverName+'/room/'+$stateParams['roomID']+'/movies', true);
        getMovies.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var movieList = null;
        getMovies.onload = function(){
            try {
                if (getMovies.status >= 200 && getMovies.status < 400) {
                    movieList = JSON.parse(getMovies.responseText);
                }else{
                    console.error("Oh Noes! Something went wrong in the server\n"+getMovies.responseText);
                    alert("Oh Noes! Something went wrong in the server\n");
                }
            }catch(e){
                console.error("Oh Noes! Something went wrong in the client\n"+e.error);
                alert("Oh Noes! Something went wrong in the client\n");
            }
        };

        getMovies.onerror = function() {
            console.error("Oh Noes! Something went wrong in the server\n"+getMovies.responseText);
            alert("Oh Noes! Something went wrong in the server\n");
        };

        getMovies.send(JSON.stringify({ "userId": userID,
            "categories": preferedGenres
        }, null, 4));

        movieList.sort(function(a,b){return 0.5 - Math.random()});

        $state.go('votingMovies',{"movieList":movieList, "movieListIndex":0, "userID":$stateParams['userID'], "roomID":$stateParams['roomID']})
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
