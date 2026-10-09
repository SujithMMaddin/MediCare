import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppointmentService } from '../../core/services/appointment.service';
import { AppointmentResponse } from '../../core/models/appointment.model';
import { extractErrorMessage } from '../../core/services/error-message';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page">
      <div class="page-title">
        <h1>Manage Appointments</h1>
      </div>

      @if (loading()) {
        <div class="empty-state">
          <mat-spinner diameter="40" />
        </div>
      } @else if (error()) {
        <div class="error-banner">{{ error() }}</div>
      } @else if (appointments().length === 0) {
        <mat-card>
          <mat-card-content class="empty-state">
            No appointments have been booked yet.
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="appointments()">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let a">
                {{ a.id }}
              </td>
            </ng-container>

            <ng-container matColumnDef="patient">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let a">
                <div>{{ a.patientName }}</div>
                <small class="muted">{{ a.patientRelationship }} · booked by {{ a.bookingAccountName }} ({{ a.bookingAccountEmail }})</small>
              </td>
            </ng-container>

            <ng-container matColumnDef="doctor">
              <th mat-header-cell *matHeaderCellDef>Doctor</th>
              <td mat-cell *matCellDef="let a">
                <div>{{ a.doctorName }}</div>
                <small class="muted">{{ a.specialization }}</small>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>
                Date &amp; time
              </th>
              <td mat-cell *matCellDef="let a">
                {{ a.appointmentDate | date: 'EEE, d MMM y, h:mm a' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let a">
                <span
                  class="status-chip"
                  [class]="a.status">
                  {{ a.status }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>

          </table>
        </mat-card>
      }
    </div>
  `,

  styles: [`
    .muted {
      color: var(--mc-muted);
    }
  `]
})
export class ManageAppointmentsComponent implements OnInit {

  private readonly appointmentService = inject(AppointmentService);

  readonly columns = [
    'id',
    'patient',
    'doctor',
    'date',
    'status'
  ];

  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.appointmentService.getAll().subscribe({
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
