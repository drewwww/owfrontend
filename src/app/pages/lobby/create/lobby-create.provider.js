require('./step-restrictions.html');
require('./step-server.html');
require('./step-VOIP.html');
require('./header.html');
require('./lobby-create-steps.html');
require('./step-map.html');
require('./lobby-create.html');
require('./step-whitelist.html');
require('./step-format.html');
require('./step-league.html');

angular
    .module('tf2stadium')
    .config(LobbyCreateConfig);

angular
    .module('tf2stadium.services')
    .provider('LobbyCreate', LobbyCreate);

/** @ngInject */
function LobbyCreateConfig($stateProvider, LobbyCreateProvider) {
    /*
     Since the steps might change over time, it's much easier
     to add the nested states here with a loop instead of
     manually in app.route.js

     It also makes sense to add them in this separate file
     because they're nested states
     */
    LobbyCreateProvider.wizardSteps = [
        {name: 'format', groupKey: 'formats'},
        {name: 'map', groupKey: 'maps'},
        {name: 'league', groupKey: 'leagues'},
        {name: 'whitelist', groupKey: 'whitelists'},
        {name: 'VOIP', groupKey: 'VOIP'},
        {name: 'restrictions', groupKey: 'restrictions'},
        {name: 'server', groupKey: 'server'},
    ];

    for (var i = 0; i < LobbyCreateProvider.wizardSteps.length; i++) {
        var stepName = LobbyCreateProvider.wizardSteps[i].name;
        $stateProvider.state(stepName, {
            url: '/' + stepName,
            parent: 'lobby-create',
            views: {
                'wizard-step': {
                    templateUrl: 'app/pages/lobby/create/step-' + stepName + '.html',
                },
            },
        });
    }
}

