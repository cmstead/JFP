(function(){
    'use strict';

    var moduleName = 'highlight.directive.module';

    modules.push(moduleName);
    angular.module(moduleName, []);

    function Directive(){
        return {
            restrict: 'E',
            link: function(){
                $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }
        };
    }

    angular.module(moduleName)
           .directive('highlight', Directive);

})();