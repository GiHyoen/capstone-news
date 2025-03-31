package com.example.news.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        HttpSecurity httpSecurity = http
                .csrf().disable() // CSRF 보호 비활성화
                .cors().and()     // CORS 활성화 (WebConfig랑 연결)
                .authorizeHttpRequests((authz) -> authz
                        .anyRequest().permitAll() // 모든 요청 허용
                );
        return http.build();
    }
}