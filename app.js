//module
var myWeatherApp = angular.module('myWeatherApp',['ngRoute','ngResource']);

//Service
myWeatherApp.service('cityService',function(){
    
    this.city = "San Francisco, CA";
    
});

//Controllers
myWeatherApp.controller('homeController',['$scope', '$location', 'cityService', function($scope, $location, cityService){
    
    $scope.city = cityService.city;
    
    $scope.$watch('city', function(){
        cityService.city = $scope.city;
    });
    
    $scope.submit = function(){
        $location.path("/forecast");
    }
    
}]);

myWeatherApp.controller('forecastController',['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService){
    
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '3';
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily",{ callback: "JSON_CALLBACK"}, {get: { method: "JSONP" }});
    
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days});
    
    $scope.convertToFahrenheit = function (degK){
        
        return Math.round((1.8 * (degK - 273)) + 32);
    }
    
    $scope.convertToDate = function (dt){
        
        return new Date (dt * 1000);
    }

}]);

//Routes
myWeatherApp.config(function($routeProvider){
    
    $routeProvider
    
    .when('/',{
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })
    
    .when('/forecast',{
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:days',{
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    
});

//Directives
myWeatherApp.directive("weatherReport",function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: "=",
            convertToStandard: "&",
            convertToDate: "&",
            dateFormat: "@"
        }
    }
});