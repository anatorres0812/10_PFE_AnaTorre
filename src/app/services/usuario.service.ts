import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  username: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/users';

  // GET
  obtenerUsuarios(): Observable<{ users: Usuario[] }> {
    return this.http.get<{ users: Usuario[] }>(
      `${this.apiUrl}?limit=20`
    );
  }

  // POST
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${this.apiUrl}/add`,
      usuario
    );
  }

  // PUT
  actualizarUsuario(
    id: number,
    usuario: Usuario
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.apiUrl}/${id}`,
      usuario
    );
  }

  // DELETE
  eliminarUsuario(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(
      `${this.apiUrl}/${id}`
    );
  }
}