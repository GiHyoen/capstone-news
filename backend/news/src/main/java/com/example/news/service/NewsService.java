
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
    private final String PYTHON_PATH = "/Library/Frameworks/Python.framework/Versions/3.13/bin/python3";
    private final String CRAWL_SCRIPT = "/Users/gihyeon/Documents/github/capstone-news/real_time_crawling/crawling.py";
    private final String SUMMARY_SCRIPT = "/Users/gihyeon/Documents/github/capstone-news/real_time_crawling/summarize.py";
    private final String DATA_DIR = "/Users/gihyeon/Downloads/news_crawling/";

    public ResponseEntity<?> searchNews(String query) {
        try {
            String safeQuery = query.replaceAll("[^\\w\\s가-힣-]", "").trim();
            if (safeQuery.isEmpty()) {
                throw new IllegalArgumentException("❌ 검색어가 유효하지 않습니다: " + query);
            }

            // 크롤링 실행
            ProcessBuilder crawlPb = new ProcessBuilder(PYTHON_PATH, CRAWL_SCRIPT, query);
            crawlPb.redirectErrorStream(true);
            Process crawlProcess = crawlPb.start();
            BufferedReader crawlReader = new BufferedReader(new InputStreamReader(crawlProcess.getInputStream()));
            String line;
            while ((line = crawlReader.readLine()) != null) {
                System.out.println("🐍 [CRAWLING] " + line);
            }
            crawlProcess.waitFor();

            // 요약 실행
            ProcessBuilder summaryPb = new ProcessBuilder(PYTHON_PATH, SUMMARY_SCRIPT, query);
            summaryPb.redirectErrorStream(true);
            Process summaryProcess = summaryPb.start();
            BufferedReader summaryReader = new BufferedReader(new InputStreamReader(summaryProcess.getInputStream()));
            while ((line = summaryReader.readLine()) != null) {
                System.out.println("🧠 [SUMMARY] " + line);
            }
            summaryProcess.waitFor();

            String filePath = DATA_DIR + safeQuery + "_naver_news.json";
            if (!Files.exists(Paths.get(filePath))) {
                throw new RuntimeException("뉴스 JSON 파일을 찾을 수 없습니다: " + filePath);
            }

            String json = Files.readString(Paths.get(filePath));
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> articles = objectMapper.readValue(json, List.class);

            return ResponseEntity.ok(articles);

        } catch (Exception e) {
            log.error("❌ 뉴스 검색 중 오류 발생", e);
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "뉴스 검색 중 오류 발생: " + e.getMessage()));
        }
    }
}
