describe('test logging level switches', function() {
  var loggers;
  beforeEach(module('flannel'));

  beforeEach(function(logger) { 
    loggers = {
      info  : function() {},
      warn  : function() {},
      log   : function() {},
      error : function() {} 
    };

    spyOn(loggers, 'info');
    spyOn(loggers, 'log');
    spyOn(loggers, 'warn');
    spyOn(loggers, 'error');
    
  });

  afterEach(function() { 
    localStorage.removeItem('flannel.loglevel');
  });

  it('should only call error if the log level is error', inject(['flannel.logger', function(logger) { 
    expect(logger.logLevel()).toBe(logger.logLevels.error);

    logger.setLoggingHandler(logger.logLevels.info, loggers.info);
    logger.setLoggingHandler(logger.logLevels.log, loggers.log);
    logger.setLoggingHandler(logger.logLevels.warn, loggers.warn);
    logger.setLoggingHandler(logger.logLevels.error, loggers.error);

    logger.info('info');
    logger.log('log');
    logger.warn('warn');
    logger.error('error');

    expect(loggers.log).not.toHaveBeenCalled();
    expect(loggers.info).not.toHaveBeenCalled();
    expect(loggers.warn).not.toHaveBeenCalled();
    expect(loggers.error).toHaveBeenCalled();
  }]));

  it('should call warn and error if the log level is warm', inject(['flannel.logger', function(logger) { 
    logger.setLogLevel(logger.logLevels.warn);

    logger.setLoggingHandler(logger.logLevels.info, loggers.info);
    logger.setLoggingHandler(logger.logLevels.log, loggers.log);
    logger.setLoggingHandler(logger.logLevels.warn, loggers.warn);
    logger.setLoggingHandler(logger.logLevels.error, loggers.error);

    logger.info('info');
    logger.log('log');
    logger.warn('warn');
    logger.error('error');
    
    expect(loggers.log).not.toHaveBeenCalled();
    expect(loggers.info).not.toHaveBeenCalled();
    expect(loggers.warn).toHaveBeenCalled();
    expect(loggers.error).toHaveBeenCalled();
  }]));
  it('should call info, warn and error if the log level is info', inject(['flannel.logger', function(logger) { 
    logger.setLogLevel(logger.logLevels.info);

    logger.setLoggingHandler(logger.logLevels.info, loggers.info);
    logger.setLoggingHandler(logger.logLevels.log, loggers.log);
    logger.setLoggingHandler(logger.logLevels.warn, loggers.warn);
    logger.setLoggingHandler(logger.logLevels.error, loggers.error);

    logger.info('info');
    logger.log('log');
    logger.warn('warn');
    logger.error('error');
    
    expect(loggers.log).not.toHaveBeenCalled();
    expect(loggers.info).toHaveBeenCalled();
    expect(loggers.warn).toHaveBeenCalled();
    expect(loggers.error).toHaveBeenCalled();
  }]));
  it('should call log, info, warn and error if the log level is log', inject(['flannel.logger', function(logger) { 
    logger.setLogLevel(logger.logLevels.log);

    logger.setLoggingHandler(logger.logLevels.info, loggers.info);
    logger.setLoggingHandler(logger.logLevels.log, loggers.log);
    logger.setLoggingHandler(logger.logLevels.warn, loggers.warn);
    logger.setLoggingHandler(logger.logLevels.error, loggers.error);

    logger.info('info');
    logger.log('log');
    logger.warn('warn');
    logger.error('error');
    
    expect(loggers.log).toHaveBeenCalled();
    expect(loggers.info).toHaveBeenCalled();
    expect(loggers.warn).toHaveBeenCalled();
    expect(loggers.error).toHaveBeenCalled();
  }]));
 });
