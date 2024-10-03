import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { SEGUIMIENTO_REPOSITORY_TOKEN } from './domain/ports/seguimiento-repository.token';
import { SeguimientoHttpRepositoryService } from './infrastructure/api/seguimiento/seguimiento-http-repository.service';
import { SeguimientoService } from './application/services/seguimiento/seguimiento.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessagesModule, MessageModule],
  templateUrl: './app.component.html',
  providers: [
    SeguimientoService,
    MessageService,
    { provide: SEGUIMIENTO_REPOSITORY_TOKEN, useClass: SeguimientoHttpRepositoryService },
  ],
  styleUrl: './app.component.scss',
})
export class AppComponent {

}
