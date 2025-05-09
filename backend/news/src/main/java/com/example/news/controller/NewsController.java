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
        return newsService.searchNews(query); // ✔️ 그대로 return
    }

}