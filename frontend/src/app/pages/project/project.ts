
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Project } from '../../models/models';
import { ProjectService } from '../../core/project.service';
import { HeaderComponent } from '../../components/header/header';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HeaderComponent, RouterLink, FormsModule],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class ProjectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private location = inject(Location);
  private auth = inject(AuthService);

  project: Project | null = null;
  loading = true;
  error = '';
  message = '';
  showTaskForm = false;

  newTask = {
    title: '',
    description: '',
    status: 'Pending',
    assignedTo: ''
  };

  get currentUserId(): string | null {
    return this.auth.getCurrentUser()?.id ?? null;
  }

  get isOwner(): boolean {
    return !!this.project &&
      this.currentUserId === this.project.owner.id;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Project not found.';
      this.loading = false;
      return;
    }

    this.loadProject(id);
  }

  loadProject(id: string): void {
    this.projectService.getProject(id).subscribe({
      next: project => {
        this.project = project;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load this project.';
        this.loading = false;
      }
    });
  }

  addTask(): void {
    if (!this.project || !this.newTask.title.trim()) {
      this.error = 'Task title is required.';
      return;
    }

    this.error = '';
    this.message = '';

    this.projectService.createTask(this.project._id, {
      title: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status,
      assignedTo: this.newTask.assignedTo || null
    }).subscribe({
      next: project => {
        this.project = project;
        this.newTask = {
          title: '',
          description: '',
          status: 'Pending',
          assignedTo: ''
        };
        this.showTaskForm = false;
        this.message = 'Task created.';
      },
      error: error => {
        this.error = error.error?.message || 'Could not create task.';
      }
    });
  }

  changeTaskStatus(taskId: string, status: string): void {
    if (!this.project) return;

    this.projectService.updateTask(
      this.project._id,
      taskId,
      { status }
    ).subscribe({
      next: project => this.project = project,
      error: error => {
        this.error = error.error?.message || 'Could not update task.';
      }
    });
  }

  deleteTask(taskId: string): void {
    if (!this.project || !confirm('Delete this task?')) {
      return;
    }

    this.projectService.deleteTask(
      this.project._id,
      taskId
    ).subscribe({
      next: () => {
        if (this.project) {
          this.project = {
            ...this.project,
            tasks: this.project.tasks.filter(task => task._id !== taskId)
          };
        }
      },
      error: error => {
        this.error = error.error?.message || 'Could not delete task.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
