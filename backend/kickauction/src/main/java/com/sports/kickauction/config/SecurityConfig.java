package com.sports.kickauction.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.sports.kickauction.service.MemberDetailsService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final MemberDetailsService memberDetailsService;

    // 주석: 비밀번호 암호화 BCryptPasswordEncoder 
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 주석: CSRF 및 기능 권한 
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // 주석: csrf - test단계 비활성화 
            // .csrf(csrf -> csrf
            // .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
    "/", "/login", "/signup", "/presignup", "/signups",
    "/api/**",
    "/css/**", "/js/**", "/images/**", "/static/**", "/favicon.ico",
    "/**" //  React 모든 라우트 허용!
).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(login -> login
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
            );

        return http.build();
    }

    // 주석: UserDetailsService 등록
    @Bean
    public UserDetailsService userDetailsService() {
        return memberDetailsService;
    }


     @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 프론트 개발 서버 주소
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowCredentials(true);
        // 허용 HTTP 메서드
        config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        // 허용 헤더
        config.setAllowedHeaders(Arrays.asList("*"));
        // 쿠키 전송 허용하려면 true
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 /api/** 경로에 위 정책 적용
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}