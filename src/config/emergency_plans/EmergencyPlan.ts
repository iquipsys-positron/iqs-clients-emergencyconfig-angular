import { IEmergencyPlanSaveService } from './IEmergencyPlanSaveService';

export const ConfigEmergencyPlansStateName: string = 'app.emergency_plans';

class ConfigEmergencyPlansController implements ng.IController {
    public $onInit() { }
    private cleanUpFunc: Function;
    private mediaSizeGtSm: boolean;

    public details: boolean;

    public searchCriteria: string = '';
    public currentState: string;
    public new: iqs.shell.EmergencyPlan;
    public edit: iqs.shell.EmergencyPlan;
    public accessConfig: any;
    public isPreLoading: boolean = true;
    private cf: Function[] = [];

    constructor(
        private $window: ng.IWindowService,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        $scope: ng.IScope,
        private pipNavService: pip.nav.INavService,
        private pipTranslate: pip.services.ITranslateService,
        private pipMedia: pip.layouts.IMediaService,
        private pipScroll: pip.services.IScrollService,
        private pipConfirmationDialog: pip.dialogs.IConfirmationDialogService,
        private $rootScope: ng.IRootScopeService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsEmergencyPlansViewModel: iqs.shell.IEmergencyPlansViewModel,
        private iqsEmergencyPlanSaveService: IEmergencyPlanSaveService,
        iqsAccessConfig: iqs.shell.IAccessConfigService,
        private iqsLoading: iqs.shell.ILoadingService
    ) {
        "ngInject";

        this.restoreState();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        const runWhenReady = () => {
            this.accessConfig = iqsAccessConfig.getStateConfigure().access;
            this.iqsEmergencyPlansViewModel.filter = null;
            this.iqsEmergencyPlansViewModel.isSort = true;
            this.iqsEmergencyPlansViewModel.reload(() => {
                let collection = this.iqsEmergencyPlansViewModel.getCollection(this.searchCriteria);
                this.isPreLoading = false;
            });
        };
        if (this.iqsLoading.isDone) { runWhenReady(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, runWhenReady.bind(this)));

        if (!this.pipMedia('gt-sm')) {
            if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                this.details = true;
            } else {
                this.details = $location.search().details == 'details' ? true : false;
            }
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        this.cf.push($rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                } else {
                    if (this.currentState === iqs.shell.States.Add || this.currentState === iqs.shell.States.Edit) {
                        this.details = true;
                    }
                }
                this.appHeader();
            }
        }));

        this.appHeader();
        this.cf.push($rootScope.$on(pip.services.IdentityChangedEvent, () => {
            this.appHeader();
        }));

    }

    public $onDestroy() {
        this.saveCurrentState();
        for (const f of this.cf) { f(); }
    }

    private saveCurrentState() {
        this.iqsEmergencyPlanSaveService.emergencyPlanId = this.collection && this.collection.length > 0 && this.selectedIndex > -1 ? this.collection[this.selectedIndex].id : null;
        this.iqsEmergencyPlanSaveService.currState = this.currentState;
        this.iqsEmergencyPlanSaveService.search = this.searchCriteria;
        this.iqsEmergencyPlanSaveService.emergencyPlan = this.new ? this.new : this.edit;
    }

    private restoreState() {
        this.searchCriteria = this.iqsEmergencyPlanSaveService.search ? this.iqsEmergencyPlanSaveService.search : this.$location.search()['search'] || '';
        if (!this.$location.search()['emergency_plan_id'] && this.iqsEmergencyPlanSaveService.emergencyPlanId) {
            this.$location.search('emergency_plan_id', this.iqsEmergencyPlanSaveService.emergencyPlanId);
        }
        this.currentState = this.iqsEmergencyPlanSaveService.currState ? this.iqsEmergencyPlanSaveService.currState : null;
        this.currentState = this.currentState == iqs.shell.States.Add || this.currentState == iqs.shell.States.Edit ? null : this.currentState;
        if (this.currentState === iqs.shell.States.Add) {
            this.new = this.iqsEmergencyPlanSaveService.emergencyPlan;
            this.edit = null;
        } else if (this.currentState === iqs.shell.States.Edit) {
            this.new = null;
            if (this.iqsEmergencyPlanSaveService.emergencyPlan) {
                this.edit = this.iqsEmergencyPlanSaveService.emergencyPlan;
            } else {
                this.edit = null;
                this.currentState = null;
            }

            this.new = null;
            this.edit = this.iqsEmergencyPlanSaveService.emergencyPlan;
        }
    }

    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.onCancel();
        this.appHeader();
    }

    private appHeader(): void {
        this.pipNavService.appbar.removeShadow();
        this.pipNavService.appbar.parts = { 'icon': true, 'actions': 'primary', 'menu': true, 'title': 'breadcrumb', 'organizations': this.pipMedia('gt-sm') };
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';

        if (!this.pipMedia('gt-sm') && this.details) {
            const detailsTitle = this.currentState === iqs.shell.States.Add
                ? 'EMERGENCY_PLAN_DETAILS_NEW'
                : this.currentState === iqs.shell.States.Edit
                    ? 'EMERGENCY_PLAN_DETAILS_EDIT'
                    : 'EMERGENCY_PLAN_DETAILS';

            this.pipNavService.breadcrumb.items = [
                <pip.nav.BreadcrumbItem>{
                    title: "EMERGENCY_PLANS", click: () => {
                        this.toMainFromDetails();
                    }, subActions: []
                },
                <pip.nav.BreadcrumbItem>{
                    title: detailsTitle, click: () => { }, subActions: []
                }
            ];
            this.pipNavService.icon.showBack(() => {
                this.toMainFromDetails();
            });
        } else {
            this.pipNavService.breadcrumb.text = 'EMERGENCY_PLANS';
            this.pipNavService.icon.showMenu();
        }

        this.pipNavService.actions.hide();
    }

    private focusedNewButton() {
        this.pipScroll.scrollTo('.pip-list-container', '#new-item', 300);
    }

    public selectItem(index: number) {
        if (this.state == iqs.shell.States.Add || this.state == iqs.shell.States.Edit) { return };

        if (index !== undefined && index !== null) this.iqsEmergencyPlansViewModel.selectItem(index);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    }

    public get selectedIndex() {
        return this.state != iqs.shell.States.Add ? this.iqsEmergencyPlansViewModel.selectedIndex : -1;
    }

    public set selectedIndex(value: number) {

    }

    public get collection(): iqs.shell.EmergencyPlan[] {
        return this.iqsEmergencyPlansViewModel.getCollection(this.searchCriteria);
    }

    public get state(): string {
        return this.currentState ? this.currentState : this.iqsEmergencyPlansViewModel.state;
    }

    public get transaction(): pip.services.Transaction {
        return this.iqsEmergencyPlansViewModel.getTransaction();
    }

    public get searchedCollection(): string[] {
        return this.iqsEmergencyPlansViewModel.searchedCollection;
    }

    public reload(): void {
        this.iqsEmergencyPlansViewModel.reload();
    }

    public onRetry() {
        this.$window.history.back();
    }

    public onEdit() {
        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            this.edit = _.cloneDeep(this.collection[this.selectedIndex]);
            this.new = null;
            this.currentState = iqs.shell.States.Edit;
        }
    }

    public onDelete() {
        if (this.transaction.busy()) {
            return;
        }

        if (this.selectedIndex > -1 && this.collection[this.selectedIndex]) {
            this.pipConfirmationDialog.show(
                {
                    event: null,
                    title: this.pipTranslate.translate('EMERGENCY_PLAN_DELETE_CONFIRMATION_TITLE') + ' "' + this.collection[this.selectedIndex].name + '"?',
                    ok: 'CONFIRM_DELETE',
                    cancel: 'CONFIRM_CANCEL'
                },
                () => {
                    this.onDeleteItem(this.collection[this.selectedIndex]);
                },
                () => {
                    console.log('You disagreed');
                }
            );
        }
    }

    public onSearchResult(searchQuery: string): void {
        this.searchCriteria = searchQuery;
        this.$location.search('search', this.searchCriteria);
        if (this.state == iqs.shell.States.Empty) {
            this.iqsEmergencyPlansViewModel.getCollection(this.searchCriteria);
        }
    }

    public onCanselSearch() {
        this.searchCriteria = '';
        this.$location.search('search', this.searchCriteria);
    }

    public onAdd() {
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }

        this.new = new iqs.shell.EmergencyPlan();
        this.edit = null;
        this.currentState = iqs.shell.States.Add;

        if (this.pipMedia('gt-sm')) {
            this.focusedNewButton();
        }
    }

    public onSave(item: iqs.shell.EmergencyPlan): void {
        if (this.transaction.busy() || !item) {
            return;
        }

        if (this.currentState == iqs.shell.States.Add) {
            item.org_id = this.iqsOrganization.orgId;

            this.iqsEmergencyPlansViewModel.create(
                item,
                (data: iqs.shell.EmergencyPlan) => {
                    this.currentState = null
                    this.new = null;
                    this.searchCriteria = '';
                    if (this.state == iqs.shell.States.Empty) {
                        this.iqsEmergencyPlansViewModel.getCollection(this.searchCriteria);
                    }
                },
                (error: any) => { }
            );
        } else if (this.currentState == iqs.shell.States.Edit) {
            this.iqsEmergencyPlansViewModel.updateEmergencyPlansById(
                item.id,
                item,
                (data: iqs.shell.EmergencyPlan) => {
                    this.currentState = null
                    this.edit = null;
                },
                (error: any) => { }
            );
        }
    }

    public onCancel() {
        this.details = this.currentState == iqs.shell.States.Add ? false : this.details;
        this.currentState = null;
        this.new = null;
        this.edit = null;
        this.appHeader();
    }

    public onDeleteItem(item: iqs.shell.EmergencyPlan) {
        if (this.transaction.busy()) {
            return;
        }

        if (item && item.id) {
            this.iqsEmergencyPlansViewModel.deleteEmergencyPlansById(
                item.id,
                () => {
                    this.details = false;
                    this.$location.search('details', 'main');
                    this.appHeader();
                    // todo toast deleted
                },
                (error: any) => { }
            );
        }
    }
}

