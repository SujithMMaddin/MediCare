package com.medicare.service;

import com.medicare.dto.DoctorRequest;
import com.medicare.dto.DoctorResponse;
import com.medicare.entity.Doctor;
import com.medicare.entity.Role;
import com.medicare.entity.Specialization;
import com.medicare.entity.User;
import com.medicare.exception.DoctorNotFoundException;
import com.medicare.repository.DoctorRepository;
import com.medicare.repository.SpecializationRepository;
import com.medicare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            SpecializationRepository specializationRepository,
            PasswordEncoder passwordEncoder) {

        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.specializationRepository = specializationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors(Long specializationId) {
        return doctorRepository.findAll()
                .stream()
                .filter(doctor -> specializationId == null || doctor.getSpecialization().getId().equals(specializationId))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(Long id) {
        return toResponse(findDoctor(id));
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {

        Specialization specialization = specializationRepository
                .findById(request.specializationId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Specialization not found"));

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException(
                    "A user with this email already exists");
        }

        User user = new User(
                request.name().trim(),
                request.email().trim(),
                passwordEncoder.encode(request.password()),
                Role.DOCTOR
        );

        user = userRepository.save(user);

        Doctor doctor = new Doctor(user, specialization);

        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {

        Doctor doctor = findDoctor(id);

        Specialization specialization = specializationRepository
                .findById(request.specializationId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Specialization not found"));

        User user = doctor.getUser();

        user.setName(request.name().trim());

        if (!user.getEmail().equalsIgnoreCase(request.email().trim())
                && userRepository.existsByEmail(request.email().trim())) {

            throw new IllegalArgumentException(
                    "A user with this email already exists");
        }

        user.setEmail(request.email().trim());

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        userRepository.save(user);

        doctor.setSpecialization(specialization);

        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public void deleteDoctor(Long id) {

        Doctor doctor = findDoctor(id);

        doctorRepository.delete(doctor);
    }

    private Doctor findDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new DoctorNotFoundException(
                                "Doctor not found with id " + id));
    }

    private DoctorResponse toResponse(Doctor doctor) {

        User user = doctor.getUser();
        Specialization specialization = doctor.getSpecialization();

        return new DoctorResponse(
                doctor.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                specialization.getId(),
                specialization.getName(),
                doctor.getCreatedAt()
        );
    }
}
