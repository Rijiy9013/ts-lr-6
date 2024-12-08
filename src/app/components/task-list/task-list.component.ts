import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Filters {
  assignee: string;
  priority: string;
  type: string;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filters: Filters = {
    assignee: '',
    priority: '',
    type: '',
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      return (
        (!this.filters.assignee || task.assignee.includes(this.filters.assignee)) &&
        (!this.filters.priority || task.priority === this.filters.priority) &&
        (!this.filters.type || task.type === this.filters.type)
      );
    });
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(
        () => {
          this.tasks = this.tasks.filter((task) => String(task.id) !== id);
          this.applyFilters();
        },
        (error) => {
          console.error('Error deleting task:', error);
          alert('An error occurred while deleting the task.');
        }
      );
    }
  }

  convertIdToString(id: number | string): string {
    return String(id);
  }
}
