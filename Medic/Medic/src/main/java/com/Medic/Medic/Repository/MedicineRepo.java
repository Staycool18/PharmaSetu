package com.Medic.Medic.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Medic.Medic.Entity.Medicine;

public interface MedicineRepo extends JpaRepository<Medicine, Long>{

	List<Medicine> findByPharmacyId(Long pharmacyId);
}
