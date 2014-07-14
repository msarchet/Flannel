(function () {
  'use strict';

  function Logger($window, $log) {
    // set the angular providers onto logger
    this.$window = $window;
    this.$log = $log;

    // create the default logger
    this.createLog('default');

    // alias the default logger
    this.log    = this.default.log; 
    this.warn   = this.default.warn; 
    this.info   = this.default.info; 
    this.error  = this.default.error;

    return this;
  }

  // logs dict
  Logger.prototype.logs = {};

  // standard logging level
  Logger.prototype._logLevel = 'error';

  // a wrapper for passing through arguments
  Logger.prototype.logWrapper = function(logName, level) {
    var self = this;
    var handlers = self.logs[logName].logHandlers[level];

    return function () {
      // capture the arguments on a var
      var args = arguments;
      // get the level for the current log
      var _level = self.logLevel(logName);
      
      // only call handlers if level is in the current tier
      if(self.logTiers[level] <= self.logTiers[_level]) {
        handlers.forEach(function (handler) {
            handler.apply(null, args);
        });
      }
    };
  };

  // set a global logging level
  Logger.prototype.setGlobablLogLevel = function(level) {
    this._logLevel = level;
  };

  // log levels
  Logger.prototype.logLevels = {
    log: 'log',
    info: 'info',
    warn: 'warn',
    error: 'error'
  };

  // get the appropriate log level
  Logger.prototype.logLevel = function(logName) { 
    var self = this;
    logName = logName || 'default';
    // get the log level for a specific log else get the log level for all logs
    var logLevel = self.$window.localStorage.getItem('flannel.loglevel.' + logName);
    if(logLevel === null || logLevel === "") {
      logLevel = self.$window.localStorage.getItem('flannel.loglevel');
    } 

    if(logLevel === null || logLevel === "") {
      logLevel = self[logName].logLevel;
    }

    if(logLevel === null || logLevel === "") {
      logLevel = self._logLevel;
    }

    return logLevel;
  };
  
  Logger.prototype.logTiers = {
    log   : 3, 
    info  : 2, 
    warn  : 1,
    error : 0 
  };

  Logger.prototype.createLogHandlers = function() {
    return {
      log: [],
      info: [],
      warn: [],
      error: []
    };
  };

  Logger.prototype.setLogLevel = function (level) {
    this.default.logLevel = level;
  };

  Logger.prototype.setLoggingHandler = function(level, handler) {
    this.setHandler.call(this.default, level, handler);
  };
    
  Logger.prototype.createLog = function(logName) {
    var self = this;

    if(self[logName]) {
      throw new Error('Can not create log with that name');
    }

    self.logs[logName] = {
        name : logName, // name the log for decoration
        logLevel : null, // only use this if it's set specifically
        logHandlers : self.createLogHandlers(), // create the log handlers
        setLoggingHandler : self.setHandler // attach the setLogging handler
    };
    
    self.logs[logName].log    = self.logWrapper(logName, self.logLevels.log); // set up the basic log methods
    self.logs[logName].info   = self.logWrapper(logName, self.logLevels.info);
    self.logs[logName].error  = self.logWrapper(logName, self.logLevels.error);
    self.logs[logName].warn   = self.logWrapper(logName, self.logLevels.warn);

    // sets the log level for this log
    self.logs[logName].setLogLevel = function(level) {
      self.logs[logName].logLevel = level;
    };

    // alias the log onto logger
    self[logName] = self.logs[logName];
  };

  // set a handler for a log level
  Logger.prototype.setHandler = function(level, handler) {
    this.logHandlers[level].push(handler);
  };

  // set/enable the console.log handlers
  Logger.prototype.setDefaultHandlers = function(logName) { 
    logName = logName || 'default';
    this.logs[logName].logHandlers.log.push(this.$log.log);
    this.logs[logName].logHandlers.warn.push(this.$log.warn);
    this.logs[logName].logHandlers.info.push(this.$log.info);
    this.logs[logName].logHandlers.error.push(this.$log.error);
  };

  if(angular !== undefined) {
    angular.module('flannel', [])
      .service('flannel.logger', ['$window', '$log', Logger]);
  }
  else {
    window.Flannel = function() { 
      return new Logger(window, console || { log : noOp, warn : noOp, info : noOp, error : noOp});
    };
  }
  function noOp() { return; }
})();
