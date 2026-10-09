package com.medicare.controller;

import com.medicare.dto.AppointmentRequest;
import com.medicare.dto.AppointmentResponse;
import com.medicare.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ==================== PATIENT ====================

    @PostMapping
    public ResponseEntity<AppointmentResponse> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequest request) {

        AppointmentResponse response =
                appointmentService.bookAppointment(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            Authentication authentication) {

        return ResponseEntity.ok(
                appointmentService.getMyAppointments(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            Authentication authentication,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.cancelAppointment(
                        id,
                        authentication.getName()
                )
        );
    }

    // ==================== DOCTOR ====================

    @GetMapping("/doctor/my")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(
            Authentication authentication) {

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointments(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<AppointmentResponse> confirmAppointment(
            Authentication authentication,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.confirmAppointment(
                        id,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AppointmentResponse> rejectAppointment(
            Authentication authentication,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.rejectAppointment(
                        id,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<AppointmentResponse> completeAppointment(
            Authentication authentication,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.completeAppointment(
                        id,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}/no-show")
    public ResponseEntity<AppointmentResponse> markNoShow(
            Authentication authentication,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                appointmentService.markNoShow(
                        id,
                        authentication.getName()
                )
        );
    }

    // ==================== ADMIN ====================

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }
}
