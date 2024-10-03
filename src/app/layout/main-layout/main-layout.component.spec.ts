import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  const mockActivatedRoute = {
    params: of({}),
    snapshot: {
      paramMap: {
        get: () => null,
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the sidebar visible by default', () => {
    expect(component.isSidebarVisible).toBeTrue();
  });

  it('should toggle the sidebar visibility', () => {
    expect(component.isSidebarVisible).toBeTrue();

    component.toggleSidebar();
    expect(component.isSidebarVisible).toBeFalse();

    component.toggleSidebar();
    expect(component.isSidebarVisible).toBeTrue();
  });
});
