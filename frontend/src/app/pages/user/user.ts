import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Project } from '../../models/models';
import { AuthService } from '../../core/auth.service';
import { ProjectService } from '../../core/project.service';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, RouterLink, HeaderComponent],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent implements OnInit {
  private auth = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects: Project[] = [];
  showForm = false;
  loading = true;
  message = '';
  error = '';

  newProject = {
    title: '',
    description: '',
    status: 'In Progress'
  };

  get userName(): string {
    return this.auth.getCurrentUser()?.name ?? 'User';
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;

    this.projectService.getMyProjects().subscribe({
      next: projects => {
        this.projects = projects;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load your projects.';
        this.loading = false;
      }
    });
  }

  createProject(): void {
    this.error = '';
    this.message = '';

    if (!this.newProject.title.trim()) {
      this.error = 'Project title is required.';
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: project => {
        this.projects = [project, ...this.projects];
        this.newProject = {
          title: '',
          description: '',
          status: 'In Progress'
        };
        this.showForm = false;
        this.message = 'Project created.';
      },
      error: error => {
        this.error = error.error?.message || 'Could not create project.';
      }
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Delete this project?')) {
      return;
    }

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(project => project._id !== id);
      },
      error: error => {
        this.error = error.error?.message || 'Could not delete project.';
      }
    });
  }

  openProject(id: string): void {
    this.router.navigate(['/project', id]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
