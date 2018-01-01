var API_PREFIX = 'https://json.smappi.org/adw0rd/cryptocurrency/';
if (location.hostname == '127.0.0.1' || location.hostname == 'localhost') {
    API_PREFIX = 'http://127.0.0.1:8000/';
}

function MainCtrl ($http, $interval, $scope, $state) {
    var vm = this;
    vm.base = $state.params.code || 'USDT';
    var favStorage = JSON.parse(localStorage.favStorage || '{}');
    function fetchRates () {
        $http.get(API_PREFIX + 'rates', {params: {code: ''}}).then(function (response) {
            let rates = [],
                items = response.data;
            for (let code in items) {
                let d = items[code];
                d.code = code;
                d.favWeight = favStorage[code] ? 10000 : 1;
                rates.push(d);
            }
            rates.sort((a, b) => b.favWeight * b[vm.base] - a.favWeight * a[vm.base]);
            if (vm.rates) {
                // update individual items
                for (let i in rates) {
                    if (vm.rates[i].code != rates[i].code) {
                        // when the sequence is broken -> update all items!
                        vm.rates = rates;
                        return false;
                    } else if (vm.rates[i][vm.base] == rates[i][vm.base]) {
                        continue;
                    } else {
                        vm.rates[i] = rates[i];
                    }
                }
            } else {
                vm.rates = rates;
            }
        });
    }
    fetchRates();
    $interval(fetchRates, 2000);
    vm.favClass = function (code) {
        return favStorage[code] ? 'glyphicon-star gold' : 'glyphicon-star-empty gray';
    }
    vm.favClick = function (code) {
        if (favStorage[code]) {
            delete favStorage[code];
        } else {
            favStorage[code] = {};
        }
        localStorage.setItem('favStorage', JSON.stringify(favStorage));
        return false;
    }
    vm.tabClass = function (code) {
        return code == vm.base ? 'active' : '';
    }
}

(function () {
    angular
        .module('cryptocurrency')
        .controller('MainCtrl', MainCtrl);
})();
