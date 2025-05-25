package com.example.news.controller;

import com.example.news.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ 사용자 정보 반환 (OAuth 또는 일반 로그인 모두 대응)
    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(@AuthenticationPrincipal OAuth2User oAuth2User,
                                         Principal principal,
                                         HttpSession session) {
        if (oAuth2User != null) {
            Map<String, Object> attr = oAuth2User.getAttributes();
            log.info("OAuth 로그인 유저 정보: {}", attr);

            String username = "사용자";

            if (attr.containsKey("response")) {
                Map<String, Object> response = (Map<String, Object>) attr.get("response");
                username = (String) response.getOrDefault("nickname", response.get("name"));
            } else if (attr.containsKey("kakao_account")) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) attr.get("kakao_account");
                if (kakaoAccount.containsKey("profile")) {
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    username = (String) profile.getOrDefault("nickname", "카카오사용자");
                }
            } else if (attr.containsKey("username")) {
                username = (String) attr.get("username");
            } else if (attr.containsKey("name")) {
                username = (String) attr.get("name");
            }

            return ResponseEntity.ok(Map.of("username", username));
        }

        if (principal != null) {
            return ResponseEntity.ok(Map.of("username", principal.getName()));
        }

        Object sessionUser = session.getAttribute("user");
        if (sessionUser != null) {
            return ResponseEntity.ok(Map.of("username", sessionUser.toString()));
        }

        return ResponseEntity.status(401).body("로그인된 사용자가 없습니다.");
    }

    // ✅ 일반 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        String username = request.get("username");
        String password = request.get("password");

        log.info("일반 로그인 시도: 아이디={}, 비밀번호={}", username, password);

        boolean authenticated = userService.authenticate(username, password);
        if (!authenticated) {
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContextHolder.getContext().setAuthentication(auth);

        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                new SecurityContextImpl(auth)
        );

        return ResponseEntity.ok("로그인 성공");
    }

    // ✅ 아이디 중복 확인
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean isDuplicate = userService.isUsernameTaken(username);
        if (isDuplicate) {
            return ResponseEntity.status(409).body("이미 사용 중인 아이디입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 아이디입니다.");
        }
    }

    // ✅ 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("아이디와 비밀번호를 모두 입력해야 합니다.");
        }

        try {
            userService.signup(username, password);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
        }
    }
}