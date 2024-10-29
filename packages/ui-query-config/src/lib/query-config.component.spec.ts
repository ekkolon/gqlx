import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GqlxQueryConfigComponent } from './query-config.component';

describe('GqlxQueryConfigComponent', () => {
  let component: GqlxQueryConfigComponent;
  let fixture: ComponentFixture<GqlxQueryConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GqlxQueryConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GqlxQueryConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
