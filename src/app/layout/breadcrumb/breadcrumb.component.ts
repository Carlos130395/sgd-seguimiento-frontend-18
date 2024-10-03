import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() title!: string;
  @Input() items!: any[];
  @Input() active_item!: string;

}
