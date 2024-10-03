// shared/constant/messages.constants.ts
export const MESSAGES = {
  ERROR: {
    SEVERITY: 'error',
    SUMMARY: 'Error',
    DATA_FETCH: 'Error al obtener los datos',
    EMPTY_FIELD: 'El código de seguimiento no puede estar vacío.',
  },
  SUCCESS: {
    SEVERITY: 'success',
    SUMMARY: 'Éxito',
    DETAIL: 'Datos cargados exitosamente',
  },
  WARNING: {
    SEVERITY: 'warn',
    SUMMARY: 'Advertencia',
    DETAIL: 'No se encontraron datos para el código proporcionado',
  },
  LIFE: 3000,
};
