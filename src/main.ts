/*
*  Protractor support is deprecated in Angular.
*  Protractor is used in this example for compatibility with Angular documentation tools.
*/
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import routeConfig from './app/routes';
import { MultiplePostFailureInterceptor } from './app/shared/angular-post-failure-interceptor';

bootstrapApplication(AppComponent,
  {
    providers: [
      provideProtractorTestingSupport(),
      provideRouter(routeConfig),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MultiplePostFailureInterceptor,
        multi: true
      }
    ]
  }
).catch(err => console.error(err));
