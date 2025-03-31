package com.example.news.service;

import com.example.news.entity.User;
import com.example.news.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void register(String username, String rawPassword) {
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User(username, encodedPassword);
        userRepository.save(user);
    }
}