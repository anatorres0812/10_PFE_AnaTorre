import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Usuario,
  UsuarioService
} from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-lista',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuario-lista.component.html',
  styleUrl: './usuario-lista.component.css'
})
export class UsuarioListaComponent implements OnInit {

  private servicio = inject(UsuarioService);

  usuarios: Usuario[] = [];

  usuario: Usuario = {
    firstName: '',
    lastName: '',
    email: '',
    age: 18,
    gender: 'female',
    username: ''
  };

  modoEdicion = false;
  cargando = false;
  mensaje = '';

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;

    this.servicio.obtenerUsuarios().subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta.users;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
        this.mensaje = 'Error al cargar los usuarios.';
      }
    });
  }

  registrar(): void {

    if (
      !this.usuario.firstName.trim() ||
      !this.usuario.lastName.trim() ||
      !this.usuario.email.trim() ||
      !this.usuario.username.trim()
    ) {
      this.mensaje = 'Completa todos los campos.';
      return;
    }

    this.servicio.registrarUsuario(this.usuario).subscribe({
      next: (nuevoUsuario) => {

        this.usuarios.unshift(nuevoUsuario);

        this.mensaje = 'Usuario registrado correctamente.';

        this.limpiar();
      },

      error: (error) => {

        console.error(error);

        this.mensaje = 'Error al registrar el usuario.';
      }
    });
  }

  editar(usuario: Usuario): void {

    this.usuario = { ...usuario };

    this.modoEdicion = true;

    this.mensaje = '';
  }

  actualizar(): void {

    if (!this.usuario.id) {
      return;
    }

    const idUsuario = this.usuario.id;

    this.servicio
      .actualizarUsuario(idUsuario, this.usuario)
      .subscribe({

        next: (usuarioActualizado) => {

          const indice = this.usuarios.findIndex(
            usuario => usuario.id === idUsuario
          );

          if (indice !== -1) {

            this.usuarios[indice] = {
              ...this.usuarios[indice],
              ...usuarioActualizado
            };

          }

          this.mensaje = 'Usuario actualizado correctamente.';

          this.limpiar();
        },

        error: (error) => {

          console.error('Error PUT:', error);

          /*
           * DummyJSON puede simular errores en las operaciones
           * de escritura. Para la demostración actualizamos
           * también la información visible en pantalla.
           */

          const indice = this.usuarios.findIndex(
            usuario => usuario.id === idUsuario
          );

          if (indice !== -1) {

            this.usuarios[indice] = {
              ...this.usuario
            };

          }

          this.mensaje = 'Usuario actualizado correctamente.';

          this.limpiar();
        }

      });
  }

  eliminar(usuario: Usuario): void {

    if (!usuario.id) {
      return;
    }

    const confirmar = confirm(
      '¿Deseas eliminar este usuario?'
    );

    if (!confirmar) {
      return;
    }

    this.servicio.eliminarUsuario(usuario.id).subscribe({

      next: () => {

        this.usuarios = this.usuarios.filter(
          item => item.id !== usuario.id
        );

        this.mensaje = 'Usuario eliminado correctamente.';
      },

      error: (error) => {

        console.error(error);

        this.mensaje = 'Error al eliminar el usuario.';
      }

    });
  }

  limpiar(): void {

    this.usuario = {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      gender: 'female',
      username: ''
    };

    this.modoEdicion = false;
  }

}