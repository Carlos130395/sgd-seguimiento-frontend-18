import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing'; // Importa el módulo de prueba del router

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        RouterTestingModule  // Provee las dependencias de enrutamiento necesarias
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
