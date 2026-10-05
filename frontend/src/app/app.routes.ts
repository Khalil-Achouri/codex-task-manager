import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProjectComponent } from './pages/project/project';
import { UserComponent } from './pages/user/user';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'project/:id',
    component: ProjectComponent
  },
  {
    path: 'user',
    canActivate: [authGuard],
    component: UserComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
