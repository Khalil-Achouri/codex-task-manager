import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Project } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);

  private api = 'http://localhost:3000/api/projects';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.api);
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.api}/user/mine/list`);
  }

  createProject(data: {
    title: string;
    description: string;
    status: string;
  }): Observable<Project> {
    return this.http.post<Project>(this.api, data);
  }

  updateProject(id: string, data: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.api}/${id}`, data);
  }

  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  createTask(
    projectId: string,
    data: {
      title: string;
      description: string;
      status: string;
      assignedTo: string | null;
    }
  ): Observable<Project> {
    return this.http.post<Project>(`${this.api}/${projectId}/tasks`, data);
  }

  updateTask(
    projectId: string,
    taskId: string,
    data: Partial<{
      title: string;
      description: string;
      status: string;
      assignedTo: string | null;
    }>
  ): Observable<Project> {
    return this.http.put<Project>(
      `${this.api}/${projectId}/tasks/${taskId}`,
      data
    );
  }

  deleteTask(
    projectId: string,
    taskId: string
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.api}/${projectId}/tasks/${taskId}`
    );
  }

  addMember(projectId: string, userId: string): Observable<Project> {
    return this.http.post<Project>(
      `${this.api}/${projectId}/members/${userId}`,
      {}
    );
  }
}
