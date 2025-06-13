"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaStar, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';

interface Review {
  id: number;
  avatar: string;
  name: string;
  service: string;
  serviceIcon: React.ElementType;
  rating: number;
  text: string;
}

const reviewsData: Review[] = [
  { id: 1, avatar: '/images/user/user-01.jpg', name: 'lulu**', service: '인스타', serviceIcon: FaInstagram, rating: 5, text: '그래미를 통해 인스타그램 셀프 마케팅을 처음 해봤는데, 생각보다 훨씬 쉬웠고 효과도 빨랐어요. 좋아요와 저장 수가 확 올라가더니, 며칠 안 돼서 인기 게시물에 노출되었고 피드 방문자 수가 급증했어요. 그전엔 그냥 올리기만 했는데, 그래미 덕분에 피드가 진짜 \'완성\'이 되더라고요.' },
  { id: 2, avatar: '/images/user/user-02.jpg', name: 'hisn**', service: '네이버 플레이스', serviceIcon: SiNaver, rating: 5, text: '그래미에서 네이버 플레이스 마케팅 서비스를 이용했는데, 진짜 효과가 좋았어요. 업체명, 키워드 등록 후 한 달도 안 돼서 네이버 지도 검색 시 1페이지 상단 노출이 되었고, 자연 유입 방문자 수가 크게 늘었습니다. 리뷰도 꾸준히 늘어나고 있어요. 매장 마케팅은 이제 그래미로 정착했어요.' },
  { id: 3, avatar: '/images/user/user-03.jpg', name: 'seoy**', service: '유튜브', serviceIcon: FaYoutube, rating: 5, text: '그래미를 이용해서 유튜브 셀프 마케팅을 했더니 구독자 수가 눈에 띄게 늘었어요. 특히 영상 업로드 직후 조회수와 좋아요 수를 집중적으로 끌어올렸더니, 알고리즘에 반응이 왔는지 추천 영상에 노출되었고, 짧은 시간 안에 구독자가 300명 넘게 늘었습니다.' },
  { id: 4, avatar: '/images/user/user-04.jpg', name: 'revi**', service: '네이버 쇼핑', serviceIcon: SiNaver, rating: 5, text: '그래미를 통해 네이버 쇼핑 마케팅을 해봤는데, 확실히 조회수랑 클릭 수부터 다르더라고요. 이전에는 노출도 안 되던 제품이 상위권에 올라오면서 판매가 바로 일어났고, 일 매출이 3배 넘게 증가했어요. 쇼핑몰 운영하는 분들 진심 강추합니다.' },
  { id: 5, avatar: '/images/user/user-05.jpg', name: 'tedi**', service: '인스타', serviceIcon: FaInstagram, rating: 5, text: '혼자서 마케팅하려니 늘 막막했는데, 그래미는 필요한 기능만 딱딱 골라 쓸 수 있어서 좋았어요. 셀프 좋아요, 저장, 댓글 기능을 활용했더니 해시태그 타고 들어오는 유입이 많아졌고, 그 결과로 게시물 2개가 동시에 인기탭에 올라갔어요. SNS 운영에 자신감 생겼어요!' },
  { id: 6, avatar: '/images/user/user-06.jpg', name: 'jason**', service: '틱톡', serviceIcon: FaTiktok, rating: 5, text: '틱톡은 바이럴이 중요한데, 그래미로 조회수를 집중적으로 올렸더니 완전 다른 반응이 오더라고요. 평소엔 500~1000뷰 나오던 영상이 2만 뷰 이상 나오고, 팔로워도 하루 만에 300명 늘었어요. 수익화도 빠르게 열렸고 지금은 매 영상이 안정적으로 수익을 가져다줘요.'},
  { id: 7, avatar: '/images/user/user-01.jpg', name: 'owner**', service: '네이버 플레이스', serviceIcon: SiNaver, rating: 5, text: '지역 소상공인이라 홍보가 늘 고민이었는데, 그래미의 플레이스 마케팅을 신청한 뒤로 매출 흐름이 달라졌어요.'},
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center text-cyan-400">
        {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className="w-5 h-5" />
        ))}
        <span className="ml-2 text-lg font-bold text-cyan-400">{rating}</span>
    </div>
);

const ReviewCard: React.FC<{ review: Review; isVisible: boolean; index: number }> = ({ review, isVisible, index }) => (
    <div className={`bg-gray-200 p-6 rounded-2xl flex flex-col h-full shadow-lg transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${index * 100}ms` }}>
        <div className="flex items-center mb-4">
            <Image src={review.avatar} alt={`${review.name}'s avatar`} width={56} height={56} className="rounded-full mr-4 border-2 border-white" />
            <div className="flex-grow">
                <p className="font-bold text-lg text-gray-900">{review.name}</p>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                    <review.serviceIcon className="mr-1.5" />
                    <span>{review.service}</span>
                </div>
            </div>
            <div className="ml-auto">
                <StarRating rating={review.rating} />
            </div>
        </div>
        <p className="text-gray-700 text-base flex-grow">{review.text}</p>
    </div>
);

const ReviewsSection: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const currentRef = sectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-gray-800 py-20 md:py-28">
            <div className="container mx-auto px-6 md:px-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        GRAMII는 지금 이 순간도
                        <br />
                        많은 브랜드와 <span className="text-cyan-400">함께 성장하고 있습니다.</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviewsData.map((review, index) => (
                        <ReviewCard key={review.id} review={review} isVisible={isVisible} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection; 
 