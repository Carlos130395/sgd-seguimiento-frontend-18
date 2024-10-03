import { ComponentFixture, TestBed } from '@angular/core/testing';
import EmitidosComponent from './emitidos.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { SeguimientoService } from '../../services/seguimiento/seguimiento.service';
import { MessageService } from 'primeng/api';

class MockSeguimientoService {
  getAnio() {
    return of([{ anio: '2021' }, { anio: '2022' }]);
  }

  getDependencia() {
    return of([{ coDependencia: '001', deDependencia: 'Dependencia 1' }]);
  }

  getDocumentosEmitidos() {
    return of([{ emitidos: 10, depEmisor: 'Emisor 1', depSiglas: 'E1' }]);
  }
}

describe('EmitidosComponent', () => {
  let component: EmitidosComponent;
  let fixture: ComponentFixture<EmitidosComponent>;
  let seguimientoService: SeguimientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmitidosComponent],
      providers: [
        FormBuilder,
        { provide: SeguimientoService, useClass: MockSeguimientoService },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmitidosComponent);
    component = fixture.componentInstance;
    seguimientoService = TestBed.inject(SeguimientoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    const currentYear = new Date().getFullYear();
    expect(component.showEntriesEmitidos.value.anio).toEqual(currentYear);
    expect(component.showEntriesEmitidos.value.mes).toEqual('');
    expect(component.showEntriesEmitidos.value.oficina).toEqual('');
  });

  it('should load years on init', () => {
    spyOn(seguimientoService, 'getAnio').and.callThrough();
    component.ngOnInit(); // Esto debería llamar a loadYears internamente
    expect(seguimientoService.getAnio).toHaveBeenCalled();
    expect(component.anio.length).toBe(2); // Basado en el mock
  });

  it('should fetch emitidos data when searchEmitidos is called', async () => {
    const getDocumentosEmitidosSpy = spyOn(
      seguimientoService,
      'getDocumentosEmitidos'
    ).and.callThrough();

    component.showEntriesEmitidos.setValue({
      anio: '2022',
      mes: '01',
      oficina: 'dep',
    });

    component.searchEmitidos();

    await fixture.whenStable();

    expect(getDocumentosEmitidosSpy).toHaveBeenCalledTimes(1);

    expect(component.emitidos.length).toBe(1);
  });

  it('should export data to PDF', () => {
    spyOn(seguimientoService, 'getDocumentosEmitidos').and.callThrough();
    spyOn(component, 'createPDF').and.callThrough();

    component.createPDF();
    expect(seguimientoService.getDocumentosEmitidos).toHaveBeenCalled();
    expect(component.createPDF).toHaveBeenCalled();
  });

  it('should export data to Excel', () => {
    spyOn(component, 'exportToExcel').and.callThrough();
    component.exportarExcel();
    expect(component.exportToExcel).toHaveBeenCalled();
  });
});
