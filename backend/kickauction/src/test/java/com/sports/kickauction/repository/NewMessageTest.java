package com.sports.kickauction.repository;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;

@SpringBootTest
@Transactional
@Rollback(false) 
public class NewMessageTest {

     @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Test
    public void insertDummyMessages() {
        Member member2 = memberRepository.findById(2L).orElseThrow();
        Member member5 = memberRepository.findById(5L).orElseThrow();
        Member member13 = memberRepository.findById(13L).orElseThrow();
        Member member9 = memberRepository.findById(9L).orElseThrow();
        Member member14 = memberRepository.findById(14L).orElseThrow();

        List<Message> messages = List.of(
            createMessage(member14, member2, "몰라 토욜날 선우데리고 7시 ㄱㄱ",true, LocalDateTime.of(2025, 7, 1, 9, 43, 22)),
            createMessage(member2, member14, "조축아저씨들 ㅈㄴ잘하는디",true, LocalDateTime.of(2025, 7, 1, 9, 43, 45)),
            createMessage(member14, member2, "배고파",false, LocalDateTime.of(2025, 7, 1, 9, 45, 30)),
            createMessage(member2, member14, "ㄹㅇ", false,LocalDateTime.of(2025, 7, 1, 9, 49, 30)),
            createMessage(member2, member14, "ㅋㅋㅋㅋ", false,LocalDateTime.of(2025, 7, 1, 9, 49, 34)),
            createMessage(member13, member14, "님아", false,LocalDateTime.of(2025, 7, 1, 14, 51, 34)),
            createMessage(member9, member14, "[킥옥션 자동발송]\n<제안자닉네임>님이 <order>건에 대해 <가격>으로 새롭게 제안했어요.", false,LocalDateTime.of(2025, 7, 2, 8, 16, 55))
        );

        messageRepository.saveAll(messages);
    }

    private Message createMessage(Member sender, Member receiver,String content, boolean isRead, LocalDateTime sentAt) {
        return Message.builder()
            .sender(sender)
            .receiver(receiver)
            .content(content)
            .isRead(false)
            .deletedBySender(false)
            .deletedByReceiver(false)
            .sentAt(sentAt)
            .build();
    }
}