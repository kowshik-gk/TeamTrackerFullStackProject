import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource,MatTable, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditTableComponent } from '../../common-mat-component/edit-table/edit-table.component';

import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-view-projects',
  standalone: true,
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css'],
  imports: [
    MatProgressSpinnerModule,
    EditTableComponent,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,MatTable
  ,CdkDropListGroup, CdkDropList, CdkDrag]
})
export class ViewProjectsComponent implements OnInit, AfterViewInit {
  // Columns to be displayed in the tables
  displayedProjectColumns: string[] = ['name', 'description', 'numberOfTasks', 'completedTasks', 'assignedTeamLeader', 'createdManager', 'dueDate','actions'];
  displayedCurrentProjectColumns: string[] = ['name', 'description', 'numberOfTasks', 'completedTasks', 'assignedTeamLeader', 'createdManager', 'dueDate','actions'];
  displayedWorkingEmployeeColumns: string[] = ['employeeName', 'taskName', 'projectName', 'dueDate', 'createdTL','actions'];
  displayedNonWorkingEmployeeColumns: string[] = ['employeeName', 'taskName', 'projectName', 'dueDate', 'createdTL','actions'];
  displayedWorkingTeamLeaderColumns: string[] = ['tlName', 'projectName', 'CreatedManager','actions'];
  displayedNonWorkingTeamLeaderColumns: string[] = ['tlName', 'projectName', 'CreatedManager','actions'];

  completedProjectsDataSource = new MatTableDataSource<Project>([]);
  currentProjectsDataSource = new MatTableDataSource<Project>([]);
  workingEmployeesDataSource = new MatTableDataSource<Employee>([]);
  nonWorkingEmployeesDataSource = new MatTableDataSource<Employee>([]);
  workingTeamLeadersDataSource=new MatTableDataSource<TeamLead>([]);
  nonWorkingTeamLeadersDataSource= new MatTableDataSource<TeamLead>([]);

  

  @ViewChild('completedProjectsPaginator') completedProjectsPaginator!: MatPaginator;
  @ViewChild('currentProjectsPaginator') currentProjectsPaginator!: MatPaginator;
  @ViewChild('workingEmployeesPaginator') workingEmployeesPaginator!: MatPaginator;
  @ViewChild('nonWorkingEmployeesPaginator') nonWorkingEmployeesPaginator!: MatPaginator;
  @ViewChild('workingTeamLeadersPaginator') workingTeamLeadersPaginator!: MatPaginator;
  @ViewChild('nonWorkingTeamLeadersPaginator') nonWorkingTeamLeadersPaginator!: MatPaginator;

  @ViewChild('completedProjectsSort') completedProjectsSort!: MatSort;
  @ViewChild('currentProjectsSort') currentProjectsSort!: MatSort;
  @ViewChild('workingEmployeesSort') workingEmployeesSort!: MatSort;
  @ViewChild('nonWorkingEmployeesSort') nonWorkingEmployeesSort!: MatSort;
  @ViewChild('workingTeamLeadersSort') workingTeamLeadersSort!: MatSort;
  @ViewChild('nonWorkingTeamLeadersSort') nonWorkingTeamLeadersSort!: MatSort;

  isLoading = true;

