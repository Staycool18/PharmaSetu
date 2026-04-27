package com.Medic.Medic.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Dto.PharmacyLocationResponse;
import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Service.PharmacyService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/pharmacy")
@CrossOrigin(origins="http://localhost:5173")
public class PharmacyController {

    @Autowired
    private PharmacyService pharmacyService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Pharmacy pharmacy) {
        Pharmacy saved = pharmacyService.createPharmacy(pharmacy);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/nearby")
    public List<PharmacyLocationResponse> getNearbyPharmacies(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5") double radius
    ) {
        return pharmacyService.getNearbyPharmacies(lat, lon, radius);
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
    
    @GetMapping("/")
    public ResponseEntity<?> getAll(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // User is authenticated - check role
            // For now, return all pharmacies (will be filtered by role later)
        }
        List<Pharmacy> ph = pharmacyService.getAllPharmacy();
        return ResponseEntity.ok(ph);
    }
    
    @GetMapping("/my-pharmacy")
    public ResponseEntity<?> getMyPharmacy(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Authorization required");
        }
        
        String token = authHeader.substring(7);
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (auth != null && auth.isAuthenticated()) {
            String username = auth.getName();
            Pharmacy pharmacy = pharmacyService.getPharmacyByUsername(username);
            if (pharmacy == null) {
                return ResponseEntity.status(404).body("No pharmacy found for this user");
            }
            return ResponseEntity.ok(pharmacy);
        }
        
        return ResponseEntity.status(401).body("Not authenticated");
    }

}

