package com.Medic.Medic.Service.Implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Repository.PharmacyRepository;
import com.Medic.Medic.Service.PharmacyService;

@Service
public class PharmacyServiceImpl implements PharmacyService {

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Override
    public Pharmacy createPharmacy(Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }

    @Override
    public Pharmacy getPharmacyByUser(User user) {
        return pharmacyRepository.findByUser(user)
                .orElse(null);
    }

    @Override
    public Pharmacy getPharmacyById(Long id) {
        return pharmacyRepository.findById(id)
                .orElse(null);
    }
}
