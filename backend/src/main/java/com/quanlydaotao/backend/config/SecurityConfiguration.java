package com.quanlydaotao.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static com.quanlydaotao.backend.user.Permission.ADMIN_CREATE;
import static com.quanlydaotao.backend.user.Permission.ADMIN_DELETE;
import static com.quanlydaotao.backend.user.Permission.ADMIN_READ;
import static com.quanlydaotao.backend.user.Permission.ADMIN_UPDATE;
import static com.quanlydaotao.backend.user.Permission.MANAGER_CREATE;
import static com.quanlydaotao.backend.user.Permission.MANAGER_DELETE;
import static com.quanlydaotao.backend.user.Permission.MANAGER_READ;
import static com.quanlydaotao.backend.user.Permission.MANAGER_UPDATE;
import static com.quanlydaotao.backend.user.Role.ADMIN;
import static com.quanlydaotao.backend.user.Role.MANAGER;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {"/api/v1/auth/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/",
            "/api/auth/**"};
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                .requestMatchers(GET, "/api/v1/admin/lecturers/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(GET, "/api/v1/admin/course-classes/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(GET, "/api/v1/admin/lecturer-course-classes/by-lecturer/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(GET, "/api/v1/admin/schedules/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers("/api/v1/admin/grade-scales/**").hasRole("ADMIN")
                                .requestMatchers("/api/v1/admin/settings/**").hasRole("ADMIN")
                                .requestMatchers("/api/v1/admin/logs/**").hasRole("ADMIN")
                                .requestMatchers(GET, "/api/v1/admin/student-grades/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(POST, "/api/v1/admin/student-grades/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(PUT, "/api/v1/admin/student-grades/**").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers(PATCH, "/api/v1/admin/student-grades/*/lock").hasAnyRole("ADMIN", "TEACHER")
                                .requestMatchers("/api/v1/admin/users/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers("/api/v1/admin/students/**").hasAnyRole("ADMIN", "MANAGER")
                                .requestMatchers("/api/v1/student/grades/**").hasRole("STUDENT")
                                .requestMatchers("/api/v1/notifications/**").authenticated()
                                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/v1/teacher/**").hasRole("TEACHER")
                                .requestMatchers("/api/v1/student/**").hasRole("STUDENT")
                                .requestMatchers("/api/v1/manager/**").hasRole("MANAGER")
                                .requestMatchers("/api/v1/consultant/**").hasRole("CONSULTANT")
                                .requestMatchers("/api/v1/parent/**").hasRole("PARENT")
                                .requestMatchers("/api/v1/management/**").hasAnyRole(ADMIN.name(), MANAGER.name())
                                .requestMatchers(GET, "/api/v1/management/**").hasAnyAuthority(ADMIN_READ.name(), MANAGER_READ.name())
                                .requestMatchers(POST, "/api/v1/management/**").hasAnyAuthority(ADMIN_CREATE.name(), MANAGER_CREATE.name())
                                .requestMatchers(PUT, "/api/v1/management/**").hasAnyAuthority(ADMIN_UPDATE.name(), MANAGER_UPDATE.name())
                                .requestMatchers(DELETE, "/api/v1/management/**").hasAnyAuthority(ADMIN_DELETE.name(), MANAGER_DELETE.name())
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
        ;

        return http.build();
    }
}
