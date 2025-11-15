package com.Medic.Medic.Service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Medic.Medic.Configuration.RestTemplateConfig;
import com.Medic.Medic.Entity.Medicine;
import com.Medic.Medic.Repository.MedicineRepo;

public interface MedicineService {
	
	

	public Medicine getMedicineInfo(String name);

	public void AddMedicine(Medicine med);

	public void RemoveMedicine(Long id);

	
	public void UpdateMedicine(Medicine med);

}
