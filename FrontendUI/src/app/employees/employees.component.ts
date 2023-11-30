import { Component, ViewChild } from '@angular/core';
import { Employee } from '../employee.interface';
import { EmployeeService } from '../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  employees: Employee[] = [];
  error = null;
  displayedColumns: string[] = ['userName', 'email', 'phone', 'salary', 'department', 'Edit'];
  dataSource!: MatTableDataSource<Employee>;
  subscription!: Subscription;

  constructor(private employeeService: EmployeeService, 
    private dialog:MatDialog,
    private _snackbar: MatSnackBar,
    ){}

  ngOnInit(): void{
  this.getEmployee();
  this.subscription = this.employeeService.refresh$.subscribe(()=>{
  this.getEmployee();
});
  }

  getEmployee(){
    this.employeeService.getEmployee().subscribe((res:any) =>{
      this.employees = res;
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },(error:any) =>{
      this.error = error.message
    }
    )
  }

  deleteEmployee(id:number){
    this.employeeService.deleteEmployee(id).subscribe(()=>{
      this.getEmployee();
      this._snackbar.open("Employee has been deleted!", '', {duration: 3000})
    },(error:any) =>{
      this.error = error.message
    })
  }

  editEmployee(id: number){
    this.openPopup(id)
    console.log(id)
  }

  addEmployee(){
    this.openPopup(0);
  }

  openPopup(id:number){
    this.dialog.open(AddEditComponent, {
      data:{
        id:id
      }
    })
  }
  
  //Input Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
}
