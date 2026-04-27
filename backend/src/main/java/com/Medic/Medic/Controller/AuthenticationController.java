package com.Medic.Medic.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Dto.AuthenticationRequest;
import com.Medic.Medic.Dto.AuthenticationResponse;
import com.Medic.Medic.Security.CustomUserDetailsService;
import com.Medic.Medic.Security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins="http://localhost:5173")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {

    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );
    } catch (Exception e) {
        System.out.println("AUTH FAILED: " + e.getClass().getName());
        return ResponseEntity.status(401).body("Invalid username or password");
    }

    UserDetails userDetails =
            userDetailsService.loadUserByUsername(request.getUsername());

    String token = jwtUtil.generateToken(userDetails);
    return ResponseEntity.ok(new AuthenticationResponse(token));
}

    
    
}