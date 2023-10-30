import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() { }

  static setSavedState(state: any, localStorageKey: string) {
    // return localStorage.setItem(localStorageKey, state);
    return localStorage.setItem(localStorageKey, JSON.stringify(state));
  }

  static getSavedState(localStorageKey: string): any {
    // return JSON.parse(localStorage.getItem(localStorageKey));
    // return localStorage.getItem(localStorageKey);
    return JSON.parse(localStorage.getItem(localStorageKey));
  }
  static clearStateByKey(localStorageKey: string): any {
    return localStorage.removeItem(localStorageKey);
  }
  static clearState() {
    return localStorage.clear();
  }
}
