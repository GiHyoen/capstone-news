package com.example.news.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NewsService {

    private final String PYTHON_PATH = "/usr/local/bin/python3";
    private final String SCRIPT_PATH = "/Users/gihyeon/Documents/github/capstone-news/real_time_crawling/crawling.py";
    private final String DATA_DIR = "/Users/gihyeon/Documents/github/news_crawling/";

    public ResponseEntity<?> searchAndSummarizeNews(String query) {
        try {
            // ✅ 전체 기사 50개 수집
            List<Map<String, Object>> articles = crawlFromNaver(query);

            // ✅ 전체 기사 리스트를 FastAPI에 전송
            Map<String, Object> requestBody = Map.of("articles", articles);
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonPayload = objectMapper.writeValueAsString(requestBody);
            log.info("최종 jsonPayload: {}", jsonPayload);

            HttpClient client = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:8000/api/summarize"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            return ResponseEntity
                    .status(response.statusCode())
                    .body(objectMapper.readValue(response.body(), Map.class));

        } catch (Exception e) {
            log.error("searchAndSummarizeNews 실패", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ page, size 제거된 최종 크롤링 함수
    private List<Map<String, Object>> crawlFromNaver(String query) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(PYTHON_PATH, SCRIPT_PATH, query);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                log.info("[CRAWLING] {}", line);
            }
        }

        int exitCode = process.waitFor();
        log.info(">>> crawling.py 종료 코드: {}", exitCode);

        String filename = query.replaceAll("[^\\w가-힣]", "").trim() + "_naver_news.json";
        Path filePath = Paths.get(DATA_DIR + filename);

        if (!Files.exists(filePath)) {
            throw new RuntimeException("뉴스 JSON 파일이 존재하지 않습니다: " + filePath);
        }

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String, Object>> allArticles = mapper.readValue(Files.readString(filePath), List.class);

        return allArticles.stream()
                .limit(50)
                .map(article -> {
                    Map<String, Object> filtered = new HashMap<>();
                    filtered.put("cnt", article.getOrDefault("cnt", 0));
                    filtered.put("title", article.getOrDefault("title", ""));
                    filtered.put("description", article.getOrDefault("description", ""));
                    filtered.put("org_link", article.getOrDefault("org_link", ""));
                    filtered.put("link", article.getOrDefault("link", ""));
                    filtered.put("pDate", article.getOrDefault("pDate", ""));
                    filtered.put("image", article.getOrDefault("image", ""));
                    return filtered;
                })
                .collect(Collectors.toList());
    }
}