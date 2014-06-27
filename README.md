Flannel
=======

Quick Start!

Install with Bower

    bower install flannel

Use

Add flannel as a module, set up your loggers, set a logging level

```javascript
(function () {
    function homeController(logger) {
        logger.log('thing', 123, {
            123: 123
        });
        logger.warn('thing', 123, {
            123: 123
        });
        logger.info('thing', 123, {
            123: 123
        });
        logger.error('thing', 123, {
            123: 123
        });
    }
 
    var app = angular.module('app', ['flannel']);
    app.run(['flannel.logger', function (logger) {
        logger.setDefaultHandlers();
        logger.setLogLevel(logger.logLevels.info);
        logger.setLoggingHandler(logger.logLevels.info, function () {
            console.log('Custom info handler!');
        });
 
    }]);
    app.controller('home', ['flannel.logger', homeController]);
 
})();
```

## Named Logs

Flannel also supports the ability to name your logs for fine grained control over what logs your are turning on and off.

First create a named log: 

```javascript

app.run(['flannel.logger', function(logger)  { 
  logger.createLog('http');
  logger.setDefaultHandlers('http');
}]);
```

You can now access this log directly off of logger

```javascript
logger.http.log('thing')
```

All of the methods available on the unamed (global) log are available on the named logs.

About
=====

Flannel has 4 logging levels

-  log
-  info
-  warn
-  error

You can add a handler to a logging level for doing things like posting to an API by calling

```javascript
logger.setLoggingHandler(logger.logLevel.<level>, yourHandler)
```

Calling `setDefaultHandlers()` will turn on the `console.<level>` loggers

By default the logging level is **error**

You can change the logging level at runtime by calling

```javascript
// set a global override
localStorage.setItem('flannel.loglevel', <level>)

// set a named log override
localStorage.setItem('flannel.loglevel.http', <level>)
```

Log levels are read in this order

1. named log override - log level
1. global override - log level
1. named log - log level
1. global log - log level
