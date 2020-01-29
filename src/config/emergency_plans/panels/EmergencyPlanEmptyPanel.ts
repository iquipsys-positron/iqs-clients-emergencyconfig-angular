interface IEmergencyPlanEmptyPanelBindings {
    [key: string]: any;

    onEmergencyPlanAdd: any;
    state: any,
    isPreLoading: any;
}

const EmergencyPlanEmptyPanelBindings: IEmergencyPlanEmptyPanelBindings = {
    // change operational event
    onEmergencyPlanAdd: '&iqsAdd',
    state: '<?iqsState',
    isPreLoading: '<?iqsPreLoading'
}

class EmergencyPlanEmptyPanelChanges implements ng.IOnChangesObject, IEmergencyPlanEmptyPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEmergencyPlanAdd: ng.IChangesObject<() => ng.IPromise<void>>;
    state: ng.IChangesObject<string>;
    isPreLoading: ng.IChangesObject<boolean>;
}

class EmergencyPlanEmptyPanelController implements ng.IController {
    public $onInit() { }
    public onEmergencyPlanAdd: () => void;
    public accessConfig: any;
    public isPreLoading: boolean;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plan-empty-panel');
        if (this.iqsLoading.isDone) { this.accessConfig = iqsAccessConfig.getStateConfigure().access; }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.accessConfig = iqsAccessConfig.getStateConfigure().access; }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public onAdd(): void {
        if (this.onEmergencyPlanAdd) {
            this.onEmergencyPlanAdd();
        }
    }
}

(() => {
    angular
        .module('iqsEmergencyPlanEmptyPanel', [])
        .component('iqsEmergencyPlanEmptyPanel', {
            bindings: EmergencyPlanEmptyPanelBindings,
            templateUrl: 'config/emergency_plans/panels/EmergencyPlanEmptyPanel.html',
            controller: EmergencyPlanEmptyPanelController,
            controllerAs: '$ctrl'
        })
})();
