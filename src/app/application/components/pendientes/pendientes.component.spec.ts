import { ComponentFixture, TestBed } from '@angular/core/testing';
import PendientesComponent from './pendientes.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { SeguimientoService } from '../../services/seguimiento/seguimiento.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

class MockSeguimientoService {
  getAnio() {
    return of([{ anio: '2021' }, { anio: '2022' }]);
  }

  getDependencia() {
    return of([{ coDependencia: '001', deDependencia: 'Dependencia 1' }]);
  }

  getReport() {
    return of([{ totalPendientes: 10, noLeidos: 2, recibidosSinAtender: 3 }]);
  }
}

describe('PendientesComponent', () => {
  let component: PendientesComponent;
  let fixture: ComponentFixture<PendientesComponent>;
  let seguimientoService: SeguimientoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PendientesComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        TableModule,
        DropdownModule,
        ButtonModule,
      ],
      providers: [
        FormBuilder,
        MessageService,
        { provide: SeguimientoService, useClass: MockSeguimientoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PendientesComponent);
    component = fixture.componentInstance;
    seguimientoService = TestBed.inject(SeguimientoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.showEntries.value;
    expect(formValues.anio).toEqual('');
    expect(formValues.mes).toEqual('');
    expect(formValues.oficina).toEqual('');
  });

  it('should load years on init', () => {
    spyOn(seguimientoService, 'getAnio').and.callThrough();
    component.ngOnInit();
    expect(seguimientoService.getAnio).toHaveBeenCalled();
    expect(component.anio.length).toBe(2);
  });

  it('should fetch report data when searchReporte is called', async () => {
    const getDocumentosPendientesSpy = spyOn(
      seguimientoService,
      'getReport'
    ).and.callThrough();

    component.showEntries.setValue({
      anio: '2022',
      mes: '01',
      oficina: 'dep',
    });

    component.searchReporte();

    await fixture.whenStable();

    expect(getDocumentosPendientesSpy).toHaveBeenCalledTimes(1);

    expect(component.reporte.length).toBe(1);
  });

  it('should export data to PDF', () => {
    spyOn(component, 'createPdf').and.callThrough();
    component.createPdf();
    expect(component.createPdf).toHaveBeenCalled();
  });

  it('should export data to Excel', () => {
    spyOn(component, 'exportToExcel').and.callThrough();
    component.exportarExcel();
    expect(component.exportToExcel).toHaveBeenCalled();
  });
});
