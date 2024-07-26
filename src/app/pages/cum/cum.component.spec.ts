import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumComponent } from './cum.component';

describe('CumComponent', () => {
  let component: CumComponent;
  let fixture: ComponentFixture<CumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
