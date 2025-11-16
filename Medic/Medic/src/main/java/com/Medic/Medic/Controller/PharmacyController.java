package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Service.PharmacyService;


@RestController
@RequestMapping("/pharmacy")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Pharmacy pharmacy) {
        Pharmacy saved = pharmacyService.createPharmacy(pharmacy);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        Pharmacy pharmacy = pharmacyService.getPharmacyByUser(user);
        return ResponseEntity.ok(pharmacy);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Pharmacy pharmacy = pharmacyService.getPharmacyById(id);
        return ResponseEntity.ok(pharmacy);
    }
}

