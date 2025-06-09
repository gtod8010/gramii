"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  avatar: string;
}

const initialMessages: Message[] = [
  { id: 1, text: '인스타그램팔로워늘리기를 주문했어요! 작업 소요 시간이 궁금합니다!', sender: 'user', avatar: '/images/user/user-03.jpg' },
  { id: 2, text: '안녕하세요. GRAMII 입니다! 주문 후 평균 1분 ~60분 내 자동으로 작업이 시작됩니다.', sender: 'support', avatar: '/images/user/user-05.jpg' },
  { id: 3, text: '처음 주문하는건데 인스타팔로워구매는 안전한가요?', sender: 'user', avatar: '/images/user/user-03.jpg' },
  { id: 4, text: '계정에 무리가 가지 않는 방향으로 테스트를 거친 후 서비스가 진행되기 때문에 안심하셔도 됩니다 :)', sender: 'support', avatar: '/images/user/user-05.jpg' },
  { id: 5, text: '친절한 답변 감사합니다! 빠르게 인스타 팔로워 늘리는법이 있을까요?', sender: 'user', avatar: '/images/user/user-03.jpg' },
];

const ChatSimulation: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    if (messages.length === initialMessages.length) return;

    const timers = initialMessages.map((msg, index) => 
      setTimeout(() => {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) {
            return prev;
          }
          return [...prev, msg];
        });
      }, index * 2000) // 애니메이션 간격을 2초로 늘려 자연스럽게
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [messages.length]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-5">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end gap-3 animate-fade-in-up ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.sender === 'support' && (
            <Image 
              src={message.avatar} 
              alt="Support Avatar" 
              width={48} 
              height={48}
              className="rounded-full"
            />
          )}
          <div
            className={`rounded-xl px-5 py-3 max-w-md shadow-md ${
              message.sender === 'user'
                ? 'bg-black text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            <p className="text-base">{message.text}</p>
          </div>
           {message.sender === 'user' && (
            <Image 
              src={message.avatar} 
              alt="User Avatar" 
              width={48} 
              height={48}
              className="rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatSimulation; 
