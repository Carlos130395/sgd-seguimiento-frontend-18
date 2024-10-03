import { ComponentFixture, TestBed } from '@angular/core/testing';
import SeguimientoComponent from './seguimiento.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SeguimientoService } from '../../services/seguimiento/seguimiento.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Mock del servicio SeguimientoService
class MockSeguimientoService {
  getFollows(codigo: string) {
    return of([{ anio: '2022', numero_DOC: '12345' }]); // Datos simulados
  }
}

describe('SeguimientoComponent', () => {
  let component: SeguimientoComponent;
  let fixture: ComponentFixture<SeguimientoComponent>;
  let seguimientoService: SeguimientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeguimientoComponent,
        ReactiveFormsModule,
        CommonModule,
        CardModule,
        ButtonModule,
        InputGroupModule,
        InputTextModule,
        FieldsetModule,
        ProgressSpinnerModule,
      ],
      providers: [
        FormBuilder,
        { provide: SeguimientoService, useClass: MockSeguimientoService }, // Mock del servicio
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguimientoComponent);
    component = fixture.componentInstance;
    seguimientoService = TestBed.inject(SeguimientoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component init', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('expediente')?.value).toEqual('');
  });

  it('should call getFollows when buscarSeguimiento is called', () => {
    spyOn(seguimientoService, 'getFollows').and.callThrough();

    // Simula la entrada en el formulario
    component.searchForm.patchValue({ expediente: 'EXP123' });

    // Llama a buscarSeguimiento
    component.buscarSeguimiento();

    expect(seguimientoService.getFollows).toHaveBeenCalledWith('EXP123');
    expect(component.follows.length).toBe(1); // Basado en el mock
  });

  it('should show an error message when codigoSeguimiento is empty', () => {
    const messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'add');

    // Simula que el campo 'expediente' está vacío
    component.searchForm.patchValue({ expediente: '' });

    // Llama a buscarSeguimiento
    component.buscarSeguimiento();

    // Verifica que la visibilidad es falsa
    expect(component.isVisible).toBe(false);

    // Verifica que el mensaje de error fue agregado a messageService
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'El código de seguimiento es requerido',
      life: 3000,
    });
  });


  it('should reset form and visibility when limpiarBusqueda is called', () => {
    component.limpiarBusqueda();
    expect(component.searchForm.get('expediente')?.value).toEqual('');
    expect(component.isVisible).toBe(false);
  });

  it('should export data to PDF when exportPDF is called', () => {
    spyOn(seguimientoService, 'getFollows').and.callThrough();
    spyOn(component, 'exportPDF').and.callThrough();

    // Simula la entrada en el formulario
    component.searchForm.patchValue({ expediente: 'EXP123' });

    // Llama a exportPDF
    component.exportPDF();

    expect(seguimientoService.getFollows).toHaveBeenCalled();
    expect(component.exportPDF).toHaveBeenCalled();
  });

  it('should export data to Excel when exportarExcel is called', () => {
    spyOn(component, 'exportToExcel').and.callThrough();

    // Simula la entrada en el formulario
    component.searchForm.patchValue({ expediente: 'EXP123' });

    // Llama a exportarExcel
    component.exportarExcel();

    expect(component.exportToExcel).toHaveBeenCalled();
  });
});
