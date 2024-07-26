import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtVideoEmbedComponent } from './yt-video-embed.component';

describe('YtVideoEmbedComponent', () => {
  let component: YtVideoEmbedComponent;
  let fixture: ComponentFixture<YtVideoEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YtVideoEmbedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YtVideoEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
