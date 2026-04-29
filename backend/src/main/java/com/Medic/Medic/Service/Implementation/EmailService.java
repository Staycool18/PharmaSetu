package com.Medic.Medic.Service.Implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
	@Autowired
    private JavaMailSender mailSender;
	
	private final String fromEmail = "vedantsalvi2353@gmail.com";
	private final String fromName = "PharmaSetu Team";

	@Value("${app.frontend.url:https://deploysolutions.me}")
	private String frontendBaseUrl;
	
	public void sendVerificationEmail(String toEmail, String token) {
        String verificationUrl = frontendBaseUrl.replaceAll("/+$", "") + "/auth/verify-email?token=" + token;
        String subject = "PharmaSetu - Email Verification";
        String body = "Dear User,\n\n" +
                "Thank you for registering with PharmaSetu Online Pharmacy App.\n\n" +
                "Please verify your email address by clicking the link below:\n" +
                verificationUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not register for this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "PharmaSetu Team";

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendBaseUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;
        String subject = "PharmaSetu - Password Reset Request";
        String body = "Dear User,\n\n" +
                "We received a request to reset your password.\n\n" +
                "Please click the link below to reset your password:\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "PharmaSetu Team";

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send welcome email after email verification
     */
    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to PharmaSetu!";
        String body = "Dear " + name + ",\n\n" +
                "Your email has been successfully verified!\n\n" +
                "You can now log in to PharmaSetu Online Pharmacy App.\n\n" +
                "Best regards,\n" +
                "PharmaSetu Team";

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send order receipt email
     */
    public void sendOrderReceiptEmail(String toEmail, String customerName, String orderId, 
                                    String paymentId, String paymentMethod, List<String> itemNames, Double totalAmount) {
        String subject = "PharmaSetu - Order Receipt #" + orderId;
        String body = "Dear " + customerName + ",\n\n" +
                "Thank you for your order with PharmaSetu!\n\n" +
                "Order Details:\n" +
                "Order ID: " + orderId + "\n" +
                "Payment ID: " + paymentId + "\n" +
                "Payment Method: " + paymentMethod + "\n" +
                "Items: " + String.join(", ", itemNames) + "\n" +
                "Total Amount: ₹" + totalAmount + "\n\n" +
                "Your order has been confirmed and will be processed shortly.\n\n" +
                "Best regards,\n" +
                "PharmaSetu Team";

        sendEmail(toEmail, subject, body);
    }

    /**
     * Utility method to send email using MimeMessage (HTML-friendly) with fallback
     */
    private void sendEmail(String toEmail, String subject, String body) {
        // Temporarily disabled email sending due to Gmail blocking localhost emails
        // In production, use a proper email service like SendGrid, AWS SES, etc.
        System.out.println("=== EMAIL WOULD BE SENT ===");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
        System.out.println("=========================");
        
        // For development, we'll just log the email content
        // The password reset token is still generated and stored in database
    }
}
