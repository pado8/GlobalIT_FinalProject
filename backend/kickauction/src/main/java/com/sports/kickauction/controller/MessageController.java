package com.sports.kickauction.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sports.kickauction.dto.MessageDTO;
import com.sports.kickauction.dto.MessageRoomDTO;
import com.sports.kickauction.entity.Member;
import com.sports.kickauction.entity.Message;
import com.sports.kickauction.service.MemberDetails;
import com.sports.kickauction.service.MemberService;
import com.sports.kickauction.service.MessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final MemberService memberService;

    // 쪽지 보내기
    @PostMapping
    public ResponseEntity<?> sendMessage(
            Principal principal,
            @RequestParam Long receiverId,
            @RequestParam String content
    ) {
        Member sender = memberService.findByUserId(principal.getName());
        Member receiver = memberService.findById(receiverId);
        if (receiver == null) {
            return ResponseEntity.badRequest().body("수신자를 찾을 수 없습니다.");
        }
        Message saved = messageService.sendMessage(sender, receiver, content);
        return ResponseEntity.ok(saved);
    }

    // 1:1 대화내역 조회 (나-상대방)
    @GetMapping("/dialog")
    public ResponseEntity<?> getDialog(
            Principal principal,
            @RequestParam Long target // 상대 mno
    ) {
        Member me = memberService.findByUserId(principal.getName());
        Member targetUser = memberService.findById(target);
        if (targetUser == null) {
            return ResponseEntity.badRequest().body("상대방을 찾을 수 없습니다.");
        }
        List<Message> dialog = messageService.getDialog(me, targetUser);
        // 👇 여기서 엔티티 → DTO로 변환!
        List<MessageDTO> dtoList = dialog.stream()
            .map(msg -> {
                MessageDTO dto = new MessageDTO();
                dto.setMsgId(msg.getMsgId());
                dto.setContent(msg.getContent());
                dto.setSentAt(msg.getSentAt());
                dto.setSenderId(msg.getSender().getMno());
                dto.setReceiverId(msg.getReceiver().getMno());
                // 필요하면 추가 필드
                return dto;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    // 받은 쪽지함
    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox(Principal principal) {
        Member me = memberService.findByUserId(principal.getName());
        List<Message> inbox = messageService.getInbox(me);
        return ResponseEntity.ok(inbox);
    }

    // 보낸 쪽지함
    @GetMapping("/outbox")
    public ResponseEntity<?> getOutbox(Principal principal) {
        Member me = memberService.findByUserId(principal.getName());
        List<Message> outbox = messageService.getOutbox(me);
        return ResponseEntity.ok(outbox);
    }

    // 쪽지 삭제 (내가 보낸 쪽지/받은 쪽지 구분)
    @DeleteMapping("/{msgId}")
    public ResponseEntity<?> deleteMessage(
            Principal principal,
            @PathVariable Long msgId,
            @RequestParam String type // sender | receiver
    ) {
        Member me = memberService.findByUserId(principal.getName());
        boolean isSender = "sender".equals(type);
        messageService.deleteMessage(msgId, me, isSender);
        return ResponseEntity.ok("삭제되었습니다.");
    }


    // 채팅방 열면 채팅기록 불러오기
    @GetMapping("/rooms")
    public ResponseEntity<?> getMyMessageRooms(Principal principal) {
        Member me = memberService.findByUserId(principal.getName());
        List<MessageRoomDTO> rooms = messageService.getAllRoomsForMember(me.getMno());
        return ResponseEntity.ok(rooms);
    }

    // 닉네임 검색 후 채팅시작
    @GetMapping("/find-user")
    public ResponseEntity<?> findUserByNickname(@RequestParam String nickname) {
        if (nickname == null || nickname.isBlank()) {
            return ResponseEntity.badRequest().body("닉네임이 필요합니다.");
        }

        // 🔒 인증 정보에서 principal 꺼냄
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // ✅ 로그인 여부 확인
        if (principal == null || principal.equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // 🧠 principal이 Member인지 확인 후 캐스팅
        Member me;
        try {
            me = (Member) principal;
        } catch (ClassCastException e) {
            return ResponseEntity.status(500).body("인증 정보가 Member 형식이 아닙니다.");
        }

        Optional<Member> optional = memberService.findByUserName(nickname);
        if (optional.isEmpty() || optional.get().getMno().equals(me.getMno())) {
        return ResponseEntity.status(404).body("대상을 찾을 수 없습니다.");
        }
        Member found = optional.get();

        return ResponseEntity.ok(Map.of(
            "mno", found.getMno(),
            "user_name", found.getUserName(),
            "profileimg", found.getProfileimg()
        ));
    }
}