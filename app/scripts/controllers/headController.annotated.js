(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            $scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            $scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();
(function(){
    'use strict';

    var moduleName = 'head.controller.module';
    modules.push(moduleName);
    angular.module(moduleName, []);

    /* @ngInclude */
    function Controller($scope){
        this.$scope = $scope;

        this.baseTitle = 'JFP: Javascript Function Processor';
        this.title = this.baseTitle;

        this.initWatcher();
    }
    Controller.$inject = ['$scope'];

    Controller.prototype = {
        setTitle: function(titleStr){
            this.title = (!!titleStr) ? titleStr + ' - ' : '';
            this.title += this.baseTitle;
        },

        initWatcher: function(){
            var setTitle = angular.bind(this, this.setTitle);

            this.$scope.$root.$on('title.update', function(event, data){
                setTitle(data.title);
            });
        }
    };

    angular.module(moduleName).controller('headController', Controller);

})();