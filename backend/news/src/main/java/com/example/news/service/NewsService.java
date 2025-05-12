package com.example.news.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class NewsService {

    private final String PYTHON_PATH = "python3";
    private final String SCRIPT_PATH = "/Users/gihyeon/Documents/github/capstone-news/real_time_crawling/crawling.py";
    private final String DATA_DIR = "/Users/gihyeon/Downloads/news_crawling/";

    public ResponseEntity<?> searchNews(String query) {
        try {
            // ✅ 파이썬 스크립트 실행 (검색어 인자를 argv로 전달만 함)
            ProcessBuilder pb = new ProcessBuilder(PYTHON_PATH, SCRIPT_PATH, query);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // ✅ 파이썬 출력 로그 확인
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("🐍 PYTHON: " + line);
            }

            process.waitFor(); // 파이썬 실행 종료 대기

            // ✅ 생성된 파일 이름은 파이썬과 동일한 규칙이어야 함
            String safeQuery = query.replaceAll("[^\\w\\s가-힣-]", "").trim();
            if (safeQuery.isEmpty()) {
                throw new IllegalArgumentException("검색어가 비어 있습니다.");
            }

            String fileName = safeQuery + "_naver_news.json";
            String filePath = DATA_DIR + fileName;

            if (!Files.exists(Paths.get(filePath))) {
                throw new RuntimeException("뉴스 JSON 파일을 찾을 수 없습니다: " + filePath);
            }

            // ✅ JSON 읽기
            String json = Files.readString(Paths.get(filePath));
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> articles = objectMapper.readValue(json, List.class);

            return ResponseEntity.ok(articles);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "뉴스 검색 중 오류 발생: " + e.getMessage()));
        }
    }
}