function MemberWalletMainController($rootScope, $scope, $log, $q, $timeout, $mdDialog, $mdSidenav, ConfigFileService, CommonService, ElectronService, EtherScanService) {
    'ngInject'

    $log.info('MemberWalletMainController');
    let now = new Date();

    $scope.docBoxData = {
        name: "National ID",
        acceptableDocuments: "You can upload documents which at least contain your personal number, first name, last name, birth date and photo",
        documents: [
            {
                name: 'ID Card',
                files: [{name: 'Robert_Plant_id.jpg'}],
                actionHistory: [
                    {
                        date: new Date(now - 10000000),
                        status: 1,
                        note: "shared with bitDegree testing long text",
                        actions: [
                            /*
                            {
                                title: 'request verification',
                                link: '/app/verify?docId=789'
                            }
                            */
                        ]
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    }
                ]
            },
            {
                name: 'ID Card',
                files: [{name: 'John_id.jpg'}],
                actionHistory: [
                    {
                        date: new Date(now - 10000000),
                        status: 1,
                        note: "shared with bitDegree",
                        actions: [
                            {
                                title: 'request verification',
                                link: '/app/verify?docId=789'
                            }
                        ]
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 2,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    },
                    {
                        date: new Date(now - 1000000),
                        status: 3,
                        note: "shared with blockChain",
                        actions: []
                    }
                ]
            },
        ],
    };

    $scope.addIdAttribute = (event) => {   
        $mdDialog.show({
            controller: "AddIdAttributeDialog",
            templateUrl: "common/dialogs/add-id-attribute.html",
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: true
        }).then((respItem) => {
            let store = ConfigFileService.getStore();

            if (!store.idAttributes[respItem.idAttributeType.key]) {
                store.idAttributes[respItem.idAttributeType.key] = respItem;
            }

            $log.info('store to save:', store);

            ConfigFileService.save().then((resp) => {
                $rootScope.$broadcast('id-attributes-changed', respItem);
            });
        });
    }

    loadIdAttributes ();

    function loadIdAttributes () {
        let store = ConfigFileService.getStore();
        let idAttributes = store.idAttributes;

        $scope.allIdAttributesList = idAttributes;
    }

    $rootScope.$on('id-attributes-changed', (event) => {
        let store = ConfigFileService.getStore();
        $scope.allIdAttributesList = store.idAttributes;
    });
};

export default MemberWalletMainController;