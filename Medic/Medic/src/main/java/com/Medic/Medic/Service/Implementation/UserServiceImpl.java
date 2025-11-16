package com.Medic.Medic.Service.Implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Repository.UserRepository;
import com.Medic.Medic.Service.UserService;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(User user) {
        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }

    @Override
    public User registerPharmacy(User user) {
        user.setRole("ROLE_PHARMACY");
        return userRepository.save(user);
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }
}
