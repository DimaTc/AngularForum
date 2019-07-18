import { Router } from '@angular/router';
import { User } from './../../models/User';
import { UsersService } from "./../../users.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  username: string = "";
  password: string = "";
  loggingIn: boolean = false;
  loginError: string = "";
  constructor(private userService: UsersService, private router : Router) {}

  ngOnInit() {}

  onSubmit() {
    this.loggingIn = true;
    this.userService.login(this.username, this.password).subscribe(
      res => {
        if (res["status"] != "ok") {
          if (res["error"] != undefined) this.loginError = res["error"];
          else this.loginError = "unknown error";
          return;
        }
        let token = res['authToken'];
        localStorage.setItem('authToken', token);
        let user: User ={
          username: res['username'],
          id: res['id'],
          online:true
        }
        this.userService.setLoggedInUser(user)
        this.router.navigate(['']);

      },
      err => {
        console.log(err);
      },
      () => {
        this.loggingIn = false;

      }
    );
  }
}
