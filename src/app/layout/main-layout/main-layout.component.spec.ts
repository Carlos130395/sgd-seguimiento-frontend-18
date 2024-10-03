import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  // Creamos un mock de ActivatedRoute
  const mockActivatedRoute = {
    params: of({}),
    snapshot: {
      paramMap: {
        get: () => null,
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute } // Añadimos el mock de ActivatedRoute
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the sidebar visible by default', () => {
    expect(component.isSidebarVisible).toBeTrue(); // Por defecto, el sidebar debe estar visible
  });

  it('should toggle the sidebar visibility', () => {
    // Sidebar visible inicialmente
    expect(component.isSidebarVisible).toBeTrue();

    // Ejecuta el método para ocultar el sidebar
    component.toggleSidebar();
    expect(component.isSidebarVisible).toBeFalse(); // El sidebar debería estar oculto

    // Ejecuta el método nuevamente para mostrar el sidebar
    component.toggleSidebar();
    expect(component.isSidebarVisible).toBeTrue(); // El sidebar debería estar visible nuevamente
  });
});
