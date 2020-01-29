import { IEmergencyPlanActionPageManager } from '../services/IEmergencyPlanActionPageManager';

class EmergencyPlanParams {
    public item: iqs.shell.EmergencyPlan;
}

interface IEmergencyPlanPanelBindings {
    [key: string]: any;

    onEmergencyPlanEdit: any;
    onEmergencyPlanDelete: any;
    item: any;
    ngDisabled: any;
}

const EmergencyPlanPanelBindings: IEmergencyPlanPanelBindings = {
    // change operational event
    onEmergencyPlanEdit: '&iqsEdit',
    // add operational event
    onEmergencyPlanDelete: '&iqsDelete',
    // event template for edit
    item: '<?iqsEmergencyPlanItem',
    ngDisabled: '&?'
}

class EmergencyPlanPanelChanges implements ng.IOnChangesObject, IEmergencyPlanPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEmergencyPlanEdit: ng.IChangesObject<() => ng.IPromise<void>>;
    onEmergencyPlanDelete: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.EmergencyPlan>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EmergencyPlanPanelController implements ng.IController {
    public $onInit() { }

    public item: iqs.shell.EmergencyPlan;
    public onEmergencyPlanEdit: () => void;
    public onEmergencyPlanDelete: () => void;
    public ngDisabled: () => boolean;
    public accessConfig: any;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        public pipMedia: pip.layouts.IMediaService,
        private iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsEmergencyPlanActionPageManager: IEmergencyPlanActionPageManager,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plan-panel');
        if (this.iqsLoading.isDone) { this.accessConfig = iqsAccessConfig.getStateConfigure().access; }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.accessConfig = iqsAccessConfig.getStateConfigure().access; }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private prepare() {
        if (!this.item) return;

        _.each(this.item.steps, (step: iqs.shell.EmergencyStep) => {
            _.each(step.actions, (action: iqs.shell.EmergencyAction) => {
                if (action.type == iqs.shell.EmergencyActionType.LocalLink) {
                    action.params.pageTitle = this.iqsEmergencyPlanActionPageManager.getPageTitle(action);
                }
            });
        });
    }

    public $onChanges(changes: EmergencyPlanPanelChanges): void {
        this.prepare();
    }

    public onEdit(item: iqs.shell.EmergencyPlan): void {
        if (this.onEmergencyPlanEdit) {
            this.onEmergencyPlanEdit();
        }
    }

    public onDelete(item: iqs.shell.EmergencyPlan): void {
        if (this.onEmergencyPlanDelete) {
            this.onEmergencyPlanDelete();
        }
    }

    public onPageClick(page: string): void {
        this.iqsEmergencyPlanActionPageManager.onPageClick(page);
    }

}

(() => {
    angular
        .module('iqsEmergencyPlanPanel', [])
        .component('iqsEmergencyPlanPanel', {
            bindings: EmergencyPlanPanelBindings,
            templateUrl: 'config/emergency_plans/panels/EmergencyPlanPanel.html',
            controller: EmergencyPlanPanelController,
            controllerAs: '$ctrl'
        })
})();
