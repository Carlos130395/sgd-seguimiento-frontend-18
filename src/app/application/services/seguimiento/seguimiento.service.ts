import { Inject, Injectable } from '@angular/core';
import { SEGUIMIENTO_REPOSITORY_TOKEN } from '../../../domain/ports/seguimiento-repository.token';
import { SeguimientoRepositoryPort } from '../../../domain/ports/seguimiento-repository.port';
import { Observable } from 'rxjs';
import {
  Follows,
  IPaginadoReporte,
} from '../../../domain/models/seguimiento.model';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoService {
  constructor(
    @Inject(SEGUIMIENTO_REPOSITORY_TOKEN)
    private seguimientoRepository: SeguimientoRepositoryPort
  ) {}

  getFollows(codigo: string): Observable<Follows[]> {
    return this.seguimientoRepository.getSeguimientoFollows(codigo);
  }

  getReport(params: IPaginadoReporte): Observable<any> {
    return this.seguimientoRepository.getSeguimientoReport(params);
  }

  getDocumentosEmitidos(params: IPaginadoReporte): Observable<any> {
    return this.seguimientoRepository.getDocumentosEmitidos(params);
  }

  getAnio(): Observable<any> {
    return this.seguimientoRepository.getSeguimientoAnio();
  }

  getDependencia(): Observable<any> {
    return this.seguimientoRepository.getSeguimientoDependencia();
  }
}
