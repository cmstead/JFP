(function(){
    'use strict';

    angular.module('jfp.app', modules);

    function RouteConfig($stateProvider, $urlRouterProvider){

        $stateProvider

            .state('root', {
                url: '/',
                templateUrl: 'templates/_home.html'
            })

            .state('documents', {
                url: '/documents',
                abstract: true,
                templateUrl: 'templates/_documents.html'
            })
            .state('documents.core', {
                url: '/core',
                templateUrl: 'templates/documents/_core.html'
            })
            .state('documents.array', {
                url: '/array',
                templateUrl: 'templates/documents/_array.html'
            })
            .state('documents.conditional', {
                url: '/conditional',
                templateUrl: 'templates/documents/_conditional.html'
            })
            .state('documents.conversion', {
                url: '/conversion',
                templateUrl: 'templates/documents/_conversion.html'
            })
            .state('documents.math', {
                url: '/math',
                templateUrl: 'templates/documents/_math.html'
            })
            .state('documents.object', {
                url: '/object',
                templateUrl: 'templates/documents/_object.html'
            })
            .state('documents.predicate', {
                url: '/predicate',
                templateUrl: 'templates/documents/_predicate.html'
            });

        $urlRouterProvider.otherwise('/');
    }

    RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    angular.module('jfp.app')
           .config(RouteConfig);

    angular.bootstrap(document, ['jfp.app']);

})();