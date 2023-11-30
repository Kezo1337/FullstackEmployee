import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {tap} from 'rxjs/operators'
import { Employee } from '../employee.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url ='https://localhost:7130/Employee/'
  
  private _refresh$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) { }

  get refresh$(){
    return this._refresh$
  }

  getEmployee():Observable<Employee>{
    return this.http.get<Employee>(this.url);
  }

  getEmployeeById(id:number):Observable<Employee>{
    return this.http.get<Employee>(this.url + id)
  }

  addEmployee(employee: Employee):Observable<Employee>{
    return this.http.post<Employee>(this.url, employee)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  editEmployee(id:number, employee: Employee):Observable<Employee>{
    return this.http.put<Employee>(this.url + id, employee)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  deleteEmployee(id:number):Observable<Employee>{
    return this.http.delete<Employee>(this.url + id)
  }
}
