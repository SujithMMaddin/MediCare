import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AppointmentRequest,
  AppointmentResponse
} from '../models/appointment.model';


export interface AvailableSlot {
  date: string;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/appointments`;

  book(request: AppointmentRequest): Observable<AppointmentResponse> {
    return this.http.post<AppointmentResponse>(this.baseUrl, request);
  }

  getAvailableSlots(doctorId: number, from: string, to: string): Observable<AvailableSlot[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<AvailableSlot[]>(`${environment.apiUrl}/doctors/${doctorId}/available-slots`, { params });
  }

  getMine(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/my`);
  }

  getDoctorAppointments(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/doctor/my`);
  }

  getAll(): Observable<AppointmentResponse[]> {
    return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/all`);
  }

  cancel(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.baseUrl}/${id}/cancel`,
      {}
    );
  }

  confirm(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.baseUrl}/${id}/confirm`,
      {}
    );
  }

  reject(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.baseUrl}/${id}/reject`,
      {}
    );
  }

  complete(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.baseUrl}/${id}/complete`,
      {}
    );
  }

  markNoShow(id: number): Observable<AppointmentResponse> {
    return this.http.put<AppointmentResponse>(
      `${this.baseUrl}/${id}/no-show`,
      {}
    );
  }
}
