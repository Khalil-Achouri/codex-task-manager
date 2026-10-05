import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  submit(): void {
    this.error = '';

    if (this.password.length < 6) {
      this.error = 'Password must contain at least 6 characters.';
      return;
    }

    this.loading = true;

    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/user']),
      error: error => {
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
