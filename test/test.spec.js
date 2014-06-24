describe('flannel tests', function() {
  beforeEach(module('flannel'));
  afterEach(function() { 
    localStorage.removeItem('flannel.loglevel');
  });

  it('should define flannel.logger', inject(['flannel.logger', function(logger) { 
    expect(logger).toBeDefined();
  }]));

  it('should set a default logging level of error', inject(['flannel.logger', function(logger) {
    expect(logger.logLevel()).toBe(logger.logLevels.error);
  }]));

  it('should return the log level set in local storage', inject(['flannel.logger', function(logger) { 
    localStorage.setItem('flannel.loglevel', 'info');
    expect(logger.logLevel()).toBe(logger.logLevels.info);
  }]));

});
