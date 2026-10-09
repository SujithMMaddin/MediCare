package com.medicare.dto;

import java.time.LocalDateTime;

public record DoctorResponse(
        Long id,
        Long userId,
        String name,
        String email,
        Long specializationId,
        String specialization,
        LocalDateTime createdAt
) {
}