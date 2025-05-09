package com.example.news.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
public class KakaoUnlinkService {

    private static final String UNLINK_URL = "https://kapi.kakao.com/v1/user/unlink";

    public boolean unlinkKakaoUser(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBearerAuth(accessToken);  // Authorization: Bearer {access_token}

            HttpEntity<String> request = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    UNLINK_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            log.info("카카오 연결 해제 응답: {}", response.getBody());
            return response.getStatusCode() == HttpStatus.OK;

        } catch (Exception e) {
            log.error("카카오 연결 해제 실패", e);
            return false;
        }
    }
}
