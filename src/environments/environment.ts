// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseLink: 'http://localhost:4001',
  ftpBaseLink: 'http://localhost:4001',
  // apiBaseLink: 'https://api.safetouch.com.bd',
  // ftpBaseLink: 'https://ftp.safetouch.com.bd',
  appBaseUrl: '/',
  userBaseUrl: '/account',
  userLoginUrl: '/login',
  adminLoginUrl: 'admin/login',
  adminBaseUrl: 'admin',
  vendorBaseUrl: 'vendor',
  vendorLoginUrl: 'vendor/login',
  sslIpnUrl: 'https://api.safetouch.com.bd/api/payment-ssl/ipn',
  firebaseConfig: {
    apiKey: '/',
    authDomain: '/',
    projectId: '/',
    storageBucket: '/',
    messagingSenderId: '/',
    appId: '/',
    measurementId: '/',
  },
  VERSION: 2,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
