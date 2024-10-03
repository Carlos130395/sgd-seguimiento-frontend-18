import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SEGUIMIENTO_REPOSITORY_TOKEN } from '../../../domain/ports/seguimiento-repository.token';
import { SeguimientoRepositoryPort } from '../../../domain/ports/seguimiento-repository.port';
import { SeguimientoService } from './seguimiento.service';
import {
  Follows,
  IPaginadoReporte,
} from '../../../domain/models/seguimiento.model';

const mockSeguimientoRepository: Partial<SeguimientoRepositoryPort> = {
  getSeguimientoFollows: (codigo: string) =>
    of([
      {
        ANIO: '2021',
        NUMERO_EMISION: '12345',
        TIPO_DOCUMENTO: 'DNI',
        NUMERO_DOC: '56789',
        SIGLA_DOC: 'SIG',
        DEP_EMISOR: 'Dep 1',
        EMISOR: 'John Doe',
        FECHA_EMISION: new Date(),
        ASUNTO: 'Asunto de prueba',
        DEP_DESTINO: 'Dep 2',
        PERSONA_DESTINO: 'Jane Doe',
        PERSONA_RECIBIDO: 'Jane Doe',
        ESTADO: 'Recibido',
        FECHA_RECEPCION: new Date(),
        FECHA_DERIVACION: new Date(),
        FECHA_ARCHIVAMIENTO: new Date(),
        ANIO_EXP: '2021',
      },
    ] as Follows[]),
  getSeguimientoReport: (params: IPaginadoReporte) =>
    of({ report: 'mock report' }),
  getDocumentosEmitidos: (params: IPaginadoReporte) =>
    of({ documentos: 'mock documentos' }),
  getSeguimientoAnio: () => of([{ anio: '2021' }, { anio: '2022' }]),
  getSeguimientoDependencia: () =>
    of([{ dependencia: 'Dep 1' }, { dependencia: 'Dep 2' }]),
};

describe('SeguimientoService', () => {
  let service: SeguimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeguimientoService,
        {
          provide: SEGUIMIENTO_REPOSITORY_TOKEN,
          useValue: mockSeguimientoRepository,
        },
      ],
    });

    service = TestBed.inject(SeguimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getFollows and return Follows data', () => {
    const codigo = '12345';
    service.getFollows(codigo).subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0].NUMERO_EMISION).toBe('12345');
      expect(data[0].TIPO_DOCUMENTO).toBe('DNI');
    });
  });

  it('should call getReport and return report data', () => {
    const params: IPaginadoReporte = {
      anio: '2021',
      mes: '01',
      dependencia: 'dep',
      first: 0,
      rows: 10,
    };
    service.getReport(params).subscribe((data) => {
      expect(data.report).toBe('mock report');
    });
  });

  it('should call getDocumentosEmitidos and return documentos data', () => {
    const params: IPaginadoReporte = {
      anio: '2021',
      mes: '01',
      dependencia: 'dep',
      first: 0,
      rows: 10,
    };
    service.getDocumentosEmitidos(params).subscribe((data) => {
      expect(data.documentos).toBe('mock documentos');
    });
  });

  it('should call getAnio and return years', () => {
    service.getAnio().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data[0].anio).toBe('2021');
    });
  });

  it('should call getDependencia and return dependencias', () => {
    service.getDependencia().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data[0].dependencia).toBe('Dep 1');
    });
  });
});
