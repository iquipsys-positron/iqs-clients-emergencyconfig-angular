import './emergency_plans/EmergencyPlan';

export const ConfigStateName: string = 'app';

(() => {
    function configureConfigRoute(
        $injector: angular.auto.IInjectorService,
        $stateProvider: pip.rest.IAuthStateService
    ) {
        "ngInject";
        $stateProvider
            .state(ConfigStateName, {
                url: '',
                abstract: true,
                auth: true,
                reloadOnSearch: false,
                views: {
                    '@': {
                        template: "<div class='iqs-config' ui-view></div>"
                    }
                }
            })
    }

    function configureConfigAccess(
        iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
    ) {
        "ngInject";

        let accessLevel: number = iqs.shell.AccessRole.user;
        let accessConfig: any = {
            
                }

        iqsAccessConfigProvider.registerStateAccess(ConfigStateName, accessLevel);

        iqsAccessConfigProvider.registerStateConfigure(ConfigStateName, accessConfig);
    }

    angular
        .module('iqsConfig', [
            'iqsConfigEmergencyPlans',
        ])
        .config(configureConfigRoute)
        .config(configureConfigAccess);
})();

