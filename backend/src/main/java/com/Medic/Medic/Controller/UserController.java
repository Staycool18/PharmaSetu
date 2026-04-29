package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.Medic.Medic.Dto.ForgetPassRequest;
import com.Medic.Medic.Dto.ResetPasswordRequest;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Repository.UserRepository;
import com.Medic.Medic.Service.UserService;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Validate Gmail domain
            if (!user.getEmailId().endsWith("@gmail.com")) {
                return ResponseEntity.status(400).body("Only Gmail addresses are allowed");
            }
            
            // Check if email already exists
            if (userRepository.findByEmailId(user.getEmailId()).isPresent()) {
                return ResponseEntity.status(400).body("Email already exists");
            }
            
            User saved = userService.registerUser(user);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
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
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgetPassword(@RequestBody ForgetPassRequest email){
    	try {
    		userService.forgetPassword(email.getEmail());
    		return ResponseEntity.ok("Password reset request processed! Check server console for reset token (email disabled in development).");
    	}
    	catch(Exception e) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    	}
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request){
    	try {
    		userService.resetPassword(request.getToken(), request.getNewPassword());
    		return ResponseEntity.ok("Password reset successfully!");
    	}
    	catch(Exception e) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
    	}
    }
    
}
