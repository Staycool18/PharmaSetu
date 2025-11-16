package com.Medic.Medic.Service.Implementation;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Medic.Medic.Entity.Medicine;
import com.Medic.Medic.Repository.MedicineRepo;
import com.Medic.Medic.Service.MedicineService;

@Service
public class MedicineServiceImpl implements MedicineService {

    @Autowired
    private MedicineRepo medicineRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String FDA_API_URL = 
        "https://api.fda.gov/drug/label.json?search=openfda.brand_name:";

    @Override
    public Medicine saveMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    @Override
    public Medicine fetchMedicineFromFDA(String name) {
        try {
            String url = FDA_API_URL + name;

            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {

                Map<String, Object> data = response.getBody();
                List<Map<String, Object>> results = (List<Map<String, Object>>) data.get("results");

                if (results == null || results.isEmpty()) {
                    return null; // no data found
                }

                Map<String, Object> item = results.get(0); // first result

                // Extract fields safely
                Medicine med = new Medicine();
                med.setName(name);

                med.setDescription(
                    item.containsKey("description") ?
                    ((List<String>) item.get("description")).get(0) :
                    "No description available"
                );

                med.setUsage(
                    item.containsKey("indications_and_usage") ?
                    ((List<String>) item.get("indications_and_usage")).get(0) :
                    "No usage info"
                );

                med.setWarnings(
                    item.containsKey("warnings") ?
                    ((List<String>) item.get("warnings")).get(0) :
                    "No warnings"
                );

                return med;
            }
        } catch (Exception ex) {
            System.out.println("FDA API Error: " + ex.getMessage());
        }

        return null;
    }

    @Override
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @Override
    public Medicine getMedicine(Long id) {
        return medicineRepository.findById(id).orElse(null);
    }

    @Override
    public Medicine updateMedicine(Long id, Medicine updated) {
        Medicine existing = getMedicine(id);
        if (existing == null) return null;

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setUsage(updated.getUsage());
        existing.setWarnings(updated.getWarnings());

        return medicineRepository.save(existing);
    }

    @Override
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}
