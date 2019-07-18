import { User } from "./../../models/User";
import { UsersService } from "./../../users.service";
import { Component, OnInit } from "@angular/core";
import { FormsModule, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: "signup-form",
  templateUrl: "./signup-form.component.html",
  styleUrls: ["./signup-form.component.scss"]
})
export class SignupFormComponent implements OnInit {
  usernameString: string;
  passwordString: string;
  emailString: string;
  signing: boolean;
  signError: string = "";

  log(input) {
    console.log(input);
  }

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit() {
    this.signError = "";
    this.signing = true;
    this.usersService
      .signup(this.usernameString, this.passwordString, this.emailString)
      .subscribe(
        res => {
          if (res["status"] === "error") this.signError = res["error"];
          else {
            if (res["status"] != "ok") {
              this.signError = "unknown error";
              console.log("Error, returned - " + res);
              return;
            }
            let authToken = res['authToken'];
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('username',this.usernameString)
            this.router.navigate([''])
          }
        },
        err => {
          console.log("err");
          console.log(err); //need to change it
        },
        () => {
          this.signing = false;
        }
      );
  }

  ngOnInit() {}
}
