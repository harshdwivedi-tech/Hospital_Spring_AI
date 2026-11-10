package com.example.HospitalManagementAi.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping({"/", "/dashboard"})
    public String dashboard() {
        return "dashboard";
    }
}
