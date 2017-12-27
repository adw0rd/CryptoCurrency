function configState($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.debugInfoEnabled(true);
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "/cryptocurrency/assets/app/views/main.html",
            data: {pageTitle: 'Cryptocurrency'}
        })
        .state('room', {
            url: "/room/:id",
            templateUrl: "/cryptocurrency/assets/app/views/room.html",
            data: {pageTitle: 'Room'}
        });
}

(function () {
    angular
        .module('cryptocurrency')
        .config(configState)
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });
})();