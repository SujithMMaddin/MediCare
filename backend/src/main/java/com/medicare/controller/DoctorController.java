package com.medicare.controller;

import com.medicare.dto.DoctorRequest;
import com.medicare.dto.DoctorResponse;
import com.medicare.service.DoctorService;
import com.medicare.service.AppointmentService;
import com.medicare.dto.AvailableSlotResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    public DoctorController(DoctorService doctorService, AppointmentService appointmentService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
    }

    @GetMapping("/{id}/available-slots")
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(@PathVariable Long id,
            @RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to) {
        LocalDate start = from == null ? LocalDate.now() : from;
        LocalDate end = to == null ? start.plusDays(from == null ? 89 : 29) : to;
        return ResponseEntity.ok(appointmentService.getAvailableSlots(id, start, end));
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAll(@RequestParam(required = false) Long specializationId) {
        return ResponseEntity.ok(doctorService.getAllDoctors(specializationId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                doctorService.getDoctorById(id));
    }

    @PostMapping
    public ResponseEntity<DoctorResponse> create(
            @Valid @RequestBody DoctorRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(doctorService.createDoctor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {

        return ResponseEntity.ok(
                doctorService.updateDoctor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.noContent().build();
    }
}
