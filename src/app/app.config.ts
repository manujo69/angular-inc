import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { UserApiService } from './features/users/services/user-api.service';
import { MockUserApiService } from './features/users/services/mock-user-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    ...(environment.useMock
      ? [{ provide: UserApiService, useClass: MockUserApiService }]
      : []),
  ],
};
