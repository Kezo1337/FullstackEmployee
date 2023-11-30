import { Component, Inject, ViewChild } from '@angular/core';
import { Employee } from '../employee.interface';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent {
  @ViewChild('form') addEditForm!: NgForm;
  departments = ["IT" , "HR", "Ostalo"]
  employees: Employee[] = [];
  newEmployee: Employee = {
  userName: '',
  email: '',
  phone: NaN,
  salary: NaN,
  department:''
}
inputData!:any;
AddMode = true;
currentEmployee!:Employee;
error:any;

  constructor(private employeeService:EmployeeService,
    @Inject(MAT_DIALOG_DATA) public popUpData:any, 
    private _snackbar: MatSnackBar
    ){}

  ngOnInit():void {
    this.inputData = this.popUpData;
    if(this.inputData.id){
      this.AddMode = false
    this.employeeService.getEmployeeById(this.inputData.id).subscribe((res)=>{
      this.currentEmployee = res;
      this.addEditForm.controls['userName'].setValue(res.userName)
      this.addEditForm.controls['email'].setValue(res.email)
      this.addEditForm.controls['phone'].setValue(res.phone)
      this.addEditForm.controls['salary'].setValue(res.salary)
      this.addEditForm.controls['department'].setValue(res.department)
    })
    }
    this.getEmployees();
  }

  //Submitting form
  onSubmit(){
    if(this.AddMode)
      this.addEmployee()
    else
      this.editEmployee();
  }

  //Adding employee
  addEmployee(){
    this.employeeService.addEmployee(this.newEmployee).subscribe(()=>{
      this._snackbar.open("Employee has beed added", '' , {duration:3000})
    },(error:Error) =>{
      this.error = error.message;
      this._snackbar.open(`${this.error}`, '' , {duration:3000})
    })
  }

  //Editing employee
  editEmployee(){
    this.employeeService.editEmployee(this.inputData.id, this.newEmployee).subscribe(()=>{
      this._snackbar.open("Employee has been updated", '', {duration: 3000})
    },(error:Error) =>{
      this.error = error.message
      this._snackbar.open(`${this.error}`, '', {duration: 3000})
    });
  }

  //Getting employees
  getEmployees(){
    this.employeeService.getEmployee().subscribe((data:any)=> {
      this.employees = data;
    });
  }
}
