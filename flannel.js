(function () {
    function logger($window, $log) {
        var self = this;

        function logWrapper(logName, level) {
            var handlers = self.logs[logName].logHandlers[level];
            var name = logName;

            return function () {
                var args = arguments;
                var _level = self.logLevel(name);
                if(self.logTiers[_level].indexOf(level) !== -1) {
                    handlers.forEach(function (handler) {
                        handler.apply(this, args);
                    });
                }
            };
        }

        this._logLevel = 'error';

        this.setLogLevel = function (level) {
            this._logLevel = level;
        };

        this.logLevels = {
            log: 'log',
            info: 'info',
            warn: 'warn',
            error: 'error'
        };
        

        this.logLevel = function(logName) { 

            // get the log level for a specific log else get the log level for all logs
            var logLevel = $window.localStorage.getItem('flannel.loglevel.' + logName)
            if(logLevel == null || logLevel == "") {
              logLevel = $window.localStorage.getItem('flannel.loglevel') 
            } 

            if(logLevel == null || logLevel == "") {
              logLevel = self._logLevel;
            }

            return logLevel;
        };
        
        this.logTiers = {
            log :  ['log', 'info', 'warn', 'error'],
            info : ['info', 'warn', 'error'],
            warn : ['warn', 'error'],
            error : ['error']
        };

        this.createLog = function(logName) {
          return {
            log: [],
            info: [],
            warn: [],
            error: []
          }
        };

        this.logs = {
          default : 
            {
              name : 'default',
              logHandlers : self.createLog('default'),
              setLoggingHandler : function(level, handler) {
                this.logHandlers[level].push(handler)
              }
            } 
        }; 

        this.setDefaultHandlers = function(logNam) { 
            this.logs[logName].logHandlers.log.push($log.log);
            this.logs[logName].logHandlers.warn.push($log.warn);
            this.logs[logName].logHandlers.info.push($log.info);
            this.logs[logName].logHandlers.error.push($log.error);
        };
        
        this.setLoggingHandler = function (level, handler) {
            self.logs['default'].logHandlers[level].push(handler);
        };

        this.log    = logWrapper('default', this.logLevels.log);
        this.warn   = logWrapper('default', this.logLevels.warn);
        this.info   = logWrapper('default', this.logLevels.info);
        this.error  = logWrapper('default', this.logLevels.error);

        return this;
    }

    var flannel = angular.module('flannel', []);

    flannel.factory('flannel.logger', ['$window', '$log', logger]);
})();
