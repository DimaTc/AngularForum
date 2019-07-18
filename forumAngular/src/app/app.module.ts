import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from "./components/signup-form/signup-form.component";
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { ThreadsPageComponent } from "./components/threads-page/threads-page.component";
import { ThreadComponent } from "./components/thread/Thread.component";
import { CommentComponent } from "./components/comment/comment.component";

import { ThreadsService } from "./threads.service";
import { CommentsService } from "./comments.service";
import { UsersService } from "./users.service";
import { ThreadFormComponent } from './components/thread-form/thread-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignupFormComponent,
    LoginPageComponent,
    MainPageComponent,
    ThreadsPageComponent,
    ThreadComponent,
    CommentComponent,
    ThreadFormComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [ThreadsService, CommentsService, UsersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
