(function () {
    function logger($window, $log) {
        var self = this;

        self.logWrapper = function(logName, level) {
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

        this.setGlobablLogLevel = function(level) {
            this._logLevel = level;
        };

        this.setLogLevel = function (level) {
            this.default.logLevel = level;
        };

        this.logLevels = {
            log: 'log',
            info: 'info',
            warn: 'warn',
            error: 'error'
        };
        

        this.logLevel = function(logName) { 

            logName = logName || 'default';
            // get the log level for a specific log else get the log level for all logs
            var logLevel = $window.localStorage.getItem('flannel.loglevel.' + logName)
            if(logLevel == null || logLevel == "") {
              logLevel = $window.localStorage.getItem('flannel.loglevel') 
            } 

            if(logLevel == null || logLevel == "") {
              logLevel = self[logName].logLevel;
            }

            if(logLevel == null || logLevel == "") {
              logLevel = self._logLevel;
            }

            return logLevel;
        };
        
        this.logTiers = {
            log   : ['log', 'info', 'warn', 'error'],
            info  : ['info', 'warn', 'error'],
            warn  : ['warn', 'error'],
            error : ['error']
        };

        this.createLogHandlers = function() {
          return {
            log: [],
            info: [],
            warn: [],
            error: []
          }
        };

        this.setLoggingHandler = function (level, handler) {
            self.logs['default'].logHandlers[level].push(handler);
        };

        this.createLog = function(logName) {
          if(self[logName]) {
            throw new Error('Can not create log with that name');
          }

          self.logs[logName] = {
              name : logName,
              logLevel : self.logLevels.error,
              logHandlers : self.createLogHandlers(),
              setLoggingHandler : function(level, handler) {
                this.logHandlers[level].push(handler);
              },
          };
          
          self.logs[logName].log    = self.logWrapper(logName, self.logLevels.log);
          self.logs[logName].info   = self.logWrapper(logName, self.logLevels.info);
          self.logs[logName].error  = self.logWrapper(logName, self.logLevels.error);
          self.logs[logName].warn   = self.logWrapper(logName, self.logLevels.warn);
          self.logs[logName].setLogLevel = function(level) {
            self.logs[logName].logLevel = level;
          };
          self[logName] = self.logs[logName]
          
        };

        this.logs = {};

        this.createLog('default');

        this.setDefaultHandlers = function(logName) { 
            logName = logName || 'default';
            this.logs[logName].logHandlers.log.push($log.log);
            this.logs[logName].logHandlers.warn.push($log.warn);
            this.logs[logName].logHandlers.info.push($log.info);
            this.logs[logName].logHandlers.error.push($log.error);
        };
        

        this.log    = self.logWrapper('default', this.logLevels.log);
        this.warn   = self.logWrapper('default', this.logLevels.warn);
        this.info   = self.logWrapper('default', this.logLevels.info);
        this.error  = self.logWrapper('default', this.logLevels.error);

        return this;
    }

    var flannel = angular.module('flannel', []);

    flannel.factory('flannel.logger', ['$window', '$log', logger]);
})();
