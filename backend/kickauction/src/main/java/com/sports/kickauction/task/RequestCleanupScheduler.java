package com.sports.kickauction.task;

import com.sports.kickauction.repository.RequestRepository;
import com.sports.kickauction.repository.BizRepository;
import com.sports.kickauction.entity.Request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Component
@RequiredArgsConstructor
public class RequestCleanupScheduler {

    private final RequestRepository requestRepository;
    private final BizRepository bizRepository;

    @Scheduled(cron = "0 5 3 * * ?") 
    public void deleteExpiredCancelledOrders() {
        LocalDateTime now = LocalDateTime.now();
        List<Request> expired = requestRepository.findByFinishedAndOregdateBefore(2, now);
        if (!expired.isEmpty()) {
            // 1. 관련된 Biz 엔티티를 먼저 삭제합니다.
            List<Biz> bizsToDelete = expired.stream()
                .flatMap(order -> bizRepository.findByRequest_Ono(order.getOno()).stream())
                .collect(Collectors.toList());

            if (!bizsToDelete.isEmpty()) {
                bizRepository.deleteAllInBatch(bizsToDelete);
                log.info("삭제된 만료 취소 견적의 Biz 데이터 수: {}", bizsToDelete.size());
            }

            // 2. Request 엔티티를 삭제합니다.
            requestRepository.deleteAllInBatch(expired);
            log.info("삭제된 만료 취소 견적 수: {}", expired.size());
        } else {
            log.info("삭제할 만료 취소 견적 없음.");
        }
    }
}
