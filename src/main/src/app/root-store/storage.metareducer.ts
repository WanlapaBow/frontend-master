import {ActionReducer} from '@ngrx/store';

export function persistStateReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  const localStorageKey = '__arstatement';
  return function(state, action) {
    if (state === undefined) {
      const persisted = sessionStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : reducer(state, action);
    }
    const result = reducer(state, action);
    sessionStorage.setItem(localStorageKey, JSON.stringify(result));
    return result;
  };
}
// function setSavedState(state: any, localStorageKey: string) {
//   localStorage.setItem(localStorageKey, JSON.stringify(state));
// }
// function getSavedState(localStorageKey: string): any {
//   return JSON.parse(localStorage.getItem(localStorageKey));
// }
// const localStorageKey = 'state';
// export function storageMetaReducer<S, A extends Action = Action> (reducer: ActionReducer<S, A>) {
//   // let onInit = true; // after load/refresh…
//   return function(state: S, action: A): S {
//     // reduce the nextState.
//     const nextState = reducer(state, action);
//     // init the application state.
//     // if (onInit) {
//     //   onInit           = false;
//     //   const savedState = getSavedState(localStorageKey);
//     //   return merge(nextState, savedState);
//     // }
//     // save the next state to the application storage.
//     // const stateToSave = pick(nextState, stateKeys);
//     setSavedState(state, localStorageKey);
//     return nextState;
//   };
// }
// export function persistStateReducer(_reducer: ActionReducer<State>) {
//   const localStorageKey = '__groceries';
//   return (state: State | undefined, action: Action) => {
//     if (state === undefined) {
//       const persisted = localStorage.getItem(localStorageKey);
//       return persisted ? JSON.parse(persisted) : _reducer(state, action);
//     }
//
//     const nextState = _reducer(state, action);
//     localStorage.setItem(localStorageKey, JSON.stringify(nextState));
//     return nextState;
//   };
// }
//
// export function updateStateReducer(_reducer: ActionReducer<State>) {
//   return (state: State | undefined, action: Action) => {
//     if (action.type === 'UPDATE_GROCERIES_STATE') {
//       return (<any>action).payload.newState;
//     }
//
//     return _reducer(state, action);
//   };
// }
//
// export function reducer(state: State | undefined, action: Action) {
//   return updateStateReducer(persistStateReducer(action))(state, action);
// }
