package com.Medic.Medic.Service.Implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Medic.Medic.Entity.Pharmacy;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Repository.PharmacyRepository;
import com.Medic.Medic.Repository.UserRepository;
import com.Medic.Medic.Service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PharmacyRepository pharmacyRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {

        user.setUsername(user.getEmailId());
        user.setRole("ROLE_USER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User registerPharmacy(User user) {

        user.setUsername(user.getEmailId());
        user.setRole("ROLE_PHARMACY");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the pharmacy user
        User savedUser = userRepository.save(user);

        // Create a pharmacy entry linked to saved user
        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setPharmacyName(savedUser.getUsername() + "'s Store");
        pharmacy.setAddress("Not Provided");
        pharmacy.setPhone("Not Provided");
        pharmacy.setUser(savedUser);

        pharmacyRepository.save(pharmacy);

        return savedUser;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }
}
