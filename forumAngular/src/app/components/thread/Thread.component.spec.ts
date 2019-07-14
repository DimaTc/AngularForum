import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedThreadComponent } from './selected-thread.component';

describe('SelectedThreadComponent', () => {
  let component: SelectedThreadComponent;
  let fixture: ComponentFixture<SelectedThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
