import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Project } from '../../models/models';
import { ProjectService } from '../../core/project.service';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  projects: Project[] = [];
  search = '';
  loading = true;
  error = '';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;

    this.projectService.getProjects().subscribe({
      next: projects => {
        this.projects = projects;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load projects. Is the backend running?';
        this.loading = false;
      }
    });
  }

  get filteredProjects(): Project[] {
    const value = this.search.trim().toLowerCase();

    if (!value) {
      return this.projects;
    }

    return this.projects.filter(project =>
      project.title.toLowerCase().includes(value) ||
      project.description.toLowerCase().includes(value)
    );
  }

  openProject(id: string): void {
    this.router.navigate(['/project', id]);
  }
}
