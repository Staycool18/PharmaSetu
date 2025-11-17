package com.Medic.Medic.Service;

import com.Medic.Medic.Entity.User;

public interface UserService {

    User registerUser(User user);

    User registerPharmacy(User user);

    User findByUsername(String username);
}
