// //app.config.ts
// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { AuthInterceptor } from './Interceptor.interceptor';

// import {
//   HTTP_INTERCEPTORS,
//   provideHttpClient,
//   withInterceptorsFromDi,
// } from '@angular/common/http';
 

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes),
//   provideHttpClient(withInterceptorsFromDi()),
//   {
//     provide: HTTP_INTERCEPTORS,
//     useClass: AuthInterceptor,
//     multi: true
//   }
// ]
// };
