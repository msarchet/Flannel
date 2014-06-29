describe('test named logs', function() { 
  'use strict';
  beforeEach(module('flannel'));
  it('should create a log named test', inject(['flannel.logger', function(logger) { 
    logger.createLog('test');

    expect(logger.logs.test).toBeDefined();
    expect(logger.test).toBeDefined();

    expect(logger.logs.test.name).toBe('test');
    expect(logger.logs.test.logHandlers.log).toBeDefined();
    expect(logger.logs.test.logHandlers.info).toBeDefined();
    expect(logger.logs.test.logHandlers.warn).toBeDefined();
    expect(logger.logs.test.logHandlers.error).toBeDefined();

    expect(logger.test.name).toBe('test');
    expect(logger.test.logHandlers.log).toBeDefined();
    expect(logger.test.logHandlers.info).toBeDefined();
    expect(logger.test.logHandlers.warn).toBeDefined();
    expect(logger.test.logHandlers.error).toBeDefined();
  }]));

  it('should set default handlers correctly', inject(['flannel.logger', function(logger) {
    logger.createLog('test');
    
    logger.setDefaultHandlers('test');

    expect(logger.test.logHandlers.log.length).toBe(1);
    expect(logger.test.logHandlers.info.length).toBe(1);
    expect(logger.test.logHandlers.warn.length).toBe(1);
    expect(logger.test.logHandlers.error.length).toBe(1);
  }]));

  it('should only call the logger both ways', inject(['flannel.logger', function(logger) {
    logger.createLog('test');
    
    var h = {
      log : function() { }
    };
    spyOn(h, 'log'); 
  
    logger.test.setLoggingHandler(logger.logLevels.error, h.log);
    expect(logger.test.logHandlers.error.length).toBe(1);
    logger.test.error('thing');
    expect(h.log).toHaveBeenCalled();
    logger.logs.test.error('thing2');
    expect(h.log).toHaveBeenCalledWith('thing2');
  }]));

  it('should throw an error if you try to create the same log twice', inject(['flannel.logger', function(logger) { 
    logger.createLog('test');

    expect(function() { logger.createLog('test') }).toThrow('Can not create log with that name');
  }]));

  it('should respect the log level heiarchy', inject(['flannel.logger', function(logger) { 
    logger.createLog('test');

    var h = {
      log   : function() { },
      info  : function() { },
      warn  : function() { },
      error : function() { }
    };  

    spyOn(h, 'log');
    spyOn(h, 'info');
    spyOn(h, 'warn');
    spyOn(h, 'error');
    logger.test.setLoggingHandler('info', h.info);
    logger.test.setLoggingHandler('log', h.log);
    logger.test.setLoggingHandler('warn', h.warn);
    logger.test.setLoggingHandler('error', h.error);

    logger.test.setLogLevel('info');
    logger.test.log('thing');
    logger.test.info('thing');

    expect(logger.test.logLevel).toBe('info');
    expect(h.log).not.toHaveBeenCalled();
    expect(h.info).toHaveBeenCalledWith('thing');

    logger.test.setLogLevel(null);
    logger.test.log('thing');
    logger.test.error('thing');
    expect(logger.test.logLevel).toBe(null);
    expect(logger.logLevel()).toBe('error');
    expect(h.log).not.toHaveBeenCalled();
    expect(h.error).toHaveBeenCalledWith('thing');
  }]));
});
