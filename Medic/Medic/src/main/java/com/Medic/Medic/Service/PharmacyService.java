package com.Medic.Medic.Service;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;

public interface PharmacyService {

    Pharmacy createPharmacy(Pharmacy pharmacy);

    Pharmacy getPharmacyByUser(User user);

    Pharmacy getPharmacyById(Long id);

    Pharmacy getPharmacyByUsername(String username);
}
