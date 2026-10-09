package com.medicare.repository;

import com.medicare.entity.Appointment;
import com.medicare.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Modifying
    @Query(value = "update appointments set patient_profile_id = :profileId where user_id = :accountId and patient_profile_id is null", nativeQuery = true)
    int assignLegacyAppointmentsToSelf(@Param("accountId") Long accountId, @Param("profileId") Long profileId);

    @EntityGraph(attributePaths = {"bookedBy", "patientProfile", "doctor", "doctor.user", "doctor.specialization"})
    List<Appointment> findByBookedByIdOrderByAppointmentDateDesc(Long bookedById);

    @EntityGraph(attributePaths = {"bookedBy", "patientProfile", "doctor", "doctor.user", "doctor.specialization"})
    List<Appointment> findByDoctorIdOrderByAppointmentDateDesc(Long doctorId);

    @EntityGraph(attributePaths = {"bookedBy", "patientProfile", "doctor", "doctor.user", "doctor.specialization"})
    List<Appointment> findAllByOrderByAppointmentDateDesc();

    long countByBookedByIdAndStatusInAndAppointmentDateAfter(Long accountId, List<AppointmentStatus> statuses, LocalDateTime after);

    @EntityGraph(attributePaths = {"doctor", "doctor.availabilities"})
    List<Appointment> findByPatientProfileIdAndStatusInAndAppointmentDateAfter(Long profileId, List<AppointmentStatus> statuses, LocalDateTime after);

    @Query("select a.appointmentDate from Appointment a where a.doctor.id = :doctorId and a.appointmentDate >= :from and a.appointmentDate < :to and a.status in :statuses")
    List<LocalDateTime> findOccupiedAppointmentDates(@Param("doctorId") Long doctorId,
            @Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
            @Param("statuses") List<AppointmentStatus> statuses);

    boolean existsByDoctorIdAndAppointmentDateAndStatusIn(
            Long doctorId,
            LocalDateTime appointmentDate,
            List<AppointmentStatus> statuses
    );
}