function configureConfigEmergencyPlansRoute(
    $stateProvider: pip.rest.IAuthStateService
) {
    "ngInject";

    $stateProvider
        .state(ConfigEmergencyPlansStateName, {
            url: '/emergency_plans?emergency_plan_id&details&search',
            controller: ConfigEmergencyPlansController,
            reloadOnSearch: false,
            auth: true,
            controllerAs: '$ctrl',
            templateUrl: 'config/emergency_plans/EmergencyPlan.html'
        });
}

function configureConfigEmergencyPlansAccess(
    iqsAccessConfigProvider: iqs.shell.IAccessConfigProvider
) {
    "ngInject";

    let accessLevel: number = iqs.shell.AccessRole.manager;
    let accessConfig: any = {
        addEmergency: iqs.shell.AccessRole.manager,
        deleteEmergency: iqs.shell.AccessRole.manager,
        editEmergency: iqs.shell.AccessRole.manager
    };
    iqsAccessConfigProvider.registerStateAccess(ConfigEmergencyPlansStateName, accessLevel);
    iqsAccessConfigProvider.registerStateConfigure(ConfigEmergencyPlansStateName, accessConfig);
}

(() => {

    angular
        .module('iqsConfigEmergencyPlans', [
            'pipNav', 'iqsEmergencyPlans.ViewModel',

            'iqsEmergencyPlanPanel',
            'iqsEmergencyPlanEmptyPanel',
            'iqsEmergencyPlanEditPanel',
            'iqsConfigEmergencyPlan.SaveService',

            'iqsGlobalSearch', 'iqsEmergencyPlanActionPageManager'
        ])
        .config(configureConfigEmergencyPlansRoute)
        .config(configureConfigEmergencyPlansAccess);
})();
