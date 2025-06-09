package com.example.news.controller;

import com.example.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/summarize")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsController {

    private final NewsService newsService;

    //  [1] URI 변경 권장: /summarize → /search로 (중복 단어 제거)
    //  [2] @GetMapping은 params에 긴 query 문자열 포함 시 가독성/제한 이슈 → @PostMapping 권장
    @PostMapping("/search")
    public ResponseEntity<?> summarizeNews(@RequestBody Map<String, String> body) {
        String query = body.get("query");
        log.info(" 요약 요청 수신: query={}", query);
        return newsService.searchAndSummarizeNews(query);
    }
}