  constructor(private route: ActivatedRoute,private cdr: ChangeDetectorRef,private routeToNavigate: Router,private dialogBox: MatDialog) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const resolverData = data['data'];
      this.completedProjectsDataSource.data = resolverData.completedProjects;
      this.currentProjectsDataSource.data = resolverData.currentProjects;
      this.workingEmployeesDataSource.data = resolverData.workingEmployees;
      this.nonWorkingEmployeesDataSource.data = resolverData.nonWorkingEmployees;
      this.workingTeamLeadersDataSource.data = resolverData.workingTeamLeaders;
      this.nonWorkingTeamLeadersDataSource.data = resolverData.nonWorkingTeamLeaders;
      this.isLoading = false;
    });
  }
  // ngOnInit() {
  //   this.loadProjects();
  //   this.loadCurrentProjects();
  //   this.loadWorkingEmployees();
  //   this.loadNonWorkingEmployees();
  //   this.loadWorkingTeamLeaders();
  //   this.loadNonWorkingTeamLeaders();
  // }

  ngAfterViewInit() {
    // Set paginator and sort for each data source
    this.completedProjectsDataSource.paginator = this.completedProjectsPaginator;
    this.completedProjectsDataSource.sort = this.completedProjectsSort;

    this.currentProjectsDataSource.paginator = this.currentProjectsPaginator;
    this.currentProjectsDataSource.sort = this.currentProjectsSort;

    this.workingEmployeesDataSource.paginator = this.workingEmployeesPaginator;
    this.workingEmployeesDataSource.sort = this.workingEmployeesSort;

    this.nonWorkingEmployeesDataSource.paginator = this.nonWorkingEmployeesPaginator;
    this.nonWorkingEmployeesDataSource.sort = this.nonWorkingEmployeesSort;

    this.workingTeamLeadersDataSource.paginator = this.workingTeamLeadersPaginator;
    this.workingTeamLeadersDataSource.sort = this.workingTeamLeadersSort;

    this.nonWorkingTeamLeadersDataSource.paginator = this.nonWorkingTeamLeadersPaginator;
    this.nonWorkingTeamLeadersDataSource.sort = this.nonWorkingTeamLeadersSort;
  }

  @ViewChild('table', {static: true}) table!: MatTable<TeamLead>;


  //dataSource=this.workingTeamLeadersDataSource.data;


  // drop(event: CdkDragDrop<TeamLead[]>) {    // for Drag and Drop for Same table
  //   const previousIndex = this.workingTeamLeadersDataSource.data.findIndex((d) => d === event.item.data);
  //   const currentIndex = event.currentIndex;
  
  //   moveItemInArray(this.workingTeamLeadersDataSource.data, previousIndex, currentIndex);
  //   this.workingTeamLeadersDataSource._updateChangeSubscription(); // Notify changes to the data source
  // }

  onDrop(event: CdkDragDrop<TeamLead[]>, direction: string) {
    const { previousIndex, currentIndex, item } = event;
    let movedItem = item.data as TeamLead;
  
    if (direction === 'workingToNonWorking') {
      const workingData = this.workingTeamLeadersDataSource.data.slice();
      const nonWorkingData = this.nonWorkingTeamLeadersDataSource.data.slice();
      
      workingData.splice(previousIndex, 1);
      
      nonWorkingData.splice(currentIndex-1, 0, movedItem);
  
      // Update the data sources
      this.workingTeamLeadersDataSource.data = workingData;
      this.nonWorkingTeamLeadersDataSource.data = nonWorkingData;
  
    } else if (direction === 'nonWorkingToWorking') {
      
      const nonWorkingData = this.nonWorkingTeamLeadersDataSource.data.slice();
      const workingData = this.workingTeamLeadersDataSource.data.slice();
      
      
      nonWorkingData.splice(previousIndex, 1);
      
      workingData.splice(currentIndex-1, 0, movedItem);
  
      this.nonWorkingTeamLeadersDataSource.data = nonWorkingData;
      this.workingTeamLeadersDataSource.data = workingData;
    }
  
    // Notify Angular to detect changes
    this.cdr.detectChanges(); // Inject ChangeDetectorRef in the constructor
  }
  
  applyFilter(event: Event, table: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    switch (table) {
      case 'completedProjects':
        this.completedProjectsDataSource.filter = filterValue;
        break;
      case 'currentProjects':
        this.currentProjectsDataSource.filter = filterValue;
        break;
      case 'workingEmployees':
        this.workingEmployeesDataSource.filter = filterValue;
        break;
      case 'nonWorkingEmployees':
        this.nonWorkingEmployeesDataSource.filter = filterValue;
        break;
      case 'workingTeamLeaders':
        this.workingTeamLeadersDataSource.filter = filterValue;
        break;
      case 'nonWorkingTeamLeaders':
       this.nonWorkingTeamLeadersDataSource.filter = filterValue;
        break;
    }
  } 

  // viewEmployee(employeeName: string) {
  //   const url = `https://localhost:7031/api/ProjectView/GetEmployeeByUserName/${employeeName}`;
  //   window.open(url, '_blank');
  // }

  viewEmployee(employeeName: string) {
    this.routeToNavigate.navigate(['/employee-details', employeeName]);
  }

  editProject(index: number, project: Project) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...project, type: 'project' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: Project | undefined) => {
      if (result) {
        if (index >= 0 && index < this.completedProjectsDataSource.data.length) {
          this.completedProjectsDataSource.data[index] = result;
          this.completedProjectsDataSource._updateChangeSubscription();
        }
      }
    });
  }

  editCurrentProject(index: number, project: Project) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...project, type: 'project' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: Project | undefined) => {
      if (result) {
        if (index >= 0 && index < this.currentProjectsDataSource.data.length) {
          this.currentProjectsDataSource.data[index] = result;
          this.currentProjectsDataSource._updateChangeSubscription();
        }
      }
    });
  }
  
  
  editWorkingTeamLeader(index: number, teamLeader: TeamLead) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...teamLeader, type: 'teamLead' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: TeamLead | undefined) => {
      if (result) {
        if (index >= 0 && index < this.workingTeamLeadersDataSource.data.length) {
          this.workingTeamLeadersDataSource.data[index] = result;
          this.workingTeamLeadersDataSource._updateChangeSubscription();
        }
      }
    });
  }
  editNonWorkingTeamLeader(index: number, teamLeader: TeamLead) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...teamLeader, type: 'teamLead' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: TeamLead | undefined) => {
      if (result) {
        if (index >= 0 && index < this.nonWorkingTeamLeadersDataSource.data.length) {
          this.nonWorkingTeamLeadersDataSource.data[index] = result;
          this.nonWorkingTeamLeadersDataSource._updateChangeSubscription();
        }
      }
    });
  }
    
  
  editWorkingEmployee(index: number, employee: Employee) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...employee, type: 'employee' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: Employee | undefined) => {
      if (result) {
        if (index >= 0 && index < this.workingEmployeesDataSource.data.length) {
          this.workingEmployeesDataSource.data[index] = result;
          this.workingEmployeesDataSource._updateChangeSubscription();
        }
      }
    });
  }
  
  editNonWorkingEmployee(index: number, employee: Employee) {
    const dialogBox = this.dialogBox.open(EditTableComponent, {
      data: { ...employee, type: 'employee' },
      width: '70%',
      maxHeight: '50%',
      disableClose: true
    });
  
    dialogBox.afterClosed().subscribe((result: Employee | undefined) => {
      if (result) {
        if (index >= 0 && index < this.nonWorkingEmployeesDataSource.data.length) {
          this.nonWorkingEmployeesDataSource.data[index] = result;
          this.nonWorkingEmployeesDataSource._updateChangeSubscription();
        }
      }
    });
  }
  
  deleteProject(index: number) {
    if (index >= 0 && index < this.completedProjectsDataSource.data.length) {
      const project = this.completedProjectsDataSource.data[index];
      if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
        this.completedProjectsDataSource.data = this.completedProjectsDataSource.data.filter((_, i) => i !== index);
        this.currentProjectsDataSource.data = this.currentProjectsDataSource.data.filter((_, i) => i !== index);
      }
    }
  }

  deleteCurrentProject(index: number) {
    if (index >= 0 && index < this.currentProjectsDataSource.data.length) {
      const project = this.currentProjectsDataSource.data[index];
      if (confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
        this.currentProjectsDataSource.data = this.currentProjectsDataSource.data.filter((_, i) => i !== index);
      }
    }
  }
  
  
  deleteWorkingEmployee(index: number) {
    if (index >= 0 && index < this.workingEmployeesDataSource.data.length) {
      const employee = this.workingEmployeesDataSource.data[index];
      if (confirm(`Are you sure you want to delete the employee "${employee.employeeName}"?`)) {
        this.workingEmployeesDataSource.data = this.workingEmployeesDataSource.data.filter((_, i) => i !== index);
      }
    }
  }
  deleteNonWorkingEmployee(index: number) {
    if (index >= 0 && index < this.nonWorkingEmployeesDataSource.data.length) {
      const employee = this.nonWorkingEmployeesDataSource.data[index];
      if (confirm(`Are you sure you want to delete the employee "${employee.employeeName}"?`)) {
        this.nonWorkingEmployeesDataSource.data = this.nonWorkingEmployeesDataSource.data.filter((_, i) => i !== index);
      }
    }
  }
  deleteWorkingTeamLeader(index: number) {
    if (index >= 0 && index < this.workingTeamLeadersDataSource.data.length) {
      const teamLeader = this.workingTeamLeadersDataSource.data[index];
      if (confirm(`Are you sure you want to delete the team leader "${teamLeader.tlName}"?`)) {
        this.workingTeamLeadersDataSource.data = this.workingTeamLeadersDataSource.data.filter((_, i) => i !== index);
      }
    }
  }
  deleteNonWorkingTeamLeader(index: number) {
    if (index >= 0 && index < this.nonWorkingTeamLeadersDataSource.data.length) {
      const teamLeader = this.nonWorkingTeamLeadersDataSource.data[index];
      if (confirm(`Are you sure you want to delete the team leader "${teamLeader.tlName}"?`)) {
        this.nonWorkingTeamLeadersDataSource.data = this.nonWorkingTeamLeadersDataSource.data.filter((_, i) => i !== index);
      }
    }
  }
        
  
  
}


interface Project {
  name: string;
  description: string;
  numberOfTasks: number;
  completedTasks: number;
  assignedTeamLeader: string;
  createdManager: string;
  dueDate: Date;
}

interface Employee {
  employeeName: string;
  taskName: string;
  projectName: string;
  dueDate: Date;
  createdTL: string;
}

interface TeamLead{
  tlName: string,
  projectName: string,
  assignedManager: string

}