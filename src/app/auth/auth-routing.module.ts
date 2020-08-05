import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';


@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: AuthPage
    }
  ])],
})
export class AuthPageRoutingModule {}
