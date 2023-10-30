import {Action} from '@ngrx/store';

export enum ActionTypes {
  ADD_STM_QUERY = '[Statement Page] Statement Query',
  ADD_STM_ID = '[Statement ID Page] Statement Id',
  ADD_REC_ID = '[Receipt ID Page] Receipt Id',
}
export class StatementAction implements Action {
  type = ActionTypes.ADD_STM_QUERY;
  payload: {id: any, data: any};
  constructor(id: any, data: any) {
    this.payload = {id, data};
  }
}
export class StatementIdAction implements Action {
  type = ActionTypes.ADD_STM_ID;
  payload: {id: any, data: any};
  constructor(id: any, data: any) {
    this.payload = {id, data};
  }
}
export class ReceiptIdAction implements Action {
  type = ActionTypes.ADD_REC_ID;
  payload: {id: any, data: any};
  constructor(id: any, data: any) {
    this.payload = {id, data};
  }
}
export type Actions = StatementAction | StatementIdAction | ReceiptIdAction;
// export const statementQuery = createAction('[Statement Page] Statement Query');
