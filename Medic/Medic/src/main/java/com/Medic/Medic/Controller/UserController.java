package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Service.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/register-pharmacy")
    public ResponseEntity<?> registerPharmacy(@RequestBody User user) {
        User saved = userService.registerPharmacy(user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/get/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        User usr = userService.findByUsername(username);
        return ResponseEntity.ok(usr);
    }
}
