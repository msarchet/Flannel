Flannel
=======

Quick Start!

Install with Bower

    bower install flannel

Use

Add flannel as a module, set up your loggers, set a logging level

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

About
=====

Flannel has 4 logging levels

-  log
-  info
-  warn
-  error

You can add a handler to a logging level for doing things like posting to an API by calling

    logger.setLoggingHandler(logger.logLevel.<level>, yourHandler)

Calling `setDefaultHandlers()` will turn on the `console.<level>` loggers

By default the logging level is **error**

You can change the logging level at runtime by calling

    localStorage.setItem('flannel.loglevel', <level>)


