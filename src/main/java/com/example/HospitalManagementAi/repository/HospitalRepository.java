package com.example.HospitalManagementAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.HospitalManagementAi.entity.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findBySpecializationContainingIgnoreCase(String specialization);

    List<Hospital> findByLocationContainingIgnoreCase(String location);
}
