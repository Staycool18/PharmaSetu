package com.Medic.Medic.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;

public interface PharmacyRepository extends JpaRepository<Pharmacy, Long> {

    Optional<Pharmacy> findByUser(User user);

    @Query(value = """
        SELECT p.*,
        (6371 * acos(
            cos(radians(:lat)) *
            cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(:lon)) +
            sin(radians(:lat)) *
            sin(radians(p.latitude))
        )) AS distance
        FROM pharmacy p
        HAVING distance <= :radius
        ORDER BY distance
        """, nativeQuery = true)
    List<Object[]> findNearbyPharmacies(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );
}
