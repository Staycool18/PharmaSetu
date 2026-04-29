package com.Medic.Medic.Controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Dto.RazorpayRequestDTO;
import com.Medic.Medic.Service.RazorpayService;

@RestController
@RequestMapping("/api/payment")
public class RazorpayController {
    
    private static final Logger logger = LoggerFactory.getLogger(RazorpayController.class);
    
    @Autowired
    private RazorpayService razorpayService;
    
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody RazorpayRequestDTO request) {
        logger.info("Creating Razorpay order: {}", request);
        Map<String, Object> response = razorpayService.createRazorpayOrder(request);
        logger.info("Order created successfully: {}", response);
        return ResponseEntity.ok(response);
    }
}
