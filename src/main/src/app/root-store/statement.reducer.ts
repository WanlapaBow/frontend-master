import {
  Actions,
  ActionTypes,
} from './statement.action';

export function statementReducer(state = {}, action: Actions) {
  let pageId = null;
  switch (action.type) {
    case ActionTypes.ADD_STM_QUERY:
      pageId = action.payload.id;
      const statement = action.payload.data;
      return {
        ...state,
        pageId,
        statement,
      };
    case ActionTypes.ADD_STM_ID:
      pageId = action.payload.id;
      const statementId = action.payload.data;
      return {
      ...state,
      pageId : pageId,
      statementId : statementId,
    };
      case ActionTypes.ADD_REC_ID:
      pageId = action.payload.id;
      const receiptId = action.payload.data;
      return {
      ...state,
      pageId : pageId,
      receiptId : receiptId,
    };
    default: {
      return state;
    }
  }
}
// export function statementReducer(state = initialState, action: Action): State<any> {
//   console.log(state, action);
//   switch (action.type) {
//     // case '[Statement Page] Statement Select':
//     //   console.log('select');
//     //   return _statementId(state, action);
//     default:
//       // return state;
//       return _statementRecucer(state, action);
//   }
// }
