import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GqlxSidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: GqlxSidebarComponent;
  let fixture: ComponentFixture<GqlxSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GqlxSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GqlxSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
