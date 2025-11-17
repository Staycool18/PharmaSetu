package com.Medic.Medic.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    Optional<Pharmacy> findByUser(User user);
}
