import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
    }).compileComponents();                // Loads the component's template
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance; // Gets component from fixture
    fixture.detectChanges();               // Adds change detection on component
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