/** @ngInject */
function LobbyCreate() {

    var lobbyCreateProvider = {};

    lobbyCreateProvider.wizardSteps = {};

    /** @ngInject */
    var lobbyCreateService = function (Websocket, $state, $rootScope,
                                       $filter) {
        var lobbySettingsList = {
            formats: {
                key: 'type',
                title: 'Format',
                filterable: true,
                options: [
                    {
                        value: '6s',
                        title: '6s',
                        important: true,
                    },
                    //{
                    //  value: 'highlander',
                    //  title: 'Highlander',
                    //  important: true,
                    //},{
                    //  value: '4v4',
                    //  title: '4v4',
                    //},{
                    //  value: 'ultiduo',
                    //  title: 'Ultiduo',
                    //},{
                    //  value: 'bball',
                    //  title: 'Bball',
                    //},{
                    //  value: 'debug',
                    //  title: 'Debug',
                    //},
                ],
            },
            maps: {
                key: 'map',
                title: 'Map',
                filterable: true,
                allowCustomInput: true,
                options: [
                    {
                        value: 'assault_volskaya',
                        '6s': true,
                    }, {
                        value: 'assault_temple',
                        '6s': true,
                    }, {
                        value: 'assault_hanamura',
                        important: true,
                        '6s': true,
                    }, {
                        value: 'hb_hollywood',
                        '6s': true,
                        important: true,
                    }, {
                        value: 'hb_numbani',
                        '6s': true,
                        highlander: true,
                    }, {
                        value: 'hb_kingsrow',
                        '6s': true,
                    }, {
                        value: 'koth_ilios',
                        '6s': true,
                    }, {
                        value: 'koth_lijiang',
                        '6s': true,
                        important: true,
                    }, {
                        value: 'koth_nepal',
                        important: true,
                        '6s': true,
                    }, {
                        value: 'pl_66',
                        important: true,
                        '6s': true,
                    }, {
                        value: 'pl_gibraltar',
                        '6s': true,
                    }, {
                        value: 'pl_dorado',
                        '6s': true,
                        important: true,
                    }
                ],
                dependsOn: [
                    'formats',
                ],
            },


            //leagues

            leagues: {
                key: 'league',
                title: 'League',
                filterable: true,
                options: [
                    {
                        value: 'competitive',
                        title: 'Competitive',
                        description: 'For the hardcore gamer',
                        '6s': true,
                        highlander: true,
                        bball: true,
                        ultiduo: true,
                    },
                    {
                        value: 'casual',
                        title: 'Casual',
                        description: 'For the casual gamer',
                        '6s': true,
                        highlander: true,
                        bball: true,
                        ultiduo: true,
                    },
                    //{
                    //  value: 'etf2l',
                    //  title: 'ETF2L',
                    //  description: '',
                    //  '6s': true,
                    //  highlander: true,
                    //  bball: true,
                    //  ultiduo: true,
                    //},{
                    //  value: 'ugc',
                    //  title: 'UGC',
                    //  description: '',
                    //  '6s': true,
                    //  highlander: true,
                    //  '4v4': true,
                    //},{
                    //  value: 'esea',
                    //  title: 'ESEA',
                    //  description: '',
                    //  '6s': true,
                    //},{
                    //  value: 'ozfortress',
                    //  title: 'ozfortress',
                    //  description: '',
                    //  '6s': true,
                    //},{
                    //  value: 'asiafortress',
                    //  title: 'AsiaFortress',
                    //  description: '',
                    //  '6s': true,
                    //},{
                    //  value: 'bballtf',
                    //  title: 'bball.tf',
                    //  description: '',
                    //  bball: true,
                    //},
                ],
                dependsOn: ['formats'],
            },
            //whitelists

            whitelists: {
                key: 'whitelistID',
                title: 'Whitelist',
                filterable: true,
                allowCustomInput: false,
                options: [


                    {
                        value: 'Default',
                        title: 'Default',
                        casual: true,
                        competitive: true,
                        esea: true,
                        ugc: true,
                        '6s': true,
                        description: 'Perhaps there will be more whitelists in the future'
                    },

                    //{
                    //    value: 'ETF2L_9v9',
                    //    title: 'ETF2L Highlander',
                    //    casual: true,
                    //    competitive: true,
                    //    etf2l: true,
                    //    highlander: true,
                    //},
                    //{
                    //    value: 'ETF2L_6v6',
                    //    title: 'ETF2L 6v6',
                    //    casual: true,
                    //    competitive: true,
                    //    etf2l: true,
                    //    '6s': true,
                    //}, {
                    //    value: 'UGC_9v9',
                    //    title: 'UGC Highlander',
                    //    casual: true,
                    //    competitive: true,
                    //    ugc: true,
                    //    highlander: true,
                    //}, {
                    //    value: 'UGC_6v6',
                    //    title: 'UGC 6v6',
                    //    casual: true,
                    //    competitive: true,
                    //    ugc: true,
                    //    '6s': true,
                    //}, {
                    //    value: 'UGC_4v4',
                    //    title: 'UGC 4v4',
                    //    casual: true,
                    //    competitive: true,
                    //    ugc: true,
                    //    '4v4': true,
                    //}, {
                    //    value: 'ESEA_6v6',
                    //    title: 'ESEA 6v6',
                    //    casual: true,
                    //    competitive: true,
                    //    esea: true,
                    //    '6s': true,
                    //}, {
                    //    value: 'ozfortress_6v6',
                    //    title: 'ozfortress 6v6',
                    //    casual: true,
                    //    competitive: true,
                    //    ozfortress: true,
                    //    '6s': true,
                    //}, {
                    //    value: 'AsiaFortress_6v6',
                    //    title: 'AsiaFortress 6v6',
                    //    casual: true,
                    //    competitive: true,
                    //    asia: true,
                    //    '6s': true,
                    //}, {
                    //    value: 'ETF2L_ultiduo',
                    //    title: 'ETF2L Ultiduo',
                    //    casual: true,
                    //    competitive: true,
                    //    etf2l: true,
                    //    ultiduo: true,
                    //}, {
                    //    value: 'ETF2L_bball',
                    //    title: 'ETF2L BBall',
                    //    casual: true,
                    //    competitive: true,
                    //    etf2l: true,
                    //    bball: true,
                    //}, {
                    //    value: 'bballtf',
                    //    title: 'bball.tf',
                    //    casual: true,
                    //    competitive: true,
                    //    bball: true,
                    //    bballtf: true,
                    //},
                ],
                dependsOn: [
                    'formats',
                    'leagues',
                ],
            },

            //mumble

            VOIP: {
                key: 'voipRequired',
                title: 'Ingame Voice required',
                options: [
                    {
                        value: true,
                        title: 'Ingame voice required',
                        description: 'All participants are expected to communicate.',
                    }, {
                        value: false,
                        title: 'Ingame voice not required',
                        description: 'Participants will join the ingame voice if they wish.',
                    },
                ],
            },
            restrictions: {
                key: 'restrictionsSet',
            },
        };

        lobbyCreateService.settings = {
            requirements: {
                general: {
                    //hours: 0,
                    lobbies: 0,
                },
            },
            server: 'null',
            rconpwd: 'null',
        };

        var deleteSetting = function (key) {
            delete lobbyCreateService.settings[key];
            $rootScope.$emit('lobby-create-settings-updated');
        };

        /*
         Receives a field (e.g. lobbySettingsList.maps) and an option value
         (e.g. 'pl_upward'), finds the option in the field and checks
         if it's valid
         */
        var isSettingValid = function (fieldKey, optionValue) {
            var field = lobbySettingsList[fieldKey];
            var optionFilter = $filter('LobbyCreateOptionFilter');

            return field.allowCustomInput ||
                field.options.filter(function (option) {
                    return option.value === optionValue &&
                        optionFilter([option], fieldKey, '')[0];
                });
        };

        lobbyCreateService.subscribe = function (request, scope, callback) {
            var handler = $rootScope.$on(request, callback);
            scope.$on('$destroy', handler);
        };

        lobbyCreateService.create = function (lobbySettings, callback) {
            callback = callback || angular.noop;

            if (angular.isUndefined(lobbySettings.serverType)) {
                lobbySettings.serverType = 'server';
            }

            Websocket.emitJSON('lobbyCreate', lobbySettings, function (response) {
                    if (true) {
                        $state.go('lobby-page', {lobbyID: response.data.id});
                    }
                    callback(response);
                }
            );
        };

        lobbyCreateService.verifyServer = function (callback) {
            callback = callback || angular.noop;

            Websocket.emitJSON('serverVerify', {server: lobbyCreateService.settings.server, rconpwd: lobbyCreateService.settings.rconpwd, map: lobbyCreateService.settings.map,}, function (response) {
                callback(response);
            });
        };

        lobbyCreateService.getStoredServers = function () {
            return Websocket.emitJSON('getStoredServers');
        };

        //lobbyCreateService.getServemeServers = function () {
        //    return Websocket.emitJSON('getServemeServers');
        //};

        lobbyCreateService.getSettingsList = function () {
            return lobbySettingsList;
        };

        lobbyCreateService.getSteps = function () {
            return lobbyCreateProvider.wizardSteps;
        };

        lobbyCreateService.clearLobbySettings = function () {
            lobbyCreateService.settings = {};
            $rootScope.$emit('lobby-create-settings-updated');
        };

        lobbyCreateService.getLobbySettings = function () {
            return lobbyCreateService.settings;
        };

        lobbyCreateService.set = function (key, value) {
            lobbyCreateService.settings[key] = value;
            $rootScope.$emit('lobby-create-settings-updated');

            //If we select something, we need to check if the next steps
            //have already been selected, and if they have, check that they're valid
            var checks = [
                {fieldKey: 'maps', optionName: lobbyCreateService.settings.map},
                {fieldKey: 'leagues', optionName: lobbyCreateService.settings.league},
                {fieldKey: 'whitelists', optionName: lobbyCreateService.settings.whitelistID},
            ];

            checks.forEach(function (check) {
                if (!isSettingValid(check.fieldKey, check.optionName)) {
                    var field = lobbySettingsList[check.fieldKey];
                    //deleteSetting(field.key);
                }
            });
        };

        return lobbyCreateService;
    };

    lobbyCreateProvider.$get = lobbyCreateService;

    return lobbyCreateProvider;
}
