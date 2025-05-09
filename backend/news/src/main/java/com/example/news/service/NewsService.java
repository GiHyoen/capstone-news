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

    // ✅ 파이썬 실행 파일 경로
    private final String PYTHON_PATH = "C:/Users/cptai/AppData/Local/Microsoft/WindowsApps/python3.exe";

    // ✅ 파이썬 크롤링 스크립트 경로
    private final String SCRIPT_PATH = "C:/Users/cptai/OneDrive/Desktop/GitHub/capstone-news/real_time_crawling/crawling.py";

    // ✅ 크롤링 결과 JSON 파일이 저장된 폴더 경로
    private final String DATA_DIR = "C:/Users/cptai/OneDrive/Desktop/GitHub/capstone-news/real_time_crawling/";

    public ResponseEntity<?> searchNews(String query) {
        try {
            // ✅ 파이썬 스크립트 실행
            ProcessBuilder pb = new ProcessBuilder(PYTHON_PATH, SCRIPT_PATH);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // ✅ 검색어를 파이썬 스크립트로 전달
            process.getOutputStream().write((query + "\n").getBytes());
            process.getOutputStream().flush();

            // ✅ 파이썬 출력 로그 읽기
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("🐍 PYTHON: " + line);
            }

            process.waitFor(); // 실행 종료까지 대기

            //  생성된 JSON 파일 경로
            String fileName = query + "_naver_news.json";
            String filePath = DATA_DIR + fileName;

            //  JSON 문자열 읽기
            String json = Files.readString(Paths.get(filePath));

            //  JSON 문자열을 List로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> articles = objectMapper.readValue(json, List.class);

            // ✅ 배열 그대로 응답
            return ResponseEntity.ok(articles);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of("error", "뉴스 검색 중 오류 발생: " + e.getMessage()));
        }
    }
}
