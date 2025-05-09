package com.example.news.controller;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User oAuth2User, Principal principal) {
        // 기본 로그인
        if (oAuth2User != null) {
            Map<String, Object> attr = oAuth2User.getAttributes();
            log.info("✅ OAuth 로그인 유저 정보: {}", attr);

            // 네이버 로그인 시 응답은 {"response": { ... }} 구조
            if (attr.containsKey("response")) {
                Map<String, Object> response = (Map<String, Object>) attr.get("response");
                return ResponseEntity.ok(Map.of(
                        "name", response.get("name"),
                        "email", response.get("email")
                ));
            }

            // 일반 OAuth 구조 (예: 구글, 깃허브 등)
            return ResponseEntity.ok(Map.of(
                    "name", attr.get("name"),
                    "email", attr.get("email")
            ));
        }

        // 일반 로그인
        if (principal != null) {
            return ResponseEntity.ok(Map.of(
                    "name", principal.getName()
            ));
        }

        // 로그인 안 된 경우
        return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
    }
}