package com.example.news.controller;

import com.example.news.service.AuthService;
import com.example.news.service.KakaoUnlinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final KakaoUnlinkService kakaoUnlinkService; // ✅ 추가된 서비스 주입

    // ✅ 일반 로그인
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        boolean success = authService.login(username, password);
        if (success) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    }

    // ✅ 카카오 연결 해제 API
    @PostMapping("/kakao/logout")
    public ResponseEntity<String> kakaoLogout(@RequestHeader("Authorization") String bearerToken) {
        String accessToken = bearerToken.replace("Bearer ", "");

        boolean result = kakaoUnlinkService.unlinkKakaoUser(accessToken);
        if (result) {
            return ResponseEntity.ok("카카오 연결 해제 완료");
        } else {
            return ResponseEntity.status(500).body("카카오 연결 해제 실패");
        }
    }

    // ✅ OAuth2 로그인 성공 시 사용자 정보 반환
    @GetMapping("/login/oauth2/success")
    public ResponseEntity<?> oauthLoginSuccess(@AuthenticationPrincipal OAuth2User oauthUser) {
        Map<String, Object> attributes = oauthUser.getAttributes();

        // 네이버의 경우 사용자 정보는 "response" 키 안에 있음
        if (attributes.containsKey("response")) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            return ResponseEntity.ok(response);
        }

        // 페이스북 등 다른 제공자의 경우 바로 attributes 사용
        return ResponseEntity.ok(attributes);
    }
}
