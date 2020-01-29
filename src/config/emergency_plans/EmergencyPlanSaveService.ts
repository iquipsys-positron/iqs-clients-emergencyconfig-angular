import { IEmergencyPlanSaveService } from './IEmergencyPlanSaveService';

class EmergencyPlanSaveService implements IEmergencyPlanSaveService {
    private _emergencyPlanId: string;
    private _currState: string;
    private _search: string;
    private _emergencyPlan: iqs.shell.EmergencyPlan;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
    ) {
        "ngInject";

    }

    public set emergencyPlan(emergencyPlan: iqs.shell.EmergencyPlan) {
        this._emergencyPlan = emergencyPlan;
    }

    public get emergencyPlan(): iqs.shell.EmergencyPlan {
        return this._emergencyPlan;
    }

    public set emergencyPlanId(emergencyPlanId: string) {
        this._emergencyPlanId = emergencyPlanId;
    }

    public get emergencyPlanId(): string {
        return this._emergencyPlanId;
    }

    public set currState(currState: string) {
        this._currState = currState;
    }

    public get currState(): string {
        return this._currState;
    }
    
    public set search(search: string) {
        this._search = search;
    }

    public get search(): string {
        return this._search;
    }

}

{
    angular.module('iqsConfigEmergencyPlan.SaveService', [])
        .service('iqsEmergencyPlanSaveService', EmergencyPlanSaveService);

}