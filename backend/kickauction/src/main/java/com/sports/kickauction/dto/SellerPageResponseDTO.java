package com.sports.kickauction.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class SellerPageResponseDTO<E> {

    private List<E> dtoList;

    private int totalPage;
    private int currentPage;
    private int size;
    private int totalCount;

    private boolean prev;
    private boolean next;

    private List<Integer> pageList;

    @Builder
    public SellerPageResponseDTO(List<E> dtoList, SellerPageRequestDTO sellerPageRequestDTO, long totalCount) {
        this.dtoList = dtoList;
        this.totalCount = (int) totalCount;
        this.size = sellerPageRequestDTO.getSize();
        this.currentPage = sellerPageRequestDTO.getPage();

        this.totalPage = (int) Math.ceil((double) totalCount / size);

        int tempEnd = (int)(Math.ceil(currentPage / 10.0)) * 10;
        int start = tempEnd - 9;
        int end = Math.min(totalPage, tempEnd);

        this.prev = start > 1;
        this.next = totalPage > tempEnd;

        this.pageList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
    }
}
