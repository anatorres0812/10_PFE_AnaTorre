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

      next: (respuesta: { users: Usuario[] }) => {

        this.usuarios = respuesta.users;

        this.cargando = false;
      },

      error: (error: unknown) => {

        console.error(error);

        this.cargando = false;

        this.mensaje =
          'Error al cargar los usuarios.';
      }

    });
  }

  registrar(): void {

    if (
      !this.usuario.firstName ||
      !this.usuario.lastName ||
      !this.usuario.email ||
      !this.usuario.username
    ) {

      this.mensaje =
        'Completa todos los campos.';

      return;
    }

    this.servicio
      .registrarUsuario(this.usuario)
      .subscribe({

        next: (nuevoUsuario: Usuario) => {

          this.usuarios.unshift(nuevoUsuario);

          this.mensaje =
            'Usuario registrado correctamente.';

          this.limpiar();
        },

        error: (error: unknown) => {

          console.error(error);

          this.mensaje =
            'Error al registrar el usuario.';
        }

      });
  }

  editar(usuario: Usuario): void {

    this.usuario = {
      ...usuario
    };

    this.modoEdicion = true;
  }

  actualizar(): void {

    if (!this.usuario.id) {
      return;
    }

    this.servicio
      .actualizarUsuario(
        this.usuario.id,
        this.usuario
      )
      .subscribe({

        next: (actualizado: Usuario) => {

          const indice =
            this.usuarios.findIndex(
              (u: Usuario) =>
                u.id === actualizado.id
            );

          if (indice !== -1) {

            this.usuarios[indice] =
              actualizado;
          }

          this.mensaje =
            'Usuario actualizado correctamente.';

          this.limpiar();
        },

        error: (error: unknown) => {

          console.error(error);

          this.mensaje =
            'Error al actualizar el usuario.';
        }

      });
  }

  eliminar(usuario: Usuario): void {

    if (!usuario.id) {
      return;
    }

    const confirmar =
      confirm(
        '¿Deseas eliminar este usuario?'
      );

    if (!confirmar) {
      return;
    }

    this.servicio
      .eliminarUsuario(usuario.id)
      .subscribe({

        next: () => {

          this.usuarios =
            this.usuarios.filter(
              (u: Usuario) =>
                u.id !== usuario.id
            );

          this.mensaje =
            'Usuario eliminado correctamente.';
        },

        error: (error: unknown) => {

          console.error(error);

          this.mensaje =
            'Error al eliminar el usuario.';
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