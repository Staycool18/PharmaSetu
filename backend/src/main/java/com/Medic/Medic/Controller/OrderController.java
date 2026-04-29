package com.Medic.Medic.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Medic.Medic.Dto.OrderRequest;
import com.Medic.Medic.Dto.PaymentVerificationRequest;
import com.Medic.Medic.Entity.Medicine;
import com.Medic.Medic.Entity.Order;
import com.Medic.Medic.Entity.OrderItem;
import com.Medic.Medic.Entity.User;
import com.Medic.Medic.Repository.MedicineRepo;
import com.Medic.Medic.Repository.OrderRepository;
import com.Medic.Medic.Repository.UserRepository;
import com.Medic.Medic.Security.JwtUtil;
import com.Medic.Medic.Service.Implementation.EmailService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MedicineRepo medicineRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, HttpServletRequest httpRequest) {
        try {
            String authHeader = httpRequest.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization required");
            }
            
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = Order.builder()
                .user(user)
                .totalAmount(request.getTotalAmount())
                .status("PENDING")
                .orderDate(LocalDateTime.now())
                .build();

            order = orderRepository.save(order);

            for (var itemReq : request.getItems()) {
                Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

                OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .medicine(medicine)
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .build();

                order.getOrderItems().add(orderItem);
            }

            order = orderRepository.save(order);
            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
    try {
        Order order = orderRepository.findById(request.getOrderEntityId())
            .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentId(request.getPaymentId());
        order.setTransactionId(request.getPaymentId());
        order.setStatus("COMPLETED");
        orderRepository.save(order);

        // Send receipt email
        User user = order.getUser();
        List<String> itemNames = order.getOrderItems().stream()
            .map(item -> item.getMedicine().getName())
            .collect(java.util.stream.Collectors.toList());
        
        emailService.sendOrderReceiptEmail(
            user.getEmailId(),
            user.getUsername(),
            order.getId().toString(),
            request.getPaymentId(),
            "ONLINE",
            itemNames,
            order.getTotalAmount()
        );

        return ResponseEntity.ok("Payment verified successfully");
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Error verifying payment: " + e.getMessage());
    }
}

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(HttpServletRequest httpRequest) {
        try {
            String authHeader = httpRequest.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Authorization required");
            }
            
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<Order> orders = orderRepository.findByUser(user);
            
            // Format orders with proper structure
            List<Map<String, Object>> formattedOrders = orders.stream().map(order -> {
                Map<String, Object> orderMap = new HashMap<>();
                orderMap.put("orderId", order.getId());
                orderMap.put("orderDate", order.getOrderDate());
                orderMap.put("status", order.getStatus());
                orderMap.put("totalAmount", order.getTotalAmount());
                orderMap.put("paymentId", order.getPaymentId());
                orderMap.put("transactionId", order.getTransactionId());
                
                List<Map<String, Object>> items = order.getOrderItems().stream().map(item -> {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("medicineName", item.getMedicine().getName());
                    itemMap.put("quantity", item.getQuantity());
                    Double price = item.getPrice() != null ? item.getPrice() : 0.0;
                    itemMap.put("price", price);
                    itemMap.put("total", price * item.getQuantity());
                    return itemMap;
                }).collect(java.util.stream.Collectors.toList());
                
                orderMap.put("items", items);
                return orderMap;
            }).collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(formattedOrders);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching orders: " + e.getMessage());
        }
    }

}