(function () {
    function logger($window, $log) {
        var self = this;
        function logWrapper(level) {
            var handlers = self.logHandlers[level];

            return function () {
                var args = arguments;
                if(self.logTiers[self.logLevel()].indexOf(level) !== -1) {
                    handlers.forEach(function (handler) {
                        handler.apply(this, args);
                    });
                }
            };
        }

        this.setLogLevel = function (level) {
            this._logLevel = level;
        };

        this.logLevels = {
            log: 'log',
            info: 'info',
            warn: 'warn',
            error: 'error'
        };
        
        this._logLevel = this.logLevels.error;    

        this.logLevel = function() { 
            var logLevel = $window.localStorage.getItem('flannel.loglevel');

            if(logLevel && self.logLevels[logLevel]) {
                return self.logLevels[logLevel]    
            }
            
            return self._logLevel;
        };
        
        this.logTiers = {
            log :  ['log', 'info', 'warn', 'error'],
            info : ['info', 'warn', 'error'],
            warn : ['warn', 'error'],
            error : ['error']
        };

        this.logHandlers = {
            log: [],
            info: [],
            warn: [],
            error: []
        };

        this.setDefaultHandlers = function() { 
            this.logHandlers.log.push($log.log);
            this.logHandlers.warn.push($log.warn);
            this.logHandlers.info.push($log.info);
            this.logHandlers.error.push($log.error);
        };
        
        this.setLoggingHandler = function (level, handler) {
            self.logHandlers[level].push(handler);
        };

        this.log = logWrapper(this.logLevels.log);
        this.warn = logWrapper(this.logLevels.warn);
        this.info = logWrapper(this.logLevels.info);
        this.error = logWrapper(this.logLevels.error);

        return this;
    }



    var woodsman = angular.module('flannel', []);

    woodsman.factory('flannel.logger', ['$window', '$log', logger]);
})();
