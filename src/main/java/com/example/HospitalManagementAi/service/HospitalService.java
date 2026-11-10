package com.example.HospitalManagementAi.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.HospitalManagementAi.entity.Hospital;
import com.example.HospitalManagementAi.repository.HospitalRepository;

@Service
public class HospitalService {

    private final HospitalRepository repo;

    public HospitalService(HospitalRepository repo) {
        this.repo = repo;
    }

    public List<Hospital> getAllHospitals() {
        return repo.findAll();
    }

    public Hospital getOne(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Hospital not found with id: " + id));
    }

    public Hospital createHospital(Hospital hospital) {
        hospital.setId(null);
        return repo.save(hospital);
    }

    public void deleteHospital(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Hospital not found with id: " + id);
        }
        repo.deleteById(id);
    }

    public Hospital updateHospital(Long id, Hospital hospitalDetails) {
        Hospital hospital = getOne(id);
        hospital.setName(hospitalDetails.getName());
        hospital.setLocation(hospitalDetails.getLocation());
        hospital.setSpecialization(hospitalDetails.getSpecialization());
        return repo.save(hospital);
    }

    public List<Hospital> findBySpecialization(String specialization) {
        return repo.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<Hospital> findByLocation(String location) {
        return repo.findByLocationContainingIgnoreCase(location);
    }

    public long count() {
        return repo.count();
    }
}
