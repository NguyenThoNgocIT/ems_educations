package com.quanlydaotao.backend;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    @Test
    public void testHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "123456";
        String hash = encoder.encode(password);
        System.out.println("--- BCRYPT RESULT START ---");
        System.out.println("Password: " + password);
        System.out.println("New Hash: " + hash);
        
        String oldHash = "$2a$10$7R9M6Yv3E1Ff7M8Xf9T6e.Pz/V5/L9FzM6Yv3E1Ff7M8Xf9T6e.Pz";
        System.out.println("Matches old hash: " + encoder.matches(password, oldHash));
        System.out.println("--- BCRYPT RESULT END ---");
    }
}
