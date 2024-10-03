import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreadcrumbComponent } from '../../../layout/breadcrumb/breadcrumb.component';
import { CardModule } from 'primeng/card';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SeguimientoService } from '../../services/seguimiento/seguimiento.service';
import { IPaginadoReporte } from '../../../domain/models/seguimiento.model';

import pdfMake from 'pdfMake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-emitidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    CardModule,
    TableModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './emitidos.component.html',
  styleUrl: './emitidos.component.scss',
})
export default class EmitidosComponent {
  showEntriesEmitidos!: FormGroup;
  anio: Array<{ label: string; value: any }> = [];
  selectedYear!: string;
  months: Array<{ name: string }> = [];
  dependencia: Array<{ idDependencia: string; deDependencia: string }> = [];
  selectedDependenciaId: string = '';

  totalDocumentosEmitidos = 0;
  totalRecords = 0;

  dd: any;

  emitidos: any = [];
  isLoading = false;
  selectedDependency: string = '';

  private readonly allMonths = [
    { id: '01', name: 'ENERO' },
    { id: '02', name: 'FEBRERO' },
    { id: '03', name: 'MARZO' },
    { id: '04', name: 'ABRIL' },
    { id: '05', name: 'MAYO' },
    { id: '06', name: 'JUNIO' },
    { id: '07', name: 'JULIO' },
    { id: '08', name: 'AGOSTO' },
    { id: '09', name: 'SETIEMBRE' },
    { id: '10', name: 'OCTUBRE' },
    { id: '11', name: 'NOVIEMBRE' },
    { id: '12', name: 'DICIEMBRE' },
  ];

  constructor(
    private fb: FormBuilder,
    private seguimientoService: SeguimientoService
  ) {
    this.initializeForm();
    this.searchEmitidos();
  }

  ngOnInit() {
    this.paginateEmitidos();
    this.loadYears();
    this.listDependencia();
  }

  private initializeForm() {
    const currentYear = new Date().getFullYear();

    this.showEntriesEmitidos = this.fb.group({
      anio: [currentYear],
      mes: [''],
      oficina: [''],
    });
  }

  private loadYears() {
    this.seguimientoService.getAnio().subscribe((res: any) => {
      this.anio = res.map((year: any) => ({
        label: year.anio,
        value: year,
      }));
    });
  }

  onTypeSystemSelectionChange(event: any): void {
    this.selectedYear = event.value.anio;
    this.updateMonthsForSelectedYear(this.selectedYear);

    this.showEntriesEmitidos.get('mes')?.enable();
  }

