'use strict';

var services = angular.module('cryptocurrency');
var API_PREFIX = 'https://json.smappi.org/adw0rd/cryptocurrency/';
if (location.hostname == '127.0.0.1' || location.hostname == 'localhost') {
    API_PREFIX = 'http://127.0.0.1:8000/';
}

services.factory('LogoService', function($rootScope, $http) {
    var logos, service = {};
    service.load = function (callback) {
        if (logos) return callback(logos);
        $http.get(API_PREFIX + 'logos', {params: {code: ''}}).then(function (response) {
            logos = response.data;
            callback(logos);
        });
    };
    service.get = function () {
        return logos;
    }
    return service;
});
