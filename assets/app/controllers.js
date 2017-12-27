var API_PREFIX = 'https://json.smappi.org/adw0rd/cryptocurrency/';
//var API_PREFIX = 'http://127.0.0.1:8001/';

function MainCtrl ($http, $interval, $scope) {
    var vm = this;
    function fetchRates () {
        $http.get(API_PREFIX + 'rates', {params: {code: ''}}).then(function (response) {
            let rates = [],
                items = response.data;
            for (let code in items) {
                let d = items[code];
                d.code = code;
                rates.push(d);
            }
            rates.sort((a, b) => b.usdt - a.usdt);
            vm.rates = rates;
        });
    }
    $interval(function () {
        fetchRates();
    }, 10000);
    fetchRates();
}

(function () {
    angular
        .module('cryptocurrency')
        .controller('MainCtrl', MainCtrl);
})();
