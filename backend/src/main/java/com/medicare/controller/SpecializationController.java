package com.medicare.controller;

import com.medicare.entity.Specialization;
import com.medicare.service.SpecializationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

    private final SpecializationService specializationService;

    public SpecializationController(
            SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping
    public ResponseEntity<List<Specialization>> getAll() {
        return ResponseEntity.ok(
                specializationService.getAll());
    }

    @PostMapping
    public ResponseEntity<Specialization> create(
            @RequestBody String name) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(specializationService.create(name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        specializationService.delete(id);

        return ResponseEntity.noContent().build();
    }
}