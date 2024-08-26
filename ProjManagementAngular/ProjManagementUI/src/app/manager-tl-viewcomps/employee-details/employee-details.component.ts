import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataServiceForEmployeeService } from '../../services/data-service-for-employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeName: string | null = null;
  employeeDetailsObj: any = {};  // Changed to an object to match the service response

  constructor(
    private route: ActivatedRoute,
    private dataServiceForEmployee: DataServiceForEmployeeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeName = params.get('employeeName');
      if (this.employeeName) {
        this.dataServiceForEmployee.getEmployeeByUserName(this.employeeName).subscribe(
          data => {
            this.employeeDetailsObj = data;
            console.log(data);
          },
          error => console.error('Error fetching employee details:', error)
        );
      }
    });
  }
}
