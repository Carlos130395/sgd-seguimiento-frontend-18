import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SeguimientoService } from '../../services/seguimiento/seguimiento.service';
import { MessageService } from 'primeng/api';
import pdfMake from 'pdfMake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { MESSAGES } from '../../../shared/constant/messages.constants';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputTextModule,
    FieldsetModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.scss',
})
export default class SeguimientoComponent {
  loading: boolean = false;
  searchForm!: FormGroup;
  isVisible = false;
  follows: any;
  codigoSeguimiento = '';
  dd: any;

  constructor(
    private fb: FormBuilder,
    private seguimientoService: SeguimientoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      expediente: [''],
    });
  }

  buscarSeguimiento(): void {
    const codigoSeguimiento = this.searchForm.get('expediente')?.value;
    if (!codigoSeguimiento) {
      this.isVisible = false;
      this.showErrorMessage('El código de seguimiento es requerido');
      return;
    }

    this.loading = true;

    this.seguimientoService.getFollows(codigoSeguimiento).subscribe({
      next: (data) => {
        this.follows = data || [];
        this.isVisible = this.follows && this.follows.length > 0;
        this.showSuccessOrWarningMessage();
        this.loading = false;
      },
      error: () => {
        this.isVisible = false;
        this.showErrorMessage(MESSAGES.ERROR.DATA_FETCH);
        this.loading = false;
      },
    });
  }

  limpiarBusqueda(): void {
    this.searchForm.reset({
      expediente: '',
    });
    this.isVisible = false;
  }

  private showErrorMessage(detail: string): void {
    this.messageService.add({
      severity: MESSAGES.ERROR.SEVERITY,
      summary: MESSAGES.ERROR.SUMMARY,
      detail,
      life: MESSAGES.LIFE,
    });
  }

  private showSuccessOrWarningMessage(): void {
    const { SEVERITY, SUMMARY, DETAIL } = this.isVisible
      ? MESSAGES.SUCCESS
      : MESSAGES.WARNING;

    this.messageService.add({
      severity: SEVERITY,
      summary: SUMMARY,
      detail: DETAIL,
      life: MESSAGES.LIFE,
    });
  }

  public exportPDF(): void {
    const codigoSeguimiento = this.searchForm.get('expediente')?.value;

    if (!codigoSeguimiento) {
      this.showErrorMessage(MESSAGES.ERROR.EMPTY_FIELD);
      return;
    }

    this.seguimientoService
      .getFollows(codigoSeguimiento)
      .subscribe((res: any) => {
        this.dd = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          content: [
            {
              columns: [
                { alignment: 'center', width: 100, text: '' },
                {
                  alignment: 'center',
                  width: '*',
                  text: 'SEGUIMIENTO DE DOCUMENTOS',
                  bold: true,
                },
                { alignment: 'center', width: 100, text: '' },
              ],
            },
            {
              text: `Número de expediente: ${codigoSeguimiento}`,
              alignment: 'justify',
              fontSize: 12,
              margin: [-2, 15, 0, 0],
            },
            {
              text: '\n',
            },
            {
              table: {
                widths: [
                  18, 40, 55, 40, 30, 60, 45, 40, 80, 60, 60, 60, 35, 40, 50,
                  50, 30,
                ],
                body: [
                  [
                    {
                      text: 'Año',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'N°. Emision',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'T. Documento',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'N° Documento',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'Sigla',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'O. Emisor',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'N. Emisor',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'F. Emisión',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'Asunto',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'O. Destino',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'P. destino',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'P. Recibido',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'Estado',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'F. Remisión',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'F. Derivación',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'F. Archivamiento',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                    {
                      text: 'Año Exp.',
                      alignment: 'center',
                      bold: true,
                      fontSize: 7,
                    },
                  ],
                  ...res.map((data: any) => [
                    { text: data?.anio, alignment: 'center', fontSize: 7 },
                    {
                      text: data?.numero_EMISION,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.tipo_DOCUMENTO,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.numero_DOC,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    { text: data?.sigla_DOC, alignment: 'center', fontSize: 7 },
                    {
                      text: data?.dep_EMISOR,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    { text: data?.emisor, alignment: 'center', fontSize: 7 },
                    {
                      text: moment(data?.fecha_EMISION).format('DD/MM/YYYY'),
                      alignment: 'center',
                      fontSize: 7,
                    },
                    { text: data?.asunto, alignment: 'center', fontSize: 7 },
                    {
                      text: data?.dep_DESTINO,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.persona_DESTINO,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.persona_RECIBIDO,
                      alignment: 'center',
                      fontSize: 7,
                    },
                    { text: data?.estado, alignment: 'center', fontSize: 7 },
                    {
                      text: moment(data?.fecha_RECEPCION).format('DD/MM/YYYY'),
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.fecha_EMISION
                        ? moment(data.fecha_EMISION).format('DD/MM/YYYY')
                        : '',
                      alignment: 'center',
                      fontSize: 7,
                    },
                    {
                      text: data?.fecha_ARCHIVAMIENTO
                        ? moment(data?.fecha_ARCHIVAMIENTO).format('DD/MM/YYYY')
                        : '',
                      alignment: 'center',
                      fontSize: 7,
                    },
                    { text: data?.anio_EXP, alignment: 'center', fontSize: 7 },
                  ]),
                ],
              },
            },
          ],
          pageMargins: [30, 40, 20, 30],
          footer: (currentPage: any, pageCount: any) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            fontSize: 8,
            margin: [0, 10, 0, 0],
          }),
        };
        const pdfDocGenerator = pdfMake.createPdf(this.dd);
        pdfDocGenerator.download('seguimiento.pdf');
        pdfDocGenerator.open();
        this.limpiarBusqueda();
      });
  }

  exportToExcel(): void {
    const data = this.follows || [];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const range: XLSX.Range = XLSX.utils.decode_range(worksheet['!ref'] || '');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellAddress]) {
          const cell = worksheet[cellAddress];
          cell.s = {
            font: { name: 'Arial', sz: 10 },
            alignment: { horizontal: 'center' },
            border: { thin: { style: 'thin', color: { rgb: '000000' } } },
          };
        }
      }
    }

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Seguimiento Data');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(dataBlob, 'seguimiento_data.xlsx');
  }

  exportarExcel(): void {
    const codigoSeguimiento = this.searchForm.get('expediente')?.value;

    if (!codigoSeguimiento) {
      this.showErrorMessage(MESSAGES.ERROR.EMPTY_FIELD);
      return;
    }

    this.seguimientoService
      .getFollows(codigoSeguimiento)
      .subscribe((res: any) => {
        this.follows = res;
        this.exportToExcel();
        this.limpiarBusqueda();
      });
  }
}
