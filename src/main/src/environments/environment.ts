/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  clientUrl: 'http://localhost:4200',
  // apiUrl: 'http://130.61.191.182/arservice/',
  // apiUrl: 'http://130.61.140.230/arservice/',

  // apiUrl: 'http://192.168.0.200:9090/statement/',
  // apiUrl: 'http://192.168.137.1:8080/statement/',
  // apiUrl: 'http://192.168.137.1:8080',
  apiUrl: 'http://localhost:8080/arservice/',
  // apiUrl: 'http://localhost:8080/statement/',

  // apiUrl: 'http://130.61.223.49/statement/',
  mainpage: 'http://130.61.223.49/customize',

};
