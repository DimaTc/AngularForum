import { ThreadComponent } from './components/thread/Thread.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'', component:MainPageComponent},
  {path:'login', component:LoginPageComponent},
  {path:'signup', component:LoginPageComponent},
  {path:'thread/:id', component:ThreadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
