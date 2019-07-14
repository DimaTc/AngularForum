import { User } from './../../models/User';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit{
  currentUser: User;

  constructor(private router : Router) {
    this.currentUser = {username:"Dima",online:true,id:"3df312"}
  }

  ngOnInit(){
    if(this.currentUser === undefined)
      this.router.navigate(['login'])
  }
  

}
