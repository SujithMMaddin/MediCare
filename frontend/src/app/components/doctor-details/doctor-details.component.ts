import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DoctorService } from '../../core/services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { extractErrorMessage } from '../../core/services/error-message';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page narrow">
      <a mat-button routerLink="/doctors"><mat-icon>arrow_back</mat-icon> Back to doctors</a>

      @if (loading()) {
        <div class="empty-state"><mat-spinner diameter="40" /></div>
      } @else if (error()) {
        <div class="error-banner">{{ error() }}</div>
      } @else {
        @if (doctor(); as doc) {
          <mat-card>
            <mat-card-header>
              <mat-icon mat-card-avatar class="avatar">person</mat-icon>
              <mat-card-title>{{ doc.name }}</mat-card-title>
              <mat-card-subtitle>{{ doc.specialization }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="row"><mat-icon>medical_information</mat-icon>
                <div><strong>Specialization</strong><div>{{ doc.specialization }}</div></div>
              </div>
              <div class="row"><mat-icon>schedule</mat-icon>
                <div><strong>Appointment times</strong><div>View this doctor's calendar to see current availability.</div></div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <a mat-flat-button color="primary" [routerLink]="['/book', doc.id]">
                <mat-icon>event</mat-icon> Book appointment
              </a>
            </mat-card-actions>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .narrow { max-width: 640px; }
    .avatar { background: #e0f2f1; color: var(--mc-primary-dark); display: flex; align-items: center; justify-content: center; }
    .row { display: flex; gap: 12px; align-items: center; margin: 16px 0; }
    .row mat-icon { color: var(--mc-primary); }
    mat-card { margin-top: 12px; }
    mat-card-actions { padding: 8px 16px 16px; }
  `]
})
export class DoctorDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly doctorService = inject(DoctorService);

  readonly doctor = signal<Doctor | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.doctorService.getById(id).subscribe({
      next: (doc) => {
        this.doctor.set(doc);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractErrorMessage(err));
        this.loading.set(false);
      }
    });
  }
}
