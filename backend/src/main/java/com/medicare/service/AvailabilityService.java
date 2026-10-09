package com.medicare.service;

import com.medicare.dto.AvailabilityRequest;
import com.medicare.dto.AvailabilityResponse;
import com.medicare.entity.Availability;
import com.medicare.entity.Doctor;
import com.medicare.exception.DoctorNotFoundException;
import com.medicare.repository.AvailabilityRepository;
import com.medicare.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    public AvailabilityService(
            AvailabilityRepository availabilityRepository,
            DoctorRepository doctorRepository) {

        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public AvailabilityResponse create(
            Long doctorId,
            AvailabilityRequest request) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new DoctorNotFoundException(
                                "Doctor not found with id " + doctorId));

        if (!request.startTime().isBefore(request.endTime())) {
            throw new IllegalArgumentException(
                    "Start time must be before end time");
        }

        int duration = request.slotDurationMinutes();

        boolean overlapsExisting = availabilityRepository.findByDoctorAndDayOfWeek(doctor, request.dayOfWeek())
                .stream().anyMatch(existing -> request.startTime().isBefore(existing.getEndTime())
                        && existing.getStartTime().isBefore(request.endTime()));
        if (overlapsExisting) {
            throw new IllegalArgumentException("This availability overlaps an existing schedule for that weekday");
        }

        LocalTime lastPossibleStart =
                request.endTime().minusMinutes(duration);

        if (lastPossibleStart.isBefore(request.startTime())) {
            throw new IllegalArgumentException(
                    "Availability window is too short for the selected slot duration");
        }

        Availability availability = new Availability(
                doctor,
                request.dayOfWeek(),
                request.startTime(),
                request.endTime(),
                request.slotDurationMinutes()
        );

        return toResponse(
                availabilityRepository.save(availability));
    }

    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getForDoctor(
            Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new DoctorNotFoundException(
                                "Doctor not found with id " + doctorId));

        return availabilityRepository
                .findByDoctorOrderByDayOfWeekAscStartTimeAsc(doctor)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {

        if (!availabilityRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Availability not found");
        }

        availabilityRepository.deleteById(id);
    }

    private AvailabilityResponse toResponse(
            Availability availability) {

        return new AvailabilityResponse(
                availability.getId(),
                availability.getDoctor().getId(),
                availability.getDayOfWeek(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getSlotDurationMinutes()
        );
    }
}
