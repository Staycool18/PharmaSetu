package com.Medic.Medic.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pharmacies")
public class Pharmacy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pharmacyName;

    private String email;
    
    private long licenseNumber;

    private String password;

     // ✅ LOCATION FIELDS (MANDATORY)
    private double latitude;
    private double longitude;
    private String address;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
