import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppointmentService } from '../../core/services/appointment.service';
import { AppointmentResponse } from '../../core/models/appointment.model';
import { extractErrorMessage } from '../../core/services/error-message';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    DatePipe, RouterLink, MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="page">
      <div class="page-title">
        <h1>My Appointments</h1>
        <a mat-flat-button color="primary" routerLink="/book"><mat-icon>add</mat-icon> New appointment</a>
      </div>

      @if (loading()) {
        <div class="empty-state"><mat-spinner diameter="40" /></div>
      } @else if (error()) {
        <div class="error-banner">{{ error() }}</div>
      } @else if (appointments().length === 0) {
        <mat-card><mat-card-content class="empty-state">You have not booked any appointments yet.</mat-card-content></mat-card>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="appointments()">
            <ng-container matColumnDef="patient">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let a"><strong>{{ a.patientName }}</strong><br><small>{{ a.patientRelationship === 'SELF' ? 'Myself' : a.patientRelationship }}</small><br><small>Booked by {{ a.bookingAccountName }}</small></td>
            </ng-container>
            <ng-container matColumnDef="doctor">
              <th mat-header-cell *matHeaderCellDef>Doctor</th>
              <td mat-cell *matCellDef="let a">{{ a.doctorName }}</td>
            </ng-container>
            <ng-container matColumnDef="specialization">
              <th mat-header-cell *matHeaderCellDef>Specialization</th>
              <td mat-cell *matCellDef="let a">{{ a.specialization }}</td>
            </ng-container>
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date &amp; time</th>
              <td mat-cell *matCellDef="let a">{{ a.appointmentDate | date: 'EEE, d MMM y, h:mm a' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let a"><span class="status-chip" [class]="a.status">{{ a.status }}</span></td>
            </ng-container>
            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>Reason</th>
              <td mat-cell *matCellDef="let a">{{ a.reason || '—' }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let a">
                @if (a.status === 'PENDING' || a.status === 'CONFIRMED') {
                  <button mat-stroked-button color="warn" (click)="cancel(a)" [disabled]="busyId() === a.id">
                    <mat-icon>cancel</mat-icon> Cancel
                  </button>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
        </mat-card>
      }
    </div>
  `
})
export class MyAppointmentsComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly snackBar = inject(MatSnackBar);

  readonly columns = ['patient', 'doctor', 'specialization', 'date', 'status', 'reason', 'actions'];
  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly busyId = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  cancel(appt: AppointmentResponse): void {
    if (!confirm(`Cancel your appointment with ${appt.doctorName}?`)) {
      return;
    }
    this.busyId.set(appt.id);
    this.appointmentService.cancel(appt.id).subscribe({
      next: (updated) => {
        this.appointments.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
        this.snackBar.open('Appointment cancelled', 'OK', { duration: 3000 });
        this.busyId.set(null);
      },
      error: (err) => {
        this.snackBar.open(extractErrorMessage(err), 'Close', { duration: 5000 });
        this.busyId.set(null);
      }
    });
  }

  private load(): void {
    this.appointmentService.getMine().subscribe({
      next: (list) => {
        this.appointments.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err));
        this.loading.set(false);
      }
    });
  }
}
