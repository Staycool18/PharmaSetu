package com.Medic.Medic.Service.Implementation;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Medic.Medic.Entity.Medicine;
import com.Medic.Medic.Repository.MedicineRepo;
import com.Medic.Medic.Service.MedicineService;

@Service
public class MedicineServiceImpl implements MedicineService{

	@Autowired
    private RestTemplate restTemplate;
	
	@Autowired
	MedicineRepo med_repo;

	@Override
	public Medicine getMedicineInfo(String name) {
		Medicine m = med_repo.findByName(name)
		        .orElseThrow(() -> new RuntimeException("Medicine not found with name: " + name));
		try {
			
			
			String url="https://api.fda.gov/drug/label.json?search=openfda.brand_name:" + name +"\r\n";
			String response = restTemplate.getForObject(url, String.class);

            JSONObject json = new JSONObject(response);
            JSONArray results = json.getJSONArray("results");
            JSONObject drug = results.getJSONObject(0);
            
            
			
			m.setDescription(drug.optString("description", "No description available"));
			m.setSideEffects(drug.optString("warnings", "No data available"));
			
			return m;
			
		}
		catch(Exception e){
			System.out.println("Error fetching data: " + e.getMessage());
            Medicine fallback=new Medicine();
            fallback.setName(name);
            fallback.setDescription("No data found for " + name);
            return fallback;
		}
	}

	@Override
	public void AddMedicine(Medicine med) {
		med_repo.save(med);
		
	}

	public void RemoveMedicine(Long id) {
		med_repo.deleteById(id);
	}

	public void UpdateMedicine(Medicine med) {
		Medicine existing=med_repo.findById(med.getId()).orElseThrow(()->new RuntimeException("Medicine not found"));
		
		
		 if(med.getName() != null) {
		       existing.setName(med.getName());
		 }
		
		
	}
}
