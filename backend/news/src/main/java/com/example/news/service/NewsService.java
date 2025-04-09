package com.example.news.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NewsService {

    // ✅ 파이썬 스크립트 경로
    private final String PYTHON_PATH = "/usr/local/bin/python3"; // 또는 python3 경로 확인해서 수정
    private final String SCRIPT_PATH = "/Users/gihyeon/Downloads/news_crawling/crawling.py";

    // ✅ JSON 파일이 저장된 디렉토리
    private final String DATA_DIR = "/Users/gihyeon/Downloads/news_crawling/";

    public String searchNews(String query) {
        try {
            // ✅ 파이썬 스크립트 실행
            ProcessBuilder pb = new ProcessBuilder(PYTHON_PATH, SCRIPT_PATH);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // ✅ 입력값 전달 (query를 파이썬 input으로 넘김)
            process.getOutputStream().write((query + "\n").getBytes());
            process.getOutputStream().flush();

            // ✅ 출력 로그 보기
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("🐍 PYTHON: " + line);
            }

            process.waitFor(); // 실행 완료 대기

            // ✅ 크롤링된 json 파일 읽기
            String fileName = query + "_naver_news.json";
            String filePath = DATA_DIR + fileName;

            return Files.readString(Paths.get(filePath));

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"뉴스 검색 중 오류 발생: " + e.getMessage() + "\"}";
        }
    }
}