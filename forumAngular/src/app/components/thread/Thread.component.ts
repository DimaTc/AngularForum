import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'thread',
  templateUrl: './Thread.component.html',
  styleUrls: ['./Thread.component.scss']
})
export class ThreadComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  id : number;
  ngOnInit() {
    this.route.paramMap.subscribe((params)=>{
      this.id = +params.get('id');
      console.log(this.id);
    })
  }

}
