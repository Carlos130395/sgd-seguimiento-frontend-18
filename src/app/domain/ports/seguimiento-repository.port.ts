import { Observable } from 'rxjs';
import { Follows, IPaginadoReporte } from '../models/seguimiento.model';

export interface SeguimientoRepositoryPort {
  getSeguimientoFollows(codigo: string): Observable<Follows[]>;
  getSeguimientoReport(params: IPaginadoReporte): Observable<any>;
  getDocumentosEmitidos(params: IPaginadoReporte): Observable<any>;
  getSeguimientoAnio(): Observable<any>;
  getSeguimientoDependencia(): Observable<any>;
}
