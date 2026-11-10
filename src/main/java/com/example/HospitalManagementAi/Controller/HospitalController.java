package com.example.HospitalManagementAi.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.HospitalManagementAi.entity.Hospital;
import com.example.HospitalManagementAi.service.HospitalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/hospital")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @GetMapping
    public List<Hospital> getAllHospital() {
        return service.getAllHospitals();
    }

    @GetMapping("/{id}")
    public Hospital getOneHospital(@PathVariable Long id) {
        return service.getOne(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Hospital createHospital(@Valid @RequestBody Hospital hospital) {
        return service.createHospital(hospital);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHospital(@PathVariable Long id) {
        service.deleteHospital(id);
    }

    @PutMapping("/{id}")
    public Hospital update(@PathVariable Long id, @Valid @RequestBody Hospital hospital) {
        return service.updateHospital(id, hospital);
    }
}
