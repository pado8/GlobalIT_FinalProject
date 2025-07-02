package com.sports.kickauction.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sports.kickauction.dto.ReviewDTO;
import com.sports.kickauction.dto.SellerReviewReadDTO;
import com.sports.kickauction.service.ReviewService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ReviewDTO dto) {
        service.register(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{mno}")
    public ResponseEntity<Page<SellerReviewReadDTO>> getReviewsBySeller(
        @PathVariable Long mno,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("regdate").descending());
        return ResponseEntity.ok(service.getReviewsBySeller(mno, pageable));
    }

}
