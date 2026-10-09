import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="navbar">
      <a class="brand" routerLink="/">
        <mat-icon>local_hospital</mat-icon>
        <span>MediCare</span>
      </a>

      <span class="spacer"></span>

      <nav class="public-nav" aria-label="Main navigation">
        <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a mat-button routerLink="/doctors" routerLinkActive="active">Doctors</a>
        <a mat-button routerLink="/specializations" routerLinkActive="active">Specialties</a>
        <a mat-button routerLink="/" fragment="about">About</a>
      </nav>

      @if (auth.isLoggedIn()) {
        @if (auth.isPatient()) {
          <a mat-button routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a mat-button routerLink="/doctors" routerLinkActive="active">Doctors</a>
          <a mat-button routerLink="/my-appointments" routerLinkActive="active">My Appointments</a>
        }
        @if (auth.isAdmin()) {
          <a mat-button routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a mat-button routerLink="/admin/doctors" routerLinkActive="active">Manage Doctors</a>
          <a mat-button routerLink="/admin/appointments" routerLinkActive="active">Manage Appointments</a>
        }
        @if (auth.currentUser()?.role === 'DOCTOR') {
          <a mat-button routerLink="/doctor/appointments" routerLinkActive="active">Appointments</a>
        }
        <span class="user">
          <mat-icon>account_circle</mat-icon>
          {{ auth.currentUser()?.name }}
        </span>
        <button mat-stroked-button class="logout" (click)="auth.logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      } @else {
        <a mat-button routerLink="/login" routerLinkActive="active">Sign in</a>
        <a mat-flat-button class="register" routerLink="/register">Register</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: var(--mc-primary);
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 10;
      flex-wrap: wrap;
      height: auto;
      min-height: 64px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      text-decoration: none;
      font-size: 20px;
      font-weight: 500;
    }
    a[mat-button], .logout { color: #fff; }
    .active { background: rgba(255, 255, 255, 0.18); }
    .public-nav { display: flex; align-items: center; }
    .register { background: #fff; color: var(--mc-primary-dark); margin-left: 6px; }
    .user {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin: 0 12px;
      font-size: 14px;
    }
    .logout { border-color: rgba(255, 255, 255, 0.6); }
    @media (max-width: 760px) { .public-nav { order: 3; width: 100%; justify-content: center; } }
  `]
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
}
