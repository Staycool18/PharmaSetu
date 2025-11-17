package com.Medic.Medic.Service;

import java.util.List;

import com.Medic.Medic.Entity.Medicine;

public interface MedicineService {

    Medicine saveMedicine(Medicine medicine);

    Medicine fetchMedicineFromFDA(String name);

    List<Medicine> getAllMedicines();

    Medicine getMedicine(Long id);

    Medicine updateMedicine(Long id, Medicine updated);

    void deleteMedicine(Long id);

    Medicine addMedicineForPharmacy(Medicine medicine, String username);
}
