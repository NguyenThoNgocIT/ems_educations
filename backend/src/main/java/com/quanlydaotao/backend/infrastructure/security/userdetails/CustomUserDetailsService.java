package com.quanlydaotao.backend.infrastructure.security.userdetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Inject UserRepository here later

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Will implement fetching from DB later
        // Returning dummy for successful bean creation right now
        return new CustomUserDetails("dummyId", username, "dummyPassword", new ArrayList<>());
    }
}

