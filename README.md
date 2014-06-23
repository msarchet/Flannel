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
