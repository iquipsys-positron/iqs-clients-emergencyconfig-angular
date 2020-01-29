import { ActionPageParams } from './ActionPageParams';

export interface IEmergencyPlanActionPageManager {
    actionPagesCollection: ActionPageParams[];

    getPageTitle(action: iqs.shell.EmergencyAction): string;
    onPageClick(page: string): void;
}
