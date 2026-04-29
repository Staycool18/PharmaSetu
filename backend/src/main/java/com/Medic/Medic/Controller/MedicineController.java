package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Entity.Medicine;
import com.Medic.Medic.Security.JwtUtil;
import com.Medic.Medic.Service.MedicineService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/medicine")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/fetch/{name}")
    public ResponseEntity<?> fetchFromFDA(@PathVariable String name) {
        Medicine m = medicineService.fetchMedicineFromFDA(name);
        if (m == null) {
            return ResponseEntity.status(404).body("No information found in FDA API");
        }
        return ResponseEntity.ok(m);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Medicine medicine,
                                 HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization required");
            }
            
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            Medicine saved = medicineService.addMedicineForPharmacy(medicine, username);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.out.println("Error adding medicine: " + e.getMessage());
            return ResponseEntity.status(500).body("Error adding medicine: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Medicine m = medicineService.getMedicine(id);
        if (m == null) return ResponseEntity.status(404).body("Medicine not found");
        return ResponseEntity.ok(m);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Medicine medicine) {

        Medicine updated = medicineService.updateMedicine(id, medicine);
        if (updated == null) return ResponseEntity.status(404).body("Medicine not found");
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization required");
            }
            
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            // Check if medicine exists
            Medicine medicine = medicineService.getMedicine(id);
            if (medicine == null) {
                return ResponseEntity.status(404).body("Medicine not found");
            }
            
            medicineService.deleteMedicine(id);
            return ResponseEntity.ok("Medicine deleted successfully");
        } catch (Exception e) {
            if (e.getMessage().contains("foreign key constraint")) {
                return ResponseEntity.status(400).body("Cannot delete medicine: It has been ordered by customers");
            }
            return ResponseEntity.status(500).body("Error deleting medicine: " + e.getMessage());
        }
    }

    @GetMapping("/pharmacy/{pharmacyId}")
    public ResponseEntity<?> getMedicinesByPharmacy(@PathVariable Long pharmacyId) {
        return ResponseEntity.ok(medicineService.getMedicinesByPharmacy(pharmacyId));
    }
    

}