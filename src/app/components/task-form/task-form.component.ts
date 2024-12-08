import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule],
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: Task = {
    type: 'task',
    priority: 'medium',
    status: '',
    title: '',
    description: '',
    assignee: '',
    creator: '',
    createdAt: '',
    updatedAt: '',
  };
  isEditMode = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.taskService.getTaskById(idParam).subscribe(
        (task) => {
          this.task = task;
          this.isEditMode = true;
        },
        (error) => {
          alert('Task not found');
          this.router.navigate(['/tasks']);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.task.updatedAt = new Date().toISOString();
      this.taskService.updateTask(this.task).subscribe(
        () => {
          this.router.navigate(['/tasks']);
        },
        (error) => {
          console.error('Error updating task:', error);
          alert('An error occurred while updating the task.');
        }
      );
    } else {
      this.task.createdAt = new Date().toISOString();
      this.task.updatedAt = new Date().toISOString();
  
      const { id, ...newTask } = this.task;
  
      this.taskService.addTask(newTask).subscribe(
        () => {
          this.router.navigate(['/tasks']);
        },
        (error) => {
          console.error('Error creating task:', error);
          alert('An error occurred while creating the task.');
        }
      );
    }
  }
  
  
}
