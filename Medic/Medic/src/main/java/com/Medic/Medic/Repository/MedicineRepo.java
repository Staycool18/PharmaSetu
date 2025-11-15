package com.Medic.Medic.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Medic.Medic.Entity.Medicine;

public interface MedicineRepo extends JpaRepository<Medicine, Long>{

	Optional<Medicine> findByName(String name);
}
