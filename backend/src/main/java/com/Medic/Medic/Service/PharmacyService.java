package com.Medic.Medic.Service;

import java.util.List;

import com.Medic.Medic.Dto.PharmacyLocationResponse;
import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;

public interface PharmacyService {

    Pharmacy createPharmacy(Pharmacy pharmacy);

    Pharmacy getPharmacyByUser(User user);

    Pharmacy getPharmacyById(Long id);

    Pharmacy getPharmacyByUsername(String username);
    
    List<Pharmacy> getAllPharmacy();

    public List<PharmacyLocationResponse> getNearbyPharmacies(double lat, double lon, double radius);
    
}
