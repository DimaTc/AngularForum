import { Component, OnInit } from '@angular/core';
import {FormsModule, FormGroup} from '@angular/forms'

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  test:string;
  log(input){
    console.log(input);
  }

  checkPassword(group: FormGroup){
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : {notSame:true}
  }

  constructor() { }

  ngOnInit() {
  }

}
