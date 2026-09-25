import { Component } from '@angular/core';
import { UsuarioListaComponent } from './components/usuario-lista/usuario-lista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UsuarioListaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}