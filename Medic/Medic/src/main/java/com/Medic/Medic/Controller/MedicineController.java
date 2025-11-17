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

    // 1. Fetch from FDA API
    @GetMapping("/fetch/{name}")
    public ResponseEntity<?> fetchFromFDA(@PathVariable String name) {
        Medicine m = medicineService.fetchMedicineFromFDA(name);
        if (m == null) {
            return ResponseEntity.status(404).body("No information found in FDA API");
        }
        return ResponseEntity.ok(m);
    }

    // 2. Add medicine manually OR after fetching
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Medicine medicine, HttpServletRequest request) {
         String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7); // remove "Bearer "
        String username = jwtUtil.extractUsername(token);
        Medicine saved = medicineService.addMedicineForPharmacy(medicine, username);
        return ResponseEntity.ok(saved);
    }

    // 3. All medicines
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    // 4. Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Medicine m = medicineService.getMedicine(id);
        if (m == null) return ResponseEntity.status(404).body("Medicine not found");
        return ResponseEntity.ok(m);
    }

    // 5. Update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Medicine medicine) {

        Medicine updated = medicineService.updateMedicine(id, medicine);
        if (updated == null) return ResponseEntity.status(404).body("Medicine not found");
        return ResponseEntity.ok(updated);
    }

    // 6. Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Deleted");
    }
}
