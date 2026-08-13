import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";

import { environment as env } from "../../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  USERS_API_BASE_URL = env.usersApiBaseUrl;

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<User[]> {
    return this.http
      .get<{ users: User[] }>(`${this.USERS_API_BASE_URL}/users`)
      .pipe(
        map(response => response.users)
      );
  }

  getById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.USERS_API_BASE_URL}/users/${id}`);
  }

  add(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.USERS_API_BASE_URL}/users/add`, user)
  }

  update(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.USERS_API_BASE_URL}/users/${user.id}`, user)
  }

  delete(id: number): Observable<User> {
    return this.http
      .delete<User>(`${this.USERS_API_BASE_URL}/users/${id}`)
  }
}
