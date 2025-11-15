package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.Medic.Medic.Service.Implementation.MedicineServiceImpl;

@RestController
@RequestMapping("/med")
public class MedicineController {
	
	@Autowired
	MedicineServiceImpl med_service;

	@GetMapping("/{name}")
    public ResponseEntity<Medicine> getMedicine(@PathVariable String name) {
		Medicine med=med_service.getMedicineInfo(name);
        return ResponseEntity.ok(med);
    }
	
	@PostMapping("/add")
	public ResponseEntity<String> addMedicine(@RequestBody Medicine med) {
		med_service.AddMedicine(med);
		return ResponseEntity.status(HttpStatus.CREATED).body("Medicine added successfully");
	}
	
	@DeleteMapping("/remove/{id}")
	public ResponseEntity<String> RemoveMedicine(@PathVariable Long id) {
		med_service.RemoveMedicine(id);
		return ResponseEntity.ok("Medicine removed successfully");
	}
	
	@PutMapping("/update")
	public ResponseEntity<String> updateMedicine(@RequestBody Medicine med) {
		med_service.UpdateMedicine(med);
		return ResponseEntity.ok("Medicine updated successfully");
		
	}
}
