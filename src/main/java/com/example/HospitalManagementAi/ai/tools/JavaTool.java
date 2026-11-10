package com.example.HospitalManagementAi.ai.tools;

import java.util.List;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import com.example.HospitalManagementAi.entity.Hospital;
import com.example.HospitalManagementAi.service.HospitalService;

@Component
public class JavaTool {

    private final HospitalService hospitalService;

    public JavaTool(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @Tool(description = "Get all hospitals currently registered in the hospital management database.")
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    @Tool(description = "Find hospitals by medical specialization. Example values: Cardiology, Neurology, Orthopedics.")
    public List<Hospital> findHospitalsBySpecialization(String specialization) {
        return hospitalService.findBySpecialization(specialization);
    }

    @Tool(description = "Find hospitals by city, town, area, or location.")
    public List<Hospital> findHospitalsByLocation(String location) {
        return hospitalService.findByLocation(location);
    }

    @Tool(description = "Get the total number of hospitals registered in the database.")
    public long getHospitalCount() {
        return hospitalService.count();
    }
}
