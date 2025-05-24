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
        if (oAuth2User != null) {
            Map<String, Object> attr = oAuth2User.getAttributes();
            log.info("OAuth 로그인 유저 정보: {}", attr);

            String username = "사용자";

            // ✅ 네이버 로그인 처리
            if (attr.containsKey("response")) {
                Map<String, Object> response = (Map<String, Object>) attr.get("response");
                username = (String) response.getOrDefault("nickname", response.get("name"));
            }

            // ✅ 카카오 로그인 처리
            if (attr.containsKey("kakao_account")) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attr.get("kakao_account");
                if (kakaoAccount.containsKey("profile")) {
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    username = (String) profile.getOrDefault("nickname", "카카오사용자");
                }
            }

            // ✅ 기타 OAuth 제공자 (GitHub, Google 등)
            if (attr.containsKey("username")) {
                username = (String) attr.get("username");
            } else if (attr.containsKey("name")) {
                username = (String) attr.get("name");
            }

            return ResponseEntity.ok(Map.of("username", username));
        }

        // ✅ 일반 로그인 (Spring Security 세션 사용자)
        if (principal != null) {
            return ResponseEntity.ok(Map.of("username", principal.getName()));
        }

        return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
    }
}
