package com.example.news.controller;

import com.example.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/summarize")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsController {

    private final NewsService newsService;

    @PostMapping("/summarize")
    public ResponseEntity<?> summarizeNews(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("요청 수신: /api/summarize/summarize, query={}, page={}, size={}", query, page, size);
        return newsService.searchAndSummarizeNews(query, page, size);
    }
}