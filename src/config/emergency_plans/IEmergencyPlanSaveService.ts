export interface IEmergencyPlanSaveService {
    emergencyPlanId: string;
    currState: string;
    search: string;
    emergencyPlan: iqs.shell.EmergencyPlan;
}
