import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { DoctorService } from '../../core/services/doctor.service';
import { AppointmentService } from '../../core/services/appointment.service';
import { AppointmentResponse } from '../../core/models/appointment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-title">
        <h1>Admin Dashboard</h1>
      </div>
      <p class="welcome">Signed in as {{ auth.currentUser()?.name }}</p>

      <div class="card-grid">
        <mat-card>
          <mat-card-content class="stat">
            <mat-icon>medical_services</mat-icon>
            <div class="value">{{ doctorCount() }}</div>
            <div class="label">Doctors</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" routerLink="/admin/doctors">Manage doctors</a>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-content class="stat">
            <mat-icon>event_note</mat-icon>
            <div class="value">{{ appointments().length }}</div>
            <div class="label">Total appointments</div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" routerLink="/admin/appointments">Manage appointments</a>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-content class="stat">
            <mat-icon>pending_actions</mat-icon>
            <div class="value">{{ count('PENDING') + count('CONFIRMED') }}</div>
            <div class="label">Active appointments</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="stat">
            <mat-icon>task_alt</mat-icon>
            <div class="value">{{ count('COMPLETED') }}</div>
            <div class="label">Completed</div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content class="stat">
            <mat-icon>event_busy</mat-icon>
            <div class="value">{{ count('CANCELLED') }}</div>
            <div class="label">Cancelled</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .welcome { color: var(--mc-muted); margin: -8px 0 20px; }
    .stat { text-align: center; padding-top: 16px; }
    .stat mat-icon { color: var(--mc-primary); font-size: 36px; width: 36px; height: 36px; }
    .stat .value { font-size: 36px; font-weight: 500; }
    .stat .label { color: var(--mc-muted); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private readonly doctorService = inject(DoctorService);
  private readonly appointmentService = inject(AppointmentService);

  readonly doctorCount = signal(0);
  readonly appointments = signal<AppointmentResponse[]>([]);

  private readonly counts = computed(() => {
    const result: Record<string, number> = { PENDING: 0, CONFIRMED: 0, REJECTED: 0, CANCELLED: 0, COMPLETED: 0, NO_SHOW: 0 };
    this.appointments().forEach((a) => result[a.status]++);
    return result;
  });

  count(status: string): number {
    return this.counts()[status] ?? 0;
  }

  ngOnInit(): void {
    this.doctorService.getAll().subscribe((d) => this.doctorCount.set(d.length));
    this.appointmentService.getAll().subscribe((a) => this.appointments.set(a));
  }
}
