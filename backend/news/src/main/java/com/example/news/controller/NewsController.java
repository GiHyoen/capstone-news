package com.example.news.controller;

import com.example.news.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {

    private final NewsService newsService;

    @GetMapping("/search")
    public ResponseEntity<?> searchNews(@RequestParam String query) {
        String jsonResult = newsService.searchNews(query);
        return ResponseEntity.ok(jsonResult);
    }
}