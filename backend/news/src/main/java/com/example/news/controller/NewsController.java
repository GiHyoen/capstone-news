package com.example.news.controller;

import com.example.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/search")
    public ResponseEntity<?> searchNews(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        log.info("뉴스 검색 요청: query={}, page={}, size={}", query, page, size);
        return newsService.searchNews(query, page, size);
    }
}


