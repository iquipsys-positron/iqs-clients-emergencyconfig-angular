import { IEmergencyPlanActionPageManager } from '../services/IEmergencyPlanActionPageManager';

class EmergencyPlanParams {
    public item: iqs.shell.EmergencyPlan;
}

interface IEmergencyPlanEditPanelBindings {
    [key: string]: any;

    onEmergencyPlanSave: any;
    onEmergencyPlanCancel: any;
    newItem: any;
    editItem: any;
    ngDisabled: any;
}

const EmergencyPlanEditPanelBindings: IEmergencyPlanEditPanelBindings = {
    // change operational event
    onEmergencyPlanSave: '&iqsSave',
    // add operational event
    onEmergencyPlanCancel: '&iqsCancel',
    // event template for edit
    newItem: '=?iqsNewItem',
    editItem: '=?iqsEditItem',
    ngDisabled: '&?'
}

class EmergencyPlanEditPanelChanges implements ng.IOnChangesObject, IEmergencyPlanEditPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onEmergencyPlanSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onEmergencyPlanCancel: ng.IChangesObject<() => ng.IPromise<void>>;
    newItem: ng.IChangesObject<iqs.shell.EmergencyPlan>;
    editItem: ng.IChangesObject<iqs.shell.EmergencyPlan>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class EmergencyPlanEditPanelController implements ng.IController {          public $onInit() {}
    public emergencyPlan: iqs.shell.EmergencyPlan;
    public epActionTypesCollection: iqs.shell.TypeCollection;
    public actionPagesCollection;
    public selectAll: boolean;

    public newItem: iqs.shell.EmergencyPlan;
    public editItem: iqs.shell.EmergencyPlan;
    public onEmergencyPlanSave: (eventTempl: EmergencyPlanParams) => void;
    public onEmergencyPlanCancel: () => void;
    public ngDisabled: () => boolean;

    public form: any;
    public touchedErrorsWithHint: Function;
    public error: string = '';

    constructor(
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $scope: ng.IScope,
        public pipMedia: pip.layouts.IMediaService,
        private pipScroll: pip.services.IScrollService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private iqsEmergencyPlanActionPageManager: IEmergencyPlanActionPageManager
    ) {
        "ngInject";

        $element.addClass('iqs-emergency-plan-edit-panel');
        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
        this.actionPagesCollection = this.iqsEmergencyPlanActionPageManager.actionPagesCollection;
    }

    public $postLink() {
        this.form = this.$scope.form;
    }

    public $onChanges(changes: EmergencyPlanEditPanelChanges): void {
        if (changes.newItem) {
            if (!_.isEqual(this.newItem, changes.newItem.previousValue)) {
                this.init();

                return;
            }
        }

        if (changes.editItem) {
            if (!_.isEqual(this.editItem, changes.editItem.previousValue)) {
                this.init();

                return;
            }
        }

        this.init();
    }

    private init(): void {
        this.epActionTypesCollection = this.iqsTypeCollectionsService.getEmergencyActionTypes();

        if (this.editItem) {
            this.emergencyPlan = _.cloneDeep(this.editItem);
        } else {
            this.emergencyPlan = _.cloneDeep(this.newItem);
        }
    }

    public onAddActionDetails(step: iqs.shell.EmergencyStep): void {
        let action: iqs.shell.EmergencyAction = new iqs.shell.EmergencyAction();
        action.params = {};
        action.type = iqs.shell.EmergencyActionType.Note;
        step.actions.push(action);
        this.scrollTo('#details-section-' + step.index + '-' + (step.actions.length - 1));
        this.pipFormErrors.resetFormErrors(this.form, false);
    }

    public onAddAction(): void {
        if (!_.isArray(this.emergencyPlan.steps)) {
            this.emergencyPlan.steps = [];
        }
        let step: iqs.shell.EmergencyStep = new iqs.shell.EmergencyStep();
        step.actions = [];

        // this.onAddActionDetails(step);
        step.index = this.emergencyPlan.steps.length + 1;
        this.emergencyPlan.steps.push(step);

        this.scrollTo('#add-action');
        this.pipFormErrors.resetFormErrors(this.form, false);
    }

    public moveUp(index: number): void {
        if (index == 0) { return }

        let step: iqs.shell.EmergencyStep = _.cloneDeep(this.emergencyPlan.steps[index]);
        this.emergencyPlan.steps[index] = this.emergencyPlan.steps[index - 1];
        this.emergencyPlan.steps[index].index = this.emergencyPlan.steps[index].index + 1;
        step.index = step.index - 1;
        this.emergencyPlan.steps[index - 1] = step;
    }

    public moveDown(index: number): void {
        if (index == this.emergencyPlan.steps.length - 1) { return }

        let step: iqs.shell.EmergencyStep = _.cloneDeep(this.emergencyPlan.steps[index]);
        this.emergencyPlan.steps[index] = this.emergencyPlan.steps[index + 1];
        this.emergencyPlan.steps[index].index = this.emergencyPlan.steps[index].index - 1;
        step.index = step.index + 1;
        this.emergencyPlan.steps[index + 1] = step;
    }

    public deleteStep(index: number): void {
        this.emergencyPlan.steps.splice(index, 1);
    }

    public deleteAction(step: iqs.shell.EmergencyStep, index: number): void {
        step.actions.splice(index, 1);
    }

    private clearEmptyParams() {
        let i: number, j: number;

        for (i = 0; i < this.emergencyPlan.steps.length; i++) {
            let step = this.emergencyPlan.steps[i];
            for (j = 0; j < step.actions.length; j++) {
                switch (step.actions[j].type) {
                    case iqs.shell.EmergencyActionType.Note:
                        if (!step.actions[j].params || !step.actions[j].params.text) {
                            step.actions.splice(j, 1);
                            j--;
                        }
                        break;
                    case iqs.shell.EmergencyActionType.CallPhone:
                        if (!step.actions[j].params || !step.actions[j].params.phone) {
                            step.actions.splice(j, 1);
                            j--;
                        }
                        break;
                    case iqs.shell.EmergencyActionType.LocalLink:
                        if (!step.actions[j].params || !step.actions[j].params.page) {
                            step.actions.splice(j, 1);
                            j--;
                        }
                        break;
                    case iqs.shell.EmergencyActionType.GlobalLink:
                        if (!step.actions[j].params || !step.actions[j].params.uri) {
                            step.actions.splice(j, 1);
                            j--;
                        }
                        break;
                }
            }
        }

        // set true index
        for (i = 0; i < this.emergencyPlan.steps.length; i++) {
            this.emergencyPlan.steps[i].index = i + 1;
        }  

    }

    public onSaveClick(): void {
        if (this.form.$invalid) {
            this.pipFormErrors.resetFormErrors(this.form, true);

            return;
        }


        this.clearEmptyParams()
        if (this.onEmergencyPlanSave) {
            this.pipFormErrors.resetFormErrors(this.form, false);
            this.onEmergencyPlanSave({ item: this.emergencyPlan });
        }
    }

    public onCancelClick(): void {
        if (this.onEmergencyPlanCancel) {
            this.onEmergencyPlanCancel();
        }
    }

    private scrollTo(toElement: string) {
        this.pipScroll.scrollTo('.pip-body', toElement, 300);
    }
}

(() => {
    angular
        .module('iqsEmergencyPlanEditPanel', [])
        .component('iqsEmergencyPlanEditPanel', {
            bindings: EmergencyPlanEditPanelBindings,
            templateUrl: 'config/emergency_plans/panels/EmergencyPlanEditPanel.html',
            controller: EmergencyPlanEditPanelController,
            controllerAs: '$ctrl'
        })
})();
