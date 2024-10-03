import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SeguimientoHttpRepositoryService } from './seguimiento-http-repository.service';
import { environment } from '../../../../environments/environment';
import {
  Follows,
  IPaginadoReporte,
} from '../../../domain/models/seguimiento.model';

describe('SeguimientoHttpRepositoryService', () => {
  let service: SeguimientoHttpRepositoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SeguimientoHttpRepositoryService],
    });

    service = TestBed.inject(SeguimientoHttpRepositoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve follows by codigo', () => {
    const mockFollows: Follows[] = [
      {
        ANIO: '2022',
        NUMERO_EMISION: '12345',
        TIPO_DOCUMENTO: 'DNI',
        NUMERO_DOC: '987654321',
        SIGLA_DOC: 'SIG',
        DEP_EMISOR: 'Emisor Departamento',
        EMISOR: 'Juan Perez',
        FECHA_EMISION: new Date(),
        ASUNTO: 'Asunto importante',
        DEP_DESTINO: 'Destino Departamento',
        PERSONA_DESTINO: 'Pedro Lopez',
        PERSONA_RECIBIDO: 'Maria Garcia',
        ESTADO: 'En Proceso',
        FECHA_RECEPCION: new Date(),
        FECHA_DERIVACION: new Date(),
        FECHA_ARCHIVAMIENTO: new Date(),
        ANIO_EXP: '2022',
      },
    ];

    service.getSeguimientoFollows('12345').subscribe((follows) => {
      expect(follows.length).toBe(1);
      expect(follows).toEqual(mockFollows);
    });

    const req = httpMock.expectOne(
      `${environment.urlSeguimiento}/follows/12345`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFollows);
  });

  it('should retrieve report by params', () => {
    const mockReport = { report: 'mock report data' };
    const params: IPaginadoReporte = {
      anio: '2022',
      mes: '01',
      dependencia: 'dep',
    };

    service.getSeguimientoReport(params).subscribe((report) => {
      expect(report).toEqual(mockReport);
    });

    const req = httpMock.expectOne(
      `${environment.urlSeguimiento}/report?anio=2022&mes=01&dependencia=dep`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReport);
  });

  it('should retrieve documentos emitidos by params', () => {
    const mockDocumentos = { documentos: 'mock documentos data' };
    const params: IPaginadoReporte = {
      anio: '2022',
      mes: '01',
      dependencia: 'dep',
    };

    service.getDocumentosEmitidos(params).subscribe((documentos) => {
      expect(documentos).toEqual(mockDocumentos);
    });

    const req = httpMock.expectOne(
      `${environment.urlSeguimiento}/documentos-emitidos?anio=2022&mes=01&dependencia=dep`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockDocumentos);
  });

  it('should retrieve anio data', () => {
    const mockAnio = [{ anio: '2021' }, { anio: '2022' }];

    service.getSeguimientoAnio().subscribe((anio) => {
      expect(anio.length).toBe(2);
      expect(anio).toEqual(mockAnio);
    });

    const req = httpMock.expectOne(`${environment.urlSeguimiento}/anio`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnio);
  });

  it('should retrieve dependencia data', () => {
    const mockDependencia = [
      { dependencia: 'Dep 1' },
      { dependencia: 'Dep 2' },
    ];

    service.getSeguimientoDependencia().subscribe((dependencias) => {
      expect(dependencias.length).toBe(2);
      expect(dependencias).toEqual(mockDependencia);
    });

    const req = httpMock.expectOne(`${environment.urlSeguimiento}/dependencia`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDependencia);
  });
});
