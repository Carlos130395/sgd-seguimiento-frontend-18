import { Injectable } from '@angular/core';
import { SeguimientoRepositoryPort } from '../../../domain/ports/seguimiento-repository.port';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Follows,
  IPaginadoReporte,
} from '../../../domain/models/seguimiento.model';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../../../shared/constant/error-messages.constants';

@Injectable({
  providedIn: 'root',
})
export class SeguimientoHttpRepositoryService
  implements SeguimientoRepositoryPort
{
  private readonly baseUrl: string = environment.urlSeguimiento;
  private readonly retryCount: number = 2;

  constructor(private _httpClient: HttpClient) {}

  getSeguimientoFollows(codigo: string): Observable<Follows[]> {
    const url = `${this.baseUrl}/follows/${codigo}`;
    return this._httpClient
      .get<Follows[]>(url)
      .pipe(retry(this.retryCount), catchError(this.handleError));
  }

  getSeguimientoReport(params: IPaginadoReporte): Observable<any> {
    return this._httpClient
      .get(
        `${this.baseUrl}/report?anio=${params.anio}&mes=${params.mes}&dependencia=${params.dependencia}`
      )
      .pipe(catchError(this.handleError));
  }

  getDocumentosEmitidos(params: IPaginadoReporte): Observable<any> {
    return this._httpClient
      .get(
        `${this.baseUrl}/documentos-emitidos?anio=${params.anio}&mes=${params.mes}&dependencia=${params.dependencia}`
      )
      .pipe(catchError(this.handleError));
  }

  getSeguimientoAnio(): Observable<any> {
    return this._httpClient
      .get(`${this.baseUrl}/anio`)
      .pipe(catchError(this.handleError));
  }

  getSeguimientoDependencia(): Observable<any> {
    return this._httpClient
      .get(`${this.baseUrl}/dependencia`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(ERROR_MESSAGES.GENERAL_ERROR));
  }
}
