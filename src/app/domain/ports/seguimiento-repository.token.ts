import { InjectionToken } from '@angular/core';
import { SeguimientoRepositoryPort } from './seguimiento-repository.port';

export const SEGUIMIENTO_REPOSITORY_TOKEN =
  new InjectionToken<SeguimientoRepositoryPort>('SeguimientoRepositoryPort');