  private updateMonthsForSelectedYear(year: string): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    this.months =
      parseInt(year) === currentYear
        ? this.allMonths.slice(0, currentMonth + 1)
        : [...this.allMonths];
  }

  public listDependencia(): void {
    this.seguimientoService
      .getDependencia()
      .subscribe((res: any) => {
        this.dependencia = res.map((item: any) => ({
          coDependencia: item.coDependencia,
          deDependencia: item.deDependencia,
        }));
      });
  }

  onDependenciaSelectionChange(event: any): void {
    this.selectedDependenciaId = event.value;
  }

  searchEmitidos(): void {
    this.showEntriesEmitidos.valueChanges.subscribe((data: any) => {
      const params: IPaginadoReporte = {
        anio: this.selectedYear,
        mes: data.mes,
        dependencia: data.oficina,
      };

      this.fetchReportData(params);
    });
  }

  loadReporte(event: TableLazyLoadEvent): void {
    const rowsPerPage = event.rows ?? 10;

    const params: IPaginadoReporte = {
      anio: this.showEntriesEmitidos.value.anio || new Date().getFullYear(),
      mes: this.showEntriesEmitidos.value.mes,
      dependencia: this.showEntriesEmitidos.value.oficina,
      first: event.first || 0,
      rows: rowsPerPage,
    };

    this.fetchReportData(params);
  }

  fetchReportData(params: IPaginadoReporte): void {
    this.isLoading = true;
    this.seguimientoService.getDocumentosEmitidos(params).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.emitidos = res || [];
          this.totalRecords = res.totalRecords || 0;
          this.calculateTotals(this.emitidos);
          this.isLoading = false;
        }, 0);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private calculateTotals(reporte: any[]) {
    if (Array.isArray(reporte)) {
      this.totalDocumentosEmitidos = 0;

      reporte.forEach((data: any) => {
        this.totalDocumentosEmitidos += data.emitidos || 0;
      });
    }
  }

  paginateEmitidos() {
    const anioActual =
      this.showEntriesEmitidos.value.anio || new Date().getFullYear();

    const params: IPaginadoReporte = {
      anio: anioActual,
      mes: this.showEntriesEmitidos.value.mes,
      dependencia: this.showEntriesEmitidos.value.oficina,
    };

    this.fetchReportData(params);
  }

  createPDF(): void {
    const params: IPaginadoReporte = {
      anio:
        this.showEntriesEmitidos.value.anio.anio ||
        this.showEntriesEmitidos.value.anio,
      mes: this.showEntriesEmitidos.value.mes,
      dependencia: this.showEntriesEmitidos.value.oficina,
    };

    this.seguimientoService
      .getDocumentosEmitidos(params)
      .subscribe((res: any) => {
        let totalEmitidos = 0;
        res.forEach((data: any) => {
          const valorEmitidos = parseFloat(data?.emitidos) || 0;
          totalEmitidos += valorEmitidos;
        });

        this.dd = {
          pageOrientation: 'landscape',
          content: [
            {
              columns: [
                {
                  alignment: 'center',
                  width: 100,
                  text: '',
                },
                this.selectedYear &&
                this.showEntriesEmitidos.controls['mes'].value
                  ? {
                      alignment: 'center',
                      width: '*',
                      text: `Reporte de Documentos Emitidos de Atención INDECI - ${this.showEntriesEmitidos.controls['mes'].value}/${this.selectedYear}`,
                      bold: true,
                    }
                  : this.selectedYear
                  ? {
                      alignment: 'center',
                      width: '*',
                      text: `Reporte de Documentos Emitidos de Atención INDECI - ${this.selectedYear}`,
                      bold: true,
                    }
                  : {
                      alignment: 'center',
                      width: '*',
                      text: 'Reporte de Documentos Emitidos de Atención INDECI',
                      bold: true,
                    },
                {
                  alignment: 'center',
                  width: 100,
                  text: '',
                },
              ],
            },
            {
              text: '\n',
            },
            {
              table: {
                widths: [15, 430, 200, 100],
                body: [
                  [
                    {
                      text: 'Nº',
                      alignment: 'center',
                      bold: true,
                      fillColor: '#fce4d6',
                      fontSize: 10,
                    },
                    {
                      text: 'DEPENDENCIA EMISOR',
                      alignment: 'center',
                      bold: true,
                      fillColor: '#fce4d6',
                      fontSize: 10,
                    },
                    {
                      text: 'DEPENDENCIA SIGLAS',
                      alignment: 'center',
                      bold: true,
                      fillColor: '#fce4d6',
                      fontSize: 10,
                    },
                    {
                      text: 'DOCUMENTOS EMITIDOS',
                      alignment: 'center',
                      bold: true,
                      fillColor: '#fce4d6',
                      fontSize: 10,
                    },
                  ],
                  ...res.map((data: any, index: any) => [
                    { text: index + 1, alignment: 'center', fontSize: 10 },
                    {
                      text: data?.depEmisor,
                      alignment: 'center',
                      fontSize: 10,
                    },
                    {
                      text: data?.depSiglas,
                      alignment: 'center',
                      fontSize: 10,
                    },
                    {
                      text: data?.emitidos,
                      alignment: 'center',
                      fontSize: 10,
                    },
                  ]),
                ],
              },
            },
            {
              table: {
                widths: [15, 430, 200, 100],
                body: [
                  [
                    {
                      text: '',
                      alignment: 'center',
                      fontSize: 10,
                    },
                    {
                      text: '',
                      alignment: 'center',
                      fontSize: 10,
                    },
                    {
                      text: 'TOTAL',
                      alignment: 'center',
                      fontSize: 10,
                      bold: true,
                    },
                    {
                      text: totalEmitidos,
                      alignment: 'center',
                      fontSize: 10,
                    },
                  ],
                ],
              },
            },
          ],
          pageMargins: [30, 40, 20, 30],
          footer: (currentPage: any, pageCount: any) => {
            return {
              text: `Página ${currentPage.toString()} de ${pageCount.toString()}`,
              alignment: 'center',
              fontSize: 8,
              margin: [0, 10, 0, 0],
            };
          },
        };
        const pdfDocGenerator = pdfMake.createPdf(this.dd);
        pdfDocGenerator.download('documentos-emitidos.pdf');
        pdfDocGenerator.open();
        this.limpiarBusqueda();
      });
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.emitidos);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'documentos_emitidos.xlsx');
  }

  exportarExcel() {
    const params: IPaginadoReporte = {
      anio:
        this.showEntriesEmitidos.value.anio.anio ||
        this.showEntriesEmitidos.value.anio,
      mes: this.showEntriesEmitidos.value.mes,
      dependencia: this.showEntriesEmitidos.value.oficina,
    };
    this.seguimientoService
      .getDocumentosEmitidos(params)
      .subscribe((res: any) => {
        this.emitidos = res;
        this.exportToExcel();
      });
  }

  limpiarBusqueda(): void {
    const currentYear = new Date().getFullYear();

    this.showEntriesEmitidos.reset({
      anio: currentYear,
      mes: '',
      oficina: '',
    });

    this.paginateEmitidos();
  }
}
