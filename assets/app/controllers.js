var rateIntervaler;

function MainCtrl ($http, $interval, $scope, $state, LogoService) {
    var vm = this;
    vm.baseCode = $state.params.code || 'USDT';
    vm.baseSymbol = vm.baseCode == 'USDT' ? '$' : vm.baseCode[0];
    var valStorage = JSON.parse(localStorage.valStorage || '{}');
    var favStorage = JSON.parse(localStorage.favStorage || '[]');
    if (!Array.isArray(favStorage)) favStorage = [];
    // Rates
    function fetchRates () {
        $http.get(API_PREFIX + 'rates', {params: {code: ''}}).then(function (response) {
            let rates = [],
                items = response.data;
            for (let code in items) {
                let d = items[code];
                d.code = code;
                d.favWeight = favStorage.indexOf(code) > -1 ? 10000 : 1;
                rates.push(d);
            }
            rates.sort((a, b) => b.favWeight * b[vm.baseCode] - a.favWeight * a[vm.baseCode]);
            if (vm.rates) {
                // update individual items
                for (let i in rates) {
                    if (vm.rates[i].code != rates[i].code) {
                        // when the sequence is broken -> update all items!
                        vm.rates = rates;
                        return false;
                    } else if (vm.rates[i][vm.baseCode] == rates[i][vm.baseCode]) {
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
    if (rateIntervaler) {
        $interval.cancel(rateIntervaler);
    }
    rateIntervaler = $interval(fetchRates, 2000);
    fetchRates();
    // Logo
    LogoService.load(function (logos) {
        vm.logos = logos;
    });
    // Actions
    vm.favClass = function (code) {
        return favStorage.indexOf(code) > -1 ? 'glyphicon-star gold' : 'glyphicon-star-empty gray';
    }
    vm.favClick = function (code) {
        let idx = favStorage.indexOf(code);
        if (idx > -1) {
            favStorage.splice(idx, 1);
        } else {
            favStorage.push(code);
        }
        localStorage.favStorage = JSON.stringify(favStorage);
        return false;
    }
    vm.tabClass = function (code) {
        return code == vm.baseCode ? 'active' : '';
    }
    // Values
    vm.valGet = function (code, baseCode) {
        if (valStorage[code])
            return valStorage[code][baseCode];
        return undefined;
    }
    vm.valSet = function (item, value) {
        valStorage[item.code] = {}
        for (let key in item.rates) {
            let rate = item.rates[key];
            valStorage[item.code][key] = value * (rate.Last || 0);
        }
        valStorage[item.code][item.code] = value;
        localStorage.valStorage = JSON.stringify(valStorage);
        return true;
    }
}

(function () {
    angular
        .module('cryptocurrency')
        .controller('MainCtrl', MainCtrl);
})();
