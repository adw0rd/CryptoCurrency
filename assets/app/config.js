function configState($stateProvider, $urlRouterProvider, $compileProvider) {
    $compileProvider.debugInfoEnabled(true);
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('main', {
            url: "/:code",
            templateUrl: "/CryptoCurrency/assets/app/views/main.html",
            data: {pageTitle: 'CryptoCurrency Ticker'}
        })
        // .state('rate', {
        //     url: "/rate/:code",
        //     templateUrl: "/CryptoCurrency/assets/app/views/rate.html",
        //     data: {pageTitle: 'Rate'}
        // });
}

(function () {
    angular
        .module('cryptocurrency')
        .config(configState)
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });
})();
