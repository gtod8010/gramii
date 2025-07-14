--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (21, '💚네이버', NULL, true, '2025-06-18 12:04:02.005766', '2025-06-18 12:04:02.005766', 2);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (20, '❤️유튜브', NULL, true, '2025-06-18 12:03:45.884638', '2025-06-18 12:03:45.884638', 3);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (22, '💜틱톡', NULL, true, '2025-06-18 12:04:19.87665', '2025-06-18 12:04:19.87665', 4);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (19, '💙페이스북', NULL, true, '2025-06-18 12:03:28.136387', '2025-06-18 12:03:28.136387', 5);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (18, '💗인스타그램', NULL, true, '2025-06-18 12:03:17.449068', '2025-06-18 12:07:35.646024', 1);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (24, '💛카카오톡', NULL, true, '2025-06-18 12:04:52.241019', '2025-06-18 12:04:52.241019', 7);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (25, '🖤스레드', NULL, true, '2025-06-18 12:05:25.869046', '2025-06-18 12:05:25.869046', 6);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (26, '🧡트위터', NULL, true, '2025-06-18 12:05:47.895024', '2025-06-18 12:05:47.895024', 8);
INSERT INTO public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) VALUES (23, '🤍웹사이트 트래픽', NULL, true, '2025-06-18 12:04:40.492162', '2025-06-18 12:05:12.514352', 9);


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (46, 18, '인스타 팔로워👨‍👩‍👧‍👦', NULL, true, '2025-06-18 12:08:02.486033', '2025-06-18 12:08:02.486033', 46);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (47, 18, '인스타 좋아요💘', NULL, true, '2025-06-18 12:08:06.572084', '2025-06-18 12:08:06.572084', 47);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (48, 18, '인스타 댓글💬', NULL, true, '2025-06-18 12:08:10.054103', '2025-06-18 12:08:10.054103', 48);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (49, 18, '인스타 인사이트🎫', NULL, true, '2025-06-18 12:08:24.106064', '2025-06-18 12:08:24.106064', 49);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (50, 18, '인스타 리그램 추천탭✨', NULL, true, '2025-06-18 12:08:32.062764', '2025-06-18 12:08:32.062764', 50);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (51, 18, '인스타그램 계정 육성 월관리🎢', NULL, true, '2025-06-18 12:08:50.422866', '2025-06-18 12:08:50.422866', 51);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (52, 19, '페이스북 페이지 좋아요+팔로워 서비스💎', NULL, true, '2025-06-18 12:09:08.264162', '2025-06-18 12:09:08.264162', 52);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (53, 19, ' 페이스북 프로필(개인계정) 팔로워 서비스🚏', NULL, true, '2025-06-18 12:09:51.084353', '2025-06-18 12:09:51.084353', 53);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (54, 19, ' 페이스북 게시물 좋아요 서비스🎉', NULL, true, '2025-06-18 12:10:11.751887', '2025-06-18 12:10:11.751887', 54);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (55, 19, '페이스북 게시물 댓글 서비스💬', NULL, true, '2025-06-18 12:10:24.790125', '2025-06-18 12:10:24.790125', 55);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (56, 20, '유튜브 동영상 조회수👁‍🗨', NULL, true, '2025-06-18 12:10:36.092359', '2025-06-18 12:10:36.092359', 56);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (57, 20, '유튜브 동영상 좋아요💕', NULL, true, '2025-06-18 12:10:56.482886', '2025-06-18 12:10:56.482886', 57);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (58, 20, '유튜브 채널 구독자👭', NULL, true, '2025-06-18 12:11:13.588204', '2025-06-18 12:11:13.588204', 58);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (59, 20, '유튜브 동영상 댓글💬', NULL, true, '2025-06-18 12:11:22.075759', '2025-06-18 12:11:22.075759', 59);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (60, 20, '유튜브 동영상 공유💫', NULL, true, '2025-06-18 12:11:39.407884', '2025-06-18 12:11:39.407884', 60);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (61, 20, '유튜브 라이브 시청자 서비스👁‍🗨', NULL, true, '2025-06-18 12:11:50.99261', '2025-06-18 12:11:50.99261', 61);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (64, 22, '틱톡 좋아요❤️', NULL, true, '2025-06-18 12:12:23.46767', '2025-06-18 12:12:23.46767', 64);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (65, 22, '틱톡 팔로워👨‍👩‍👧‍👦', NULL, true, '2025-06-18 12:12:28.366872', '2025-06-18 12:12:28.366872', 65);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (67, 26, '좋아요💙', NULL, true, '2025-06-18 12:12:59.402814', '2025-06-18 12:12:59.402814', 67);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (69, 26, '조회수👁‍🗨', NULL, true, '2025-06-18 12:13:20.797302', '2025-06-18 12:13:20.797302', 69);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (70, 26, '팔로워👨‍👩‍👧‍👦', NULL, true, '2025-06-18 12:13:28.128953', '2025-06-18 12:13:28.128953', 70);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (71, 24, '카카오톡 채널💡', NULL, true, '2025-06-18 12:15:45.943042', '2025-06-18 12:15:45.943042', 71);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (75, 21, '자동완성어🧩', NULL, true, '2025-06-18 12:19:39.899457', '2025-06-18 12:19:39.899457', 75);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (76, 21, '스마트스토어🎁', NULL, true, '2025-06-18 12:19:57.565692', '2025-06-18 12:19:57.565692', 76);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (77, 23, '웹사이트 트래픽 from 구글🧡', NULL, true, '2025-06-18 12:20:53.85382', '2025-06-18 12:20:53.85382', 77);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (78, 23, '웹사이트 트래픽 from 페이스북💙', NULL, true, '2025-06-18 12:21:01.862458', '2025-06-18 12:21:01.862458', 78);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (79, 23, '웹사이트 트래픽 from 인스타그램💗', NULL, true, '2025-06-18 12:21:07.453673', '2025-06-18 12:21:07.453673', 79);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (80, 23, '웹사이트 트래픽 from 네이버💚', NULL, true, '2025-06-18 12:21:11.426408', '2025-06-18 12:21:11.426408', 80);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (68, 25, '스레드🔲', NULL, true, '2025-06-18 12:13:12.375463', '2025-06-18 12:13:12.375463', 68);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (72, 21, '리워드🏃🏻‍♂️🏃🏻‍♀️', NULL, true, '2025-06-18 12:17:58.607798', '2025-06-18 12:17:58.607798', 72);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (74, 21, '리뷰💬', NULL, true, '2025-06-18 12:18:35.86464', '2025-06-18 12:18:35.86464', 73);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (73, 21, '플레이스 상위노출 월보장✨', NULL, true, '2025-06-18 12:18:23.051629', '2025-06-18 12:18:23.051629', 74);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (63, 22, '틱톡 조회수👁‍🗨', NULL, true, '2025-06-18 12:12:19.458019', '2025-06-18 12:12:19.458019', 63);
INSERT INTO public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) VALUES (62, 22, '틱톡 댓글💬', NULL, true, '2025-06-18 12:12:15.972427', '2025-06-18 12:12:15.972427', 62);


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (169, 68, '실제 한국인 스레드 팔로워🧑🏻👧🏻', '📣[서비스]
🇰🇷실제 한국인 팔로워🙋🏻‍♂

[ A/S 정책 및 이탈율 안내 ]
이탈율은 0~5% 미만입니다.
A/S는 자동 진행되며, 90일간 지원됩니다.
ID 변경, 비공개 시 A/S 불가능합니다.

[ 시작시간 ]
🕣 0-5분
- 평균 500명~1,000명 속도

[ 링크 입력 예시 ]
https://www.threads.net/@스레드아이디

[ 예약작업 안내 ]
원치않는 경우 별도 체크하지 않으셔도 됩니다.
예약작업은 원하시는 경우 체크 후 이용이 가능합니다.

[ 효과 ]
인기게시물 유지 및 상승에 도움이 됩니다.
높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 100.00, 5, 10000, '3721', true, '2025-06-18 13:07:14.496591', '2025-06-24 14:43:17.41536', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (97, 48, '실제 한국인 남성 랜덤 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 [남성] 랜덤 댓글
· 실제 한국인 남성들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 남성유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~1시간
- 효과 :
* 인기게시물 노출에 효과적입니다.
- 1줄 당 1개 댓글이며, 엔터로 구분', 250.00, 2, 100, '3880', true, '2025-06-18 12:32:56.598585', '2025-06-18 12:32:56.598585', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (87, 47, '실제 한국인 20대 연령 게시물 좋아요💜', '📣[ 서비스 ]
100% 실제 활동하는 한국인 20대 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 20대 연령의 유저들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 20.00, 5, 5000, '3169', true, '2025-06-18 12:28:10.272012', '2025-06-18 12:28:10.272012', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (79, 46, '[가성비] 고품질 한국인 팔로워🧑🏻👩🏻', '📣[ 서비스 ]
한국인 이름 , 프로필, 피드10개 구성
한국인 처럼 보이도록 꾸민 계정입니다
가성비 최고 상품

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

🚫 주의사항
비공개계정은 작업이 불가능합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식 (자동주문 방법은 고객센터 문의)
인스타 아이디만 입력해주세요
[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]

📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.', 30.00, 1, 15000, '3996', true, '2025-06-18 12:24:10.899027', '2025-06-18 12:24:10.899027', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (94, 48, '인스타 실제 한국인 랜덤 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 랜덤 댓글
· 실제 한국인들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~30분
- 효과 :
* 인기게시물 노출에 효과적입니다.', 180.00, 5, 10000, '3534', true, '2025-06-18 12:32:04.776203', '2025-06-18 12:32:04.776203', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (107, 51, '인스타 계정육성관리 30일💥', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[ 서비스 ]

✅인스타 계정 육성 소통관리(30일)📊
· 계정 지수 상승 및 계정 최적화 보장
· 1일 평균 약 300~500회 이상 활동합니다.
· 한국인 팔로워 최소 300명 이상 확보 보장

[링크 입력방법]
· 인스타그램 아이디 입력 후 신청 [카톡문의]
· 완료 후 리포트 제공 및 인기게시물 노출 1회 무료지원

[서비스 장점]
· 인플루언서/셀럽 급 성장
· 구매전환율이 높은 실유저 확보
· 원하는 타겟층을 소통을 통해 확보
· 인게/인기탭 노출 및 유지가 잘 되는 최적화 성장
· 관리가 어렵고, 바쁜신분들에게 권장드립니다.

[서비스 기능]
· 광고 계정 99% 필터링 처리(AI 기반)
· 정밀 타겟층 소통 (UI기반)
· 지역/업종/성별/연령/카피라이팅 등 다양한 타겟 접근

[메인 서비스 안내]
메인 : 활동을 통해 반응이 일어나는 소통
· 좋아요 : 일 평균 150~500회 활동
· 팔로잉 : 일 평균 : 50~200회 활동
· 스토리 : 일 평균 : 500~1,000회 시청 및 좋아요
· 언팔로잉 : 일 평균 : 50~100회 활동
→ 선팔 후 7일간 맞팔이 아닌 유저는 언팔로잉 처리합니다.

[서브 서비스 안내]
서브 : 활동을 통해 반응을 이끌어내는 소통
· DM : 일 평균 : 3~10회 활동
· 댓글 : 일 평균 : 3~10회 활동
· 예약 업로드 : 사진을 제공해주시는 경우
→ DM 원하시는 경우 수신받을 계정리스트와 문구(내용)를 전달주셔야 합니다.

[부가 서비스 안내]
부가 : 자사에서 제공하는 계정성장에 도움이되는 서비스
· 트래픽 : 게시물 클릭 후 30초 체류+방문 (1일 100회)

* 메인/서브/부가 서비스 중 원치 않는 기능은 중지가 가능합니다.

[서비스 보안]
· AI기반 광고 계정 99% 필터링 처리합니다.
· 모바일 IP를 사용하여 매우 안전하게 진행됩니다.
· 1계정 1디바이스 1아이피 서버 기반으로 운영됩니다.
· 인스타의 알고리즘 난수화 패턴을 완벽 보완했습니다.
· 로그인 이력이 없는 아이피 접속시 로그인 차단합니다.

[서비스 성과(테스트 계정)]
· 계정지수 상승 및 계정 최적화 도달
· 소통을 통한 많은 타겟팅 유저 확보(작업유입 제외)
· [30일 진행 결과]
· 팔로워 약 800명 확보
· 게시물 당 좋아요 100~150개 증가

[인기게시물 / 인기탭 작업 테스트 결과]
· 릴스 #제주맛집 상위노출 테스트 완료
· 인기탭 #강남반영구 상위노출 테스트 완료
· 인기게시물 #눈썹문신 상위노출 테스트 완료
· 경쟁이 치열한 태그 내 평균 1~2일 유지됩니다.

[자주묻는질문]
· 로그인 유지 : 가능합니다.
· 스팸계정 차단 여부 : 자동 진행됩니다.
· 지인에게 활동 유무 : 원하는 경우 가능합니다.
· 개인 활동 여부 : 가능하나, 1일 10회 활동 권장합니다.
· 주말/공휴일 활동 여부 : 휴일없이 24시간 진행됩니다.
. 팔로잉 증가 여부 : 맞팔이 아닌 유저는 모두 언팔됩니다.
* 이것도 원치 않으신 경우 ''팔로잉'' 기능을 제외 후 진행 가능합니다.

[주의사항]
· 비공개 시 진행이 불가능합니다.
· 타업체와 중복사용이 불가능합니다.
· 일평균 10회 이상 활동을 자제해주세요.
· 2단계 보안인증을 설정했다면 해제해주세요.
[ 주의사항 미숙지 시 발생하는 불이익에 대해선 당사는 책임을 지지 않습니다 ]

[환불규정]
· 계정육성관리 셋팅 후 환불은 불가능합니다.
· 진행 기간동안 양도, 타계정 전환은 불가능합니다.', 300000.00, 1, 10000, NULL, true, '2025-06-18 12:37:48.924803', '2025-06-18 12:37:48.924803', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (178, 73, '플레이스 상위노출 월보장✨', 'https://pf.kakao.com/_aIRrn

📌신청 전 카카오톡으로 문의 주세요.', 0.00, 0, 0, NULL, true, '2025-06-18 13:13:20.430979', '2025-06-18 13:13:20.430979', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (180, 74, '[실계정] 블로그 리뷰-일반 지수💬', '', 1500.00, 30, 1000000, NULL, true, '2025-06-18 13:14:11.323983', '2025-06-18 13:14:11.323983', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (77, 46, '[가성비] 고품질 외국인 팔로워👱👱🏻‍♀️', '📣[ 서비스 ]
고품질 외국인 팔로워 입니다.
이탈 거의 없음
24시간 기준 20만건 진행 가능

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

📣착수시간
⏰ 1분~24시간이내
※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.
※유입완료는 신청주신 수량에따라 차이가납니다.

📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.

📣주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 4.00, 10, 100000, '3783', true, '2025-06-18 12:23:04.242067', '2025-06-18 12:43:37.881425', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (76, 46, '[추천] 실제 외국인 팔로워👱👱🏻‍♀️', '📣[ 서비스 ]
[빠름]🇰🇷실제외국인 팔로워🇰🇷
· 실제 사람들로 구성되어 있습니다.

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

[ A/S 정책 및 이탈율 안내 ]
이탈율은 0~5% 미만입니다.
A/S는 자동 진행되며, 90일간 지원됩니다.
ID 변경, 비공개 시 A/S 불가능합니다.

[ 시작시간 ]
🕣 0-5분
- 1일 평균 1,000명~2,000명의 속도

📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.

[ 효과 ]
인기게시물 유지 및 상승에 도움이 됩니다.
높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 5.00, 10, 1000000, '4107', true, '2025-06-18 12:22:29.992522', '2025-06-18 12:22:29.992522', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (78, 46, '[추천] 실제 한국인 팔로워🧑🏻👩🏻', '📣[ 서비스 ]
[빠름]🇰🇷실제한국인 팔로워🇰🇷
· 실제 사람들로 구성되어 있습니다.

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

[ A/S 정책 및 이탈율 안내 ]
이탈율은 0~5% 미만입니다.
A/S는 자동 진행되며, 90일간 지원됩니다.
ID 변경, 비공개 시 A/S 불가능합니다.

[ 시작시간 ]
🕣 0-5분
- 1일 평균 1,000명~2,000명의 속도

[ 링크 입력 예시 ]
📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.

[ 예약작업 안내 ]
원치않는 경우 별도 체크하지 않으셔도 됩니다.
예약작업은 원하시는 경우 체크 후 이용이 가능합니다.

[ 효과 ]
인기게시물 유지 및 상승에 도움이 됩니다.
높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 80.00, 1, 15000, '3996', true, '2025-06-18 12:23:46.57197', '2025-06-18 12:25:40.864859', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (80, 46, '[가성비] 고품질 남자 한국인🧑🏻', '📣[ 서비스 ]
[남성]으로 구성된 한국인 이름 , 프로필, 피드10개 구성
한국인 처럼 보이도록 꾸민 계정입니다
가성비 최고 상품

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

🚫 주의사항
비공개계정은 작업이 불가능합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식 (자동주문 방법은 고객센터 문의)
인스타 아이디만 입력해주세요
[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]

📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.', 100.00, 10, 10000, '4053', true, '2025-06-18 12:24:54.419857', '2025-06-18 12:24:54.419857', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (81, 46, '[가성비] 고품질 여자 한국인👩🏻', '📣[ 서비스 ]
[여성]으로 구성된 한국인 이름 , 프로필, 피드10개 구성
한국인 처럼 보이도록 꾸민 계정입니다
가성비 최고 상품

❗확인해주세요❗
최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.

인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제

🚫 주의사항
비공개계정은 작업이 불가능합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식 (자동주문 방법은 고객센터 문의)
인스타 아이디만 입력해주세요
[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]

📣주문방법
예시 : gramii
- 게시물 링크 입력하시면 안됩니다.
- 본인 인스타그램 아이디만 입력해주세요.', 100.00, 10, 20000, '4054', true, '2025-06-18 12:25:22.61671', '2025-06-18 12:25:22.61671', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (82, 47, '[파워] 실제 외국인 좋아요🧡', '📣[ 서비스 ]
실제 외국인 좋아요 입니다.
서버 상태에 따라 주문 시작 및 처리 속도가 매번 다릅니다.

[ 효과 ]
높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.
단순 좋아요 수치 증가를 원하면 권장드립니다.

📣착수시간
⏰ 1분~1시간 이내
※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.
※유입완료는 신청주신 수량에따라 차이가납니다.

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)

📣주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 0.50, 10, 500000, '3351', true, '2025-06-18 12:26:08.632178', '2025-06-18 12:26:08.632178', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (83, 47, '[파워] 고품질 한국인 게시물 좋아요❤️', '📣[ 서비스 ]
파워 고품질 한국인 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.
노출+도달+탐색 증가

🌟 주문 후 작업시간
평균 1~60분내 시작됩니다.
서버 상태에 따라 작업 완료까지 최대 24시간 소요 될 수 있습니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
고품질 한국인들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.

🚫 주의사항
비공개 계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 3.00, 1, 10000, '3997', true, '2025-06-18 12:26:25.960333', '2025-06-18 12:26:25.960333', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (84, 47, '실제 한국인 게시물 좋아요💛', '📣[ 서비스 ]
[빠름]🇰🇷실제한국인 좋아요❤
100% 실제 활동하는 한국인 좋아요 서비스 입니다.
- 노출+도달[기타]가 증가합니다.

[ 시작시간 ]
🕣 0-5분
- 평균 500개~1,000개 속도

[ 링크 입력 예시 ]
https://www.instagram.com/p/------
게시물의 링크를 넣어주세요.

[ 효과 ]
📋 서비스 설명
실제 한국인들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.
노출+도달 상승은 인기게시물에 효과적 입니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 10.00, 1, 10000, '3997', true, '2025-06-18 12:26:45.673893', '2025-06-18 12:26:45.673893', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (85, 47, '실제 한국인 남성 게시물 좋아요💚', '📣[ 서비스 ]
[빠름]🇰🇷실제 남성 한국인 좋아요❤
100% 실제 활동하는 [남성] 한국인 좋아요 서비스 입니다.
- 노출+도달[기타]가 증가합니다.

[ 시작시간 ]
🕣 0-5분
- 평균 500개~1,000개 속도

[ 링크 입력 예시 ]
https://www.instagram.com/p/------
게시물의 링크를 넣어주세요.

[ 효과 ]
📋 서비스 설명
실제 남성 한국인들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.
노출+도달 상승은 인기게시물에 효과적 입니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 20.00, 5, 5000, '3989', true, '2025-06-18 12:27:12.20751', '2025-06-18 12:27:12.20751', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (86, 47, '실제 한국인 여성 게시물 좋아요💙', '📣[ 서비스 ]
[빠름]🇰🇷실제 여자 한국인 좋아요❤
100% 실제 활동하는 [여성] 한국인 좋아요 서비스 입니다.
- 노출+도달[기타]가 증가합니다.

[ 시작시간 ]
🕣 0-5분
- 평균 500개~1,000개 속도

[ 링크 입력 예시 ]
https://www.instagram.com/p/------
게시물의 링크를 넣어주세요.

[ 효과 ]
📋 서비스 설명
실제 여성 한국인들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.
노출+도달 상승은 인기게시물에 효과적 입니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 20.00, 5, 5000, '3988', true, '2025-06-18 12:27:48.424129', '2025-06-18 12:27:48.424129', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (88, 47, '실제 한국인 20대 연령 남성 게시물 좋아요💜', '📣[ 서비스 ]
100% 실제 활동하는 한국인 20대 [남성] 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 20대 연령의 남성들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 25.00, 5, 2500, '3171', true, '2025-06-18 12:28:36.597969', '2025-06-18 12:30:22.598927', NULL, 7);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (89, 47, '실제 한국인 20대 연령 여성 게시물 좋아요💜', '📣[ 서비스 ]
100% 실제 활동하는 한국인 20대 [여성] 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 20대 연령의 여성들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 25.00, 5, 2500, '3170', true, '2025-06-18 12:29:04.68556', '2025-06-18 12:29:04.68556', NULL, 8);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (90, 47, '실제 한국인 30대 연령 게시물 좋아요🤎', '📣[ 서비스 ]
100% 실제 활동하는 한국인 30대 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 30대 연령의 유저들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 20.00, 5, 5000, '3172', true, '2025-06-18 12:29:22.847262', '2025-06-18 12:29:22.847262', NULL, 9);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (91, 47, '실제 한국인 30대 연령 남성 게시물 좋아요🤎', '📣[ 서비스 ]
100% 실제 활동하는 한국인 30대 [남성] 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 30대 연령의 남성들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 25.00, 5, 2500, '3174', true, '2025-06-18 12:29:36.7122', '2025-06-18 12:29:36.7122', NULL, 10);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (92, 47, '실제 한국인 30대 연령 여성 게시물 좋아요🤎', '📣[ 서비스 ]
100% 실제 활동하는 한국인 30대 [여성] 좋아요 서비스입니다.
IGTV, 릴스에 주문 가능합니다.

🌟 주문 후 작업시간
평균 1~5분내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

📋 서비스 설명
실제 활동하는 한국인 30대 연령의 여성들이 좋아요를 늘려드리는 서비스 입니다.
인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.

🚫 주의사항
비공개계정은 작업이 불가능합니다.
라이브로 올린 영상은 작업이 불가합니다.
주문실수의 경우 취소 및 수정이 불가능합니다.

⌨ 링크형식
인스타 게시물 링크(URL)을 입력해주세요', 25.00, 5, 2500, '3173', true, '2025-06-18 12:29:51.672672', '2025-06-18 12:29:51.672672', NULL, 11);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (93, 48, ' 인스타 실제 한국인 지정 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 지정 댓글
· 실제 한국인들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 유저들이 ''댓글 입력창''에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~1시간
- 효과 :
* 인기게시물 노출에 효과적입니다.
- 1줄 당 1개 댓글이며, 엔터로 구분', 180.00, 3, 10000, '3941', true, '2025-06-18 12:31:18.435734', '2025-06-18 12:31:18.435734', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (95, 48, '실제 한국인 남성 지정 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 [남성] 지정 댓글
· 실제 한국인 남성들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 남성 유저들이 ''댓글 입력창''에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~1시간
- 효과 :
* 인기게시물 노출에 효과적입니다.
- 1줄 당 1개 댓글이며, 엔터로 구분', 250.00, 1, 100, '3877', true, '2025-06-18 12:32:23.215607', '2025-06-18 12:32:23.215607', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (96, 48, '실제 한국인 여성 지정 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 [여성] 지정 댓글
· 실제 한국인 여성들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 여성 유저들이 ''댓글 입력창''에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~1시간
- 효과 :
* 인기게시물 노출에 효과적입니다.
- 1줄 당 1개 댓글이며, 엔터로 구분', 250.00, 1, 100, '3878', true, '2025-06-18 12:32:42.057275', '2025-06-18 12:32:42.057275', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (98, 48, '실제 한국인 여성 랜덤 댓글💬', '📣[ 서비스 ]
인스타 실제 한국인 [여성] 랜덤 댓글
· 실제 한국인 여성들로 구성되어 있습니다.

▶서비스 특징
100% 실제 활동하는 한국인 여성유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. 

▶ 주문 전 주의사항
- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.
- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.

▶ 서비스 상세설명
- 시작 시간 : 평균 1분~30분
- 효과 :
* 인기게시물 노출에 효과적입니다.', 250.00, 2, 100, '3881', true, '2025-06-18 12:33:12.463686', '2025-06-18 12:40:53.029353', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (99, 49, '실제 한국인 게시물 저장🎁', '📣[ 서비스 ]
실제 한국인 파워 저장하기 입니다.
※원하는 게시물에 신청하신 갯수 만큼 저장갯수가 증가 됩니다.

📣착수시간
⏰ 1분~20분 이내
※동시 주문량이 많은경우 120분까지 소요될수 있습니다.
※유입완료는 신청주신 수량에따라 차이가납니다.

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)
https://www.instagram.com/p/------

📣혜택
인기게시물 상승 및 유지에 도움이 됩니다.

📣주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 0.40, 50, 4000, '3610', true, '2025-06-18 12:33:33.772994', '2025-06-18 12:33:33.772994', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (100, 49, '실제 한국인 게시물 공유🎀', '📣[ 서비스 ]
실제 한국인 공유입니다.
※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.

📣착수시간
⏰ 10분~30분 이내
※동시 주문량이 많은경우 60분까지 소요될수 있습니다.
※유입완료는 신청주신 수량에따라 차이가납니다.

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)
https://www.instagram.com/p/------

📣혜택
인기게시물 상승 및 유지에 도움이 됩니다.

📣주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 0.80, 100, 5000000, '4030', true, '2025-06-18 12:34:44.373316', '2025-06-18 12:34:44.373316', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (101, 49, '실제 한국인 프로필 방문📌', '📣[ 서비스 ]
\\\\\\\"실제 한국인 프로필 방문\\\\\\\" 입니다.
※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.

📣착수시간
⏰ 10분~30분 이내
※동시 주문량이 많은경우 60분까지 소요될수 있습니다.
※유입완료는 신청주신 수량에따라 차이가납니다.

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)
https://www.instagram.com/p/------

📣혜택
인기게시물 상승 및 유지에 도움이 됩니다.

📣주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 0.30, 10, 1000000, '4087', true, '2025-06-18 12:34:58.989973', '2025-06-18 12:34:58.989973', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (102, 49, '실제 한국인 노출 + 도달💡', '📣[ 서비스 ]
실제 한국인 게시물 노출/도달입니다.
※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.

📣착수시간
현재 테스트 결과 주문 후 30분에 5000회 까지 유입 됩니다.

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)
https://www.instagram.com/p/------

📣혜택
인기게시물 상승 및 유지에 도움이 됩니다.

📣
주의사항
※비공개 계정에는 작업이 안됩니다.
※주문 실수로인한 취소및 환불은 어렵습니다.
※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.
※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.
※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.', 0.30, 10, 1000000, '2746', true, '2025-06-18 12:35:21.337048', '2025-06-18 12:35:21.337048', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (103, 49, '[릴스] 인스타그램 동영상 조회수⏰', '📣[ 서비스 ]
· 릴스/IGTV/동영상 모두 적용됩니다.

📣착수시간
🕣 0-60분
· 평균 200,000회~300,000회 속도

📣주문방법
※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)
https://www.instagram.com/p/------

📣효과
· 높은 조회수는 컨텐츠의 신뢰도를 높여줍니다.

 📣주의사항
· 주문 후 링크 수정은 불가능합니다.
· 조회수 중복주문 시 지원불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복 신청 시 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.
', 0.10, 100, 2147483647, '2349', true, '2025-06-18 12:35:38.850405', '2025-06-18 12:35:45.591792', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (104, 50, '실제 한국인 리그램➰', '📣[ 서비스 ]
🇰🇷실제한국인 리그램

*발행 이후 삭제되는 경우 as 불가능합니다.

[ 리그램이란? ]
내가 원하는 홍보 게시물을 제3자가 올려줍니다.
제3자는 게시물 이미지, 내용 그대로 포스팅합니다.
해시태그, 계정태그까지 완벽히 포스팅합니다.
최적화 계정이 없어도 인기게시물 노출이 가능합니다.

[ 시작시간 ]
🕣 0-5분

[ 링크입력 예시 ]
https://www.instagram.com/p/------

[ 혜택 ]
최적화 계정 포스팅
*인기게시물 작업시 원활한 상위노출
게시물의 해시태그는 최신게시물 도배 가능
리그램 한 계정의 팔로워들에게 게시물 노출

*리그램으로 올라온 게시물에 인기게시물 셀프 작업시 상단 노출 가능성 UP!

[ 게시물 조회 ]
작성하신 해시태그를 조회하여 최근게시물 클릭
최근게시물에서 포스팅 된 게시물을 확인 할 수 있습니다.
* 신청량이 많은 경우 채팅방으로 문의주시면 링크를 정리해서 전달드립니다.

[ 추가설명 ]
리그램 서비스는 홍보하기 저렴하고 효율적입니다.
1일 100만명에게 게시물을 노출시킬 수 있습니다.
리그램 결과는 카카오톡 오픈톡으로 문의주세요.
https://open.kakao.com/me/gramii

[ 주의사항 ]

리그램 서비스는 게시물 삭제가 불가능합니다.
해시태그는 본문(상세내용)에 필히 기재해주세요.

*아래 내용 관련 적발 시 형사처벌 대상이됩니다.
정치적, 종교적, 핫이슈, 불법적 관련 게시물 이용 시 관·공·서에 관련 자료를 제공합니다.

[유입/변경/취소/환불불가 : 주의사항]
주문신청 후 링크수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복주문이 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 400.00, 1, 1000, '3694', true, '2025-06-18 12:36:07.834147', '2025-06-18 12:36:07.834147', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (105, 50, '✅릴스(Reels) 인게 최상위노출📤', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[ 서비스 ]
✅릴스(Reels) 인게 최상위노출📤
노출보장X

[ 진행사항 ]
자사 계정으로만 진행 가능

[ 링크입력 예 ]
https://www.instagram.com/reel/------

[ 시작시간 ]
🕣 0-20분
- 서비스 신청 후 카톡 오픈톡으로 연락 부탁드립니다. 주문번호 기재
https://open.kakao.com/me/gramii

[ 혜택 ]
1위자리 2개의 칸을 차지(릴스)
최상위 노출로 인한 홍보(광고) 효과 발생.
릴스는 영상이기에 화면이 움직이며 전환합니다.
*이목을 더 확실히 끌 수 있습니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 15000.00, 1, 10000, NULL, true, '2025-06-18 12:37:09.548579', '2025-06-18 12:37:09.548579', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (106, 51, '추천탭 최적화 계정 30일💥', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[ 서비스 ]

📌추천탭 최적화 계정(업데이트) 30일📊
· 본인소유(개인계정) 직접 추천탭 노출[최초공개]

[수량]
· 계정 1개 당 수량 1

[상세내용]
· 100% 최적화 계정 보장
· 추천탭에 노출이 안되는 계정 권장
· 팔로워 약 5,000명 확보 및 계정지수 Max 증가
· 추천탭에 노출이 가능한 최적화 계정으로 업데이트
* 30일간 인친, 지인에게 품앗이 활동, 외 제3자의 게시물 컨택(게시물 클릭)

* 메뉴 - 추천탭 상위노출[TIP] 클릭 후 참조

[변경/취소/환불 불가 : 주의사항]
· 본 서비스는 서비스 진행 후 취소, 변경, 중지가 불가능합니다.', 300000.00, 1, 10000, NULL, true, '2025-06-18 12:37:36.188086', '2025-06-18 12:37:36.188086', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (108, 52, '실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻❤️', '📣[ 서비스 ]
💙🇰🇷실제한국인 좋아요💟+팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/----------

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 250.00, 5, 10000, '3132', true, '2025-06-18 12:39:35.657293', '2025-06-18 12:39:35.657293', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (109, 52, '[여성] 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻🧡', '📣[ 서비스 ]
💙🇰🇷실제 한국인 [여성] 좋아요💟+팔로워🙇🏻‍♀

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3133', true, '2025-06-18 12:39:55.386693', '2025-06-18 12:41:33.452364', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (110, 52, '[남성] 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💛', '📣[ 서비스 ]
💙🇰🇷실제 한국인 [남성] 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3134', true, '2025-06-18 12:40:10.043236', '2025-06-18 12:41:36.783656', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (111, 52, '20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💚', '📣[ 서비스 ]
💙🇰🇷실제 20대 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3135', true, '2025-06-18 12:40:31.545146', '2025-06-18 12:40:46.05279', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (112, 52, '[여성] 20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워👧🏻💚', '📣[ 서비스 ]
💙🇰🇷실제 20대 [여성] 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3136', true, '2025-06-18 12:42:00.428526', '2025-06-18 12:42:00.428526', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (113, 52, '[남성] 20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻💚', '📣[ 서비스 ]
💙🇰🇷실제 20대 [남성] 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3137', true, '2025-06-18 12:42:23.20082', '2025-06-18 12:42:23.20082', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (114, 52, '30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💙', '📣[ 서비스 ]
💙🇰🇷실제 30대 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3138', true, '2025-06-18 12:42:50.401545', '2025-06-18 12:42:50.401545', NULL, 7);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (115, 52, '[여성] 30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워👧🏻💙', '📣[ 서비스 ]
💙🇰🇷실제 30대 [여성] 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3139', true, '2025-06-18 12:43:13.989062', '2025-06-18 12:43:13.989062', NULL, 8);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (116, 52, '[남성] 30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻💙', '📣[ 서비스 ]
💙🇰🇷실제 30대 [남성] 한국인 좋아요💟+팔로워🙇🏻

[ 시작시간 ]
🕣 0-10분
- 평균 100~500 속도

[ 링크입력 예시 ]
https://www.facebook.com/~~~~~~~~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3140', true, '2025-06-18 12:44:05.247973', '2025-06-18 12:44:05.247973', NULL, 9);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (117, 53, '실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 250.00, 5, 10000, '3141', true, '2025-06-18 12:44:27.350435', '2025-06-18 12:44:27.350435', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (118, 53, '[여성] 실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 [여성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3142', true, '2025-06-18 12:44:44.229605', '2025-06-18 12:44:44.229605', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (119, 53, '[남성] 실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 [남성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3143', true, '2025-06-18 12:45:03.808331', '2025-06-18 12:45:03.808331', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (120, 53, '실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 20대 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3144', true, '2025-06-18 12:45:18.726754', '2025-06-18 12:45:18.726754', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (121, 53, '[여성] 실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 20대 [여성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3145', true, '2025-06-18 12:46:10.229187', '2025-06-18 12:46:10.229187', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (122, 53, '[남성] 실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 20대 [남성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3146', true, '2025-06-18 12:46:31.087449', '2025-06-18 12:46:31.087449', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (123, 53, '실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 30대 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 350.00, 5, 5000, '3147', true, '2025-06-18 12:46:58.351381', '2025-06-18 12:46:58.351381', NULL, 7);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (124, 53, '[여성] 실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 30대 [여성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3148', true, '2025-06-18 12:47:14.143251', '2025-06-18 12:47:14.143251', NULL, 8);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (125, 53, '[남성] 실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻', '📣[ 서비스 ]
🟦🇰🇷실제 30대 [남성] 한국인 프로필 팔로워🙋🏻

[ 시작시간 ]
🕣 0-10분
- 평균 500명~1,000명 속도

[ 링크입력 예 ]
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 450.00, 5, 2500, '3149', true, '2025-06-18 12:47:29.057645', '2025-06-18 12:47:29.057645', NULL, 9);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (126, 54, '실제 한국인 게시물 좋아요💖', '📣[ 서비스 ]
🟦🇰🇷실제 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 40.00, 5, 10000, '3150', true, '2025-06-18 12:47:58.913537', '2025-06-18 12:47:58.913537', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (127, 54, '[여성] 실제 한국인 게시물 좋아요❤️', '📣[ 서비스 ]
🟦🇰🇷실제 [여성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 50.00, 5, 5000, '3151', true, '2025-06-18 12:48:14.037152', '2025-06-18 12:48:14.037152', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (128, 54, '[남성] 실제 한국인 게시물 좋아요🧡', '📣[ 서비스 ]
🟦🇰🇷실제 [남성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 50.00, 5, 5000, '3152', true, '2025-06-18 12:48:42.476264', '2025-06-18 13:37:46.626202', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (129, 54, '실제 한국인 20대 게시물 좋아요💛', '📣[ 서비스 ]
🟦🇰🇷실제 20대 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 50.00, 5, 5000, '3153', true, '2025-06-18 12:49:00.870234', '2025-06-18 12:49:00.870234', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (130, 54, '[여성] 실제 한국인 20대 게시물 좋아요💚', '📣[ 서비스 ]
🟦🇰🇷실제 20대 [여성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 60.00, 5, 2500, '3154', true, '2025-06-18 12:49:40.814773', '2025-06-18 12:49:40.814773', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (131, 54, '[남성] 실제 한국인  20대 게시물 좋아요💙', '📣[ 서비스 ]
🟦🇰🇷실제 20대 [남성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 60.00, 5, 2500, '3155', true, '2025-06-18 12:49:59.74304', '2025-06-18 12:49:59.74304', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (132, 54, '실제 한국인 30대 게시물 좋아요💜', '📣[ 서비스 ]
🟦🇰🇷실제 30대 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 50.00, 5, 5000, '3156', true, '2025-06-18 12:50:18.071822', '2025-06-18 12:50:18.071822', NULL, 7);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (133, 54, '[여성] 실제 한국인 30대 게시물 좋아요🤎', '📣[ 서비스 ]
🟦🇰🇷실제 30대 [여성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 60.00, 5, 2500, '3157', true, '2025-06-18 12:50:35.45204', '2025-06-18 12:50:35.45204', NULL, 8);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (134, 54, '[남성] 실제 한국인  30대 게시물 좋아요🖤', '📣[ 서비스 ]
🟦🇰🇷실제 30대 [남성] 한국인 게시글 좋아요💟

[ 시작시간 ]
🕣 0-5분
- 평균 1,000개~2,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~~~
http://www.facebook.com/~~~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 60.00, 5, 2500, '3158', true, '2025-06-18 12:50:53.439752', '2025-06-18 12:50:53.439752', NULL, 9);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (135, 55, '실제 한국인 게시물 댓글💬', '📣[ 서비스 ]
🟦🇰🇷실제 한국인 랜덤 댓글💬

[ 시작시간 ]
🕣 0-5분
- 평균 100개~1,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~
http://www.facebook.com/~

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 250.00, 5, 10000, '3159', true, '2025-06-18 12:51:10.682242', '2025-06-18 12:51:10.682242', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (136, 55, '[여성] 실제 한국인 댓글 작성💬', '📣[ 서비스 ]
🟦🇰🇷실제 한국인 [여성] 랜덤 댓글💬

[ 시작시간 ]
🕣 0-5분
- 평균 100개~1,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~
http://www.facebook.com/~


[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 5, 5000, '3160', true, '2025-06-18 12:51:29.740587', '2025-06-18 12:51:29.740587', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (137, 55, '[남성] 실제 한국인 댓글 작성💬', '📣[ 서비스 ]
🟦🇰🇷실제 한국인 [남성] 랜덤 댓글💬

[ 시작시간 ]
🕣 0-5분
- 평균 100개~1,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~
http://www.facebook.com/~


[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 5, 5000, '3161', true, '2025-06-18 12:51:56.598478', '2025-06-18 12:51:56.598478', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (138, 55, '20대 실제 한국인 게시물 댓글💬', '📣[ 서비스 ]
🟦🇰🇷실제 20대 한국인 랜덤 댓글💬

[ 시작시간 ]
🕣 0-5분
- 평균 100개~1,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~
http://www.facebook.com/~


[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 5, 5000, '3162', true, '2025-06-18 12:52:15.183484', '2025-06-18 12:52:15.183484', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (139, 55, '30대 실제 한국인 게시물 댓글💬', '📣[ 서비스 ]
🟦🇰🇷실제 30대 한국인 랜덤 댓글💬

[ 시작시간 ]
🕣 0-5분
- 평균 100개~1,000개 속도

[ 링크입력 예 ]
[...] 클릭 후 링크복사
http://m.facebook.com/~
http://www.facebook.com/~


[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 5, 5000, '3165', true, '2025-06-18 12:52:30.433925', '2025-06-18 12:52:30.433925', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (140, 56, '한국인 유튜브 조회수👁‍🗨', '📣[ 서비스 ]
💙🇰🇷실제 한국인 유튜브 조회수🙋🏻

[ 시작시간 ]
🕣 0-6시간
- 평균 1,000~ 속도

[ 링크입력 예시 ]
https://www.youtube.com/~~~~~

🔊상세설명
시작: 즉시 시작
보장: 30일 무손실 보장
출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.
유지 시간: 10~60초.


🔊 주문 전 주의사항
1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.
2⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.
3⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.', 20.00, 100, 5000, '3815', true, '2025-06-18 12:52:57.081688', '2025-06-18 12:52:57.081688', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (141, 57, '유튜브 한국인 좋아요💝', '📣[ 서비스 ]
💙🇰🇷실제 한국인 유튜브 조회수🙋🏻

[ 시작시간 ]
🕣 0-6시간
- 평균 1,000~ 속도

[ 링크입력 예시 ]
https://www.youtube.com/~~~~~

🔊상세설명
시작: 즉시 시작
보장: 30일내 이탈시 리필 가능 (담당자 문의)
출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.
유지 시간: 10~60초.

🔊 주문 전 주의사항

1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.
2⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.
3⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.
4⃣ 좋아요수가 보이게 공개 상태여야 합니다.

🔉 주문 후 평균 시작시간
24시간 주문이 가능하며 주문 후 평균 1시간내 자동으로 작업이 시작됩니다.
(서버 상황에 따라 지연될 수 있습니다.)
', 20.00, 10, 10000, '3973', true, '2025-06-18 12:53:15.30181', '2025-06-18 12:53:15.30181', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (142, 57, '유튜브 외국인 동영상 좋아요💕', '📣[ 서비스 ]
💙🇰🇷실제 외국인 유튜브 조회수🙋🏻

[ 시작시간 ]
🕣 0-6시간
- 평균 1,000~ 속도

[ 링크입력 예시 ]
https://www.youtube.com/~~~~~

🔊상세설명
시작: 즉시 시작
보장: 30일내 이탈시 리필 가능 (담당자 문의)
출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.
유지 시간: 10~60초.


🔊 주문 전 주의사항

1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.
2⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.
3⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.
4⃣ 좋아요수가 보이게 공개 상태여야 합니다.

🔉 주문 후 평균 시작시간
24시간 주문이 가능하며 주문 후 평균 1시간내 자동으로 작업이 시작됩니다.
(서버 상황에 따라 지연될 수 있습니다.)
', 8.00, 10, 10000, '3973', true, '2025-06-18 12:53:31.707877', '2025-06-18 12:53:31.707877', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (143, 58, '실제 한국인 유튜브 구독자🧑🏻👧🏻', '📣[ 서비스 ]
🟥🇰🇷실제한국인 구독자🙋🏻

[ A/S 정책 및 이탈율 안내 ]
- 이탈율은 0~5% 미만입니다.
- A/S는 자동 진행되며, 90일간 지원됩니다.
- ID 변경, 비공개 시 A/S 불가능합니다.

[ 시작시간 ]
🕣 0-6시간
- 평균 100~500명 속도

[ 링크입력 예시 ]
https://www.youtube.com/channel/------
- 유튜브 채널검색 \''공유 → 카톡[나] → 링크복사\''

[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ QnA ]
Q : 구독자 서비스는 영상도 시청하나요?
A : 실제 유저에 해당되므로, 콘텐츠 취향이 확고한 경우 지속적인 시청도 발생할 수 있습니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 380.00, 5, 200, '3105', true, '2025-06-18 12:54:01.916429', '2025-06-18 12:54:01.916429', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (144, 58, '실제 외국인 구독자👱🏻‍♂️👱🏻‍♀️', '📣[ 서비스 ]
🟥🇰🇷실제외국인 구독자🙋🏻

[ A/S 정책 및 이탈율 안내 ]
- 이탈율은 0~5% 미만입니다.
- A/S는 자동 진행되며, 90일간 지원됩니다.
- ID 변경, 비공개 시 A/S 불가능합니다.

[ 시작시간 ]
🕣 0-6시간
- 평균 100~500명 속도

[ 링크입력 예시 ]
https://www.youtube.com/channel/------
- 유튜브 채널검색 \''공유 → 카톡[나] → 링크복사\''

[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ QnA ]
Q : 구독자 서비스는 영상도 시청하나요?
A : 실제 유저에 해당되므로, 콘텐츠 취향이 확고한 경우 지속적인 시청도 발생할 수 있습니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.', 60.00, 100, 500000, '2878', true, '2025-06-18 12:54:20.742553', '2025-06-18 12:54:20.742553', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (145, 59, '실제 한국인 유튜브 영상 댓글💬', '📣[ 서비스 ]
🟥실제 한국인 댓글💬
- 평균 15초~5분 영상을 시청합니다.

[ 시작시간 ]
🕣 0-1시간
- 1일 평균 100개 댓글이 유입됩니다.

[ 링크입력 예시 ]
https://youtu.be/------

[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.
', 200.00, 5, 1000, '3123', true, '2025-06-18 12:54:38.345348', '2025-06-18 12:54:38.345348', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (146, 59, '실제 한국인 여성 유튜브 영상 댓글💬', '📣[ 서비스 ]
🟥[여성]실제한국인 댓글🙇🏻‍♀💬
- 평균 15초~5분 영상을 시청합니다.

[ 시작시간 ]
🕣 0-1시간
- 평균 100개 속도

[ 링크입력 예시 ]
https://youtu.be/------

[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 5, 1000, '3124', true, '2025-06-18 12:54:56.717788', '2025-06-18 12:54:56.717788', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (147, 59, '실제 한국인 남성 유튜브 영상 댓글💬', '📣[ 서비스 ]
🟥[남성]🇰🇷실제한국인 댓글🙇🏻💬
- 평균 15초~5분 영상을 시청합니다.

[ 시작시간 ]
🕣 0-1시간
- 평균 100개 속도

[ 링크입력 예시 ]
https://youtu.be/------


[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.
', 300.00, 5, 1000, '3125', true, '2025-06-18 12:55:11.869214', '2025-06-18 12:55:11.869214', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (148, 59, '외국인 지정 유튜브 영상 댓글💬', '📣[ 서비스 ]
🟥[지정]🇺🇸실제외국인 댓글💬
- 평균 15초~5분 영상을 시청합니다.
-서버 내 참여자가 많아 동일한 댓글이 중복으로 달릴 수 있습니다.

[ 시작시간 ]
🕣 0-30분
- 평균 10~100개 속도

[ 링크입력 예시 ]
https://youtu.be/------
* 작성하신 내용 그대로 댓글이 작성됩니다.
- 1줄 당 1개의 댓글로 작성하실 수 있습니다.

[ 혜택 ]
- 애드센스(수익창출) 가능합니다.
- 인기동영상 상승 확률이 증가합니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 20.00, 10, 10000, '1208', true, '2025-06-18 12:55:29.455308', '2025-06-18 12:55:29.455308', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (149, 60, '실제 한국 유튜브 영상 공유➰', '📣[🟥서비스]
🇰🇷실제 한국인 공유♻


▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-1시간
· 평균 1,000-2,000회 속도

[ 링크입력 예시 ]
https://youtu.be/------
- 동영상 ''공유 → 카톡[나] → 링크복사''
* 셋팅4 : [주문방법] 클릭 부탁드립니다.

[ 효과 ]
· 추천동영상으로 노출 될 가능성이 증가합니다.
· 알고리즘 상, 영상 당 최소 1,000회 ~ 최대 100,000회 이상 권장

[ 변경/취소/환불 불가 : 주의사항 ]
· 주문 후 링크 수정, 취소는 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복 신청 시 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 10.00, 50, 10000, '2835', true, '2025-06-18 12:55:48.459503', '2025-06-18 12:55:48.459503', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (150, 61, '유튜브 라이브 시청자 [30분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(30분 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 8.00, 100, 1000000, '3567', true, '2025-06-18 12:56:10.48488', '2025-06-18 12:56:10.48488', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (151, 61, '유튜브 라이브 시청자 [60분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(1시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 12.00, 100, 1000000, '3094', true, '2025-06-18 12:56:27.470948', '2025-06-18 12:56:27.470948', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (152, 61, '유튜브 라이브 시청자 [90분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(1시간30분 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 16.00, 100, 1000000, '3568', true, '2025-06-18 12:56:45.528939', '2025-06-18 12:56:45.528939', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (153, 61, '유튜브 라이브 시청자 [120분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(2시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 20.00, 100, 1000000, '3095', true, '2025-06-18 12:57:00.859758', '2025-06-18 12:57:00.859758', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (154, 61, '유튜브 라이브 시청자 [180분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(3시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 30.00, 100, 1000000, '3570', true, '2025-06-18 12:57:16.463614', '2025-06-18 12:57:16.463614', NULL, 5);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (155, 61, '유튜브 라이브 시청자 [360분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(6시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 40.00, 100, 1000000, '3417', true, '2025-06-18 12:57:32.925571', '2025-06-18 12:57:32.925571', NULL, 6);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (156, 61, '유튜브 라이브 시청자 [720분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(8시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 45.00, 100, 1000000, '3470', true, '2025-06-18 12:57:52.513429', '2025-06-18 12:57:52.513429', NULL, 7);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (157, 61, '유튜브 라이브 시청자 [1440분]👁‍🗨', '📣[ 서비스 ]
[🟥순위상승🔝] 라이브 시청자(24시간 시청)
라이브 중인 영상에 시청자들이 유입됩니다..

▶[메뉴] - [📈유튜브 채널 성장 TIP]
· 채널 성장을 위한 알고리즘을 무료로 제공합니다.

[ 시작시간 ]
🕣 0-5분
예 : 수량 1000→시청자 평균 1,000명 1시간 유지
예 : 수량 2000→시청자 평균 2,000명 1시간 유지
* 대기 상태에서 신청하시면 안됩니다.
* 라이브 시작과 동시에 신청해주세요.

[ 링크입력 예시 ]
https://www.youtube.com/watch?v=-------------

[ 혜택 ]
- 유튜브 애드센스 승인 가능
- 추천동영상으로 노출 될 가능성이 높음
- 즉시 진행되며 실시간으로 높은 시청자수 확보

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 50.00, 100, 1000000, '3558', true, '2025-06-18 12:58:11.884561', '2025-06-18 12:58:11.884561', NULL, 8);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (162, 63, '라이브 조회수👁‍🗨', '📣[서비스]
(🎵) 실제 사람 라이브 시청자🤳

▶시작시간
· 🕣 0-5분

▶링크입력 예
· https://vt.tiktok.com/xxxxxx/ 공유 → 링크복사
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶변경/취소/환불 불가 : 주의사항
· 주문 후 링크 수정, 취소는 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복 신청 시 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.
', 5.00, 100, 100000000, '2291', true, '2025-06-18 13:04:59.711388', '2025-06-18 13:04:59.711388', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (163, 63, '비디오 조회수👁‍🗨', '📣[서비스]
(🎵) 🇺🇸실제 사람 조회수🤳

▶시작시간
· 🕣 0-5분

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 3.00, 100, 100000000, '3665', true, '2025-06-18 13:05:19.100723', '2025-06-18 13:05:19.100723', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (164, 64, '좋아요❤️', '📣[서비스]
(🎵)실제 사람 좋아요💛
· 영상을 시청하고 좋아요를 클릭합니다.

▶시작시간
· 🕣 0-5분
· 시간 당 평균 : 1,000~2,000회 속도
. 30일 리필 가능

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 5.00, 10, 2000000, '3663', true, '2025-06-18 13:05:38.465217', '2025-06-18 13:05:38.465217', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (165, 64, '좋아요 + 조회수❤️👁‍🗨', '📣[서비스]
(🎵)실제 사람 좋아요 + 조회수💛
· 영상을 시청하고 좋아요를 클릭합니다.

▶시작시간
· 🕣 0-5분
· 시간 당 평균 : 1,000~2,000회 속도

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 7.00, 10, 10000000, '3952', true, '2025-06-18 13:05:55.277183', '2025-06-18 13:05:55.277183', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (166, 64, '남성 좋아요 + 조회수🧑🏻❤️👁‍🗨', '📣[서비스]
(🎵)실제 [남성] 좋아요 + 조회수💛
· 영상을 시청하고 좋아요를 클릭합니다.

▶시작시간
· 🕣 0-5분
· 시간 당 평균 : 1,000~2,000회 속도

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 8.00, 10, 1000000, '3950', true, '2025-06-18 13:06:13.084349', '2025-06-18 13:06:13.084349', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (167, 64, '여성 좋아요 + 조회수👧🏻❤️👁‍🗨', '📣[서비스]
(🎵)실제 [여성] 좋아요 + 조회수💛
· 영상을 시청하고 좋아요를 클릭합니다.

▶시작시간
· 🕣 0-5분
· 시간 당 평균 : 1,000~2,000회 속도

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 8.00, 10, 1000000, '3951', true, '2025-06-18 13:06:29.113256', '2025-06-18 13:06:29.113256', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (168, 65, '실제 외국인 팔로워👱🏻‍♂️👱🏻‍♀️', '📣[서비스]
(🎵) 🇺🇸실제 외국인 빠른 팔로워🙋🏼
· 이탈율 : 0~10%
· A/S 지원 : 신청일 기준 30일

▶시작시간
· 🕣 0-5분
· 하루 평균 : 5,000~25,000명 속도

▶링크입력 예
· https://vt.tiktok.com/------/
· 영상 클릭 → [...] 클릭 후 ''링크복사'' 클릭

▶유입/변경/취소/환불불가 : 주의사항
· 주문신청 후 링크수정은 불가능합니다.
· 비공개, 보관, 삭제의 경우가 해당됩니다.
· 링크를 실수로 오입력한 경우가 해당됩니다.
· 유입 미완료 상태로 중복주문이 해당됩니다.
· 유입 미완료 상태로 아이디 변경 시 해당됩니다.', 30.00, 10, 50000, '2461', true, '2025-06-18 13:06:48.499644', '2025-06-18 13:06:48.499644', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (171, 67, '외국인 좋아요💙', '📣[서비스]
실제외국인 좋아요💛 - 5원

▶안내사항
· 트위터 자체 업데이트 시 일부 좋아요, 팔로워 초기화 현상이 있습니다.
· A/S 30일간 지원되며, 그 이후 발생하는 이탈건은 지원이 불가능합니다.

▶시작시간
· 🕣 0-15분
· 평균 1,000개~3,000개 속도

▶링크입력 예
· https://x.com/xxxxx/status/1------
· Share → CopyLink

▶변경/취소/환불 불가 : 주의사항
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 7.00, 10, 50000, '3754', true, '2025-06-18 13:08:48.939327', '2025-06-18 13:08:48.939327', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (170, 68, '실제 한국인 스레드 좋아요💜', '📣[서비스]
🇰🇷실제한국인 좋아요❤

[ 시작시간 ]
🕣 0-30분
- 평균 200개~500개 속도

[ 링크 입력 예시 ]
https://www.threads.net/t/--------/-------

[ 효과 ]
높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정은 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 18.00, 5, 10000, '3722', true, '2025-06-18 13:07:51.666235', '2025-06-18 13:07:51.666235', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (173, 69, '조회수👁‍🗨', '조회수👁‍🗨', 8.00, 10, 10000000, '3237', true, '2025-06-18 13:09:25.564263', '2025-06-18 13:09:25.564263', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (172, 70, '팔로워👱🏻‍♂️👱🏻‍♀️', '📣[서비스]
빠른 팔로워🙋🏻‍♀
· 실제계정 처럼  꾸며진 프로필(가계정)

▶안내사항
· 트위터 자체 업데이트 시 일부 좋아요, 팔로워 초기화 현상이 있습니다.
· A/S 30일간 지원되며, 그 이후 발생하는 이탈건은 지원이 불가능합니다.

▶시작시간
· 🕣 0-15분
· 평균 2000~3,000명 유입 속도

▶링크입력 예
· https://x.com/-----
· 프로필 링크복사

▶변경/취소/환불 불가 : 주의사항
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 80.00, 100, 100000, '3752', true, '2025-06-18 13:09:07.303173', '2025-06-18 13:09:07.303173', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (174, 71, '실제 한국인 카톡 채널 친구추가🤩', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💛 🇰🇷실제한국인 카카오톡 채널 친구추가

[ 시작시간 ]
🕣 0-1시간
- 평균 200명~1,000명 속도

[ 링크입력 예시 ]
https://pf.kakao.com/xxxxx/friend
- 채널 링크를 확인 후 신청 부탁드립니다.
- 신청 후 카카오톡 채널로 연락 부탁드립니다.

[ 변경/취소/환불 불가 : 주의사항 ]
주문 후 링크 수정, 취소는 불가능합니다.
비공개, 보관, 삭제의 경우가 해당됩니다.
링크를 실수로 오입력한 경우가 해당됩니다.
유입 미완료 상태로 중복 신청 시 해당됩니다.
유입 미완료 상태로 아이디 변경 시 해당됩니다.', 300.00, 100, 1000000, NULL, true, '2025-06-18 13:10:18.549314', '2025-06-18 13:10:18.549314', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (175, 72, '실제 한국인 유입(체류)🏃🏻‍♂️🏃🏻‍♀️', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실제 한국인 리워드 트래픽🙋🏻
· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되는 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.
· 상위 노출 원하는 키워드를 꼭 입력 해주세요.
· 주문 단위는 100단위로 가능 합니다.

▶시작시간
· 오후3시 이전 주문시 익일구동
이후 주문시 2일 뒤 구동시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
7일단위로 주문 가능
AS 및 환불 불가능', 50.00, 100, 1000000, NULL, true, '2025-06-18 13:11:59.641735', '2025-06-18 13:11:59.641735', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (176, 72, '실제 한국인 저장하기💕', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실제 한국인 리워드+저장하기 🙋🏻
· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되어 저장하기까지 클릭되는 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.
· 상위 노출 원하는 키워드를 꼭 입력 해주세요.
· 주문 단위는 100단위로 가능 합니다.

▶시작시간
· 오후3시 이전 주문시 익일구동
이후 주문시 2일 뒤 구동시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
7일단위로 주문 가능
AS 및 환불 불가능', 100.00, 100, 1000000, NULL, true, '2025-06-18 13:12:18.256438', '2025-06-18 13:12:18.256438', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (177, 72, '실제 한국인 공유하기📌', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실제 한국인 리워드+공유하기 🙋🏻
· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되어 공유하기까지 클릭되는 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.
· 상위 노출 원하는 키워드를 꼭 입력 해주세요.
· 주문 단위는 100단위로 가능 합니다.

▶시작시간
· 오후3시 이전 주문시 익일구동
이후 주문시 2일 뒤 구동시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
7일단위로 주문 가능
AS 및 환불 불가능', 100.00, 100, 1000000, NULL, true, '2025-06-18 13:12:33.051631', '2025-06-18 13:12:33.051631', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (179, 74, '[비실계] 블로그 리뷰-일반 지수💬', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실계정 블로그 리뷰 (준최4 이상) 🙋🏻
· 실명인증이 완료 된 실제 리뷰어가 작성하는 준최적화4 이상등급의 블로그 리뷰 입니다.
-원하는 키워드 상위노출에 최적화 된 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경 및 사진 추가,변경이 불가한 상품 입니다.
· 대표 해시태그를 꼭 입력 해주세요.
· 하루 발행량을 꼭 작성 해주세요.
· 사진전달을 위해 꼭 별도 문의가 필요 합니다.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일이내 발행시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.
', 900.00, 30, 1000000, NULL, true, '2025-06-18 13:13:48.725612', '2025-06-18 13:13:48.725612', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (181, 74, '[실계정] 블로그 리뷰-준최2 이상 지수💬', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실계정 블로그 리뷰 (준최4 이상) 🙋🏻
· 실명인증이 완료 된 실제 리뷰어가 작성하는 준최적화4 이상등급의 블로그 리뷰 입니다.
-원하는 키워드 상위노출에 최적화 된 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경 및 사진 추가,변경이 불가한 상품 입니다.
· 대표 해시태그를 꼭 입력 해주세요.
· 하루 발행량을 꼭 작성 해주세요.
· 사진전달을 위해 꼭 별도 문의가 필요 합니다.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일이내 발행시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.', 2500.00, 30, 1000000, NULL, true, '2025-06-18 13:14:32.003786', '2025-06-18 13:14:32.003786', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (182, 74, '[자체제작] 영수증 리뷰💬', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷실제 자체제작 영수증 리뷰 🙋🏻
· 실제 카드단말기를 통해 해당 업장의 영수증을 제작하여 영수증 리뷰(방문자리뷰)를 작성하는 상품 입니다.
-방문자리뷰 갯수 쌓기 및 맛집,카페 업종에 강력 추천 드립니다.

▶안내사항
· 작업 구동중에는 상품 변경 및 사진 추가,변경이 불가한 상품 입니다.
· 하루 발행량을 꼭 작성 해주세요.
· 사진전달을 위해 꼭 별도 문의가 필요 합니다.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일이내 발행시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.', 3500.00, 50, 1000000, NULL, true, '2025-06-18 13:14:54.963405', '2025-06-18 13:14:54.963405', NULL, 4);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (183, 75, '일반 키워드 자동완성어💫', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷네이버 검색창 자동완성 🙋🏻
· 검색창에 키워드를 검색시 하단에 자동으로 업장의 상호명이 노출되는 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경이 불가한 상품 입니다.
· 노출 원하는 키워드와 상호명을 꼭 기재 해주세요.
· 별도 문의는 아래 링크를 통해 문의 주세요.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일이내 작업 시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.
', 150000.00, 1, 1000000, NULL, true, '2025-06-18 13:15:38.3772', '2025-06-18 13:15:38.3772', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (184, 75, '맛집 키워드 자동완성어💫', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💙🇰🇷네이버 검색창 자동완성 🙋🏻
· 검색창에 키워드를 검색시 하단에 자동으로 업장의 상호명이 노출되는 상품 입니다.

▶안내사항
· 작업 구동중에는 키워드 변경이 불가한 상품 입니다.
· 노출 원하는 키워드와 상호명을 꼭 기재 해주세요.
· 별도 문의는 아래 링크를 통해 문의 주세요.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일이내 작업 시작

▶링크입력 예
https://m.place.naver.com/----------
모바일 버전의 네이버 플레이스 링크를 입력 해주세요.

▶변경/취소/환불 불가 : 주의사항
작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.', 200000.00, 1, 1000000, NULL, true, '2025-06-18 13:15:53.909507', '2025-06-18 13:15:53.909507', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (185, 76, '슬롯🏃🏻‍♂️🏃🏻‍♀️', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
🛒네이버 스마트스토어 슬롯 노출 🙋🏻
· 네이버 쇼핑 검색 시 스마트스토어 상단 영역(슬롯)에 노출되어 타 매장보다 앞선 클릭 유도가 가능한 프리미엄 노출 상품입니다.

▶안내사항
· 1슬롯당 100유입, 10일 구동이 들어갑니다.
· 슬롯 노출은 지정 키워드 기반으로 운영 됩니다.
· 원하는 키워드와 스마트스토어 링크를 꼭 함께 전달해주세요.
· 상품 특성과 키워드에 따라 슬롯 노출 성과는 달라질 수 있습니다.
· 별도 문의는 아래 링크를 통해 문의 주세요.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일 이내 작업 시작

▶링크입력 예
https://smartstore.naver.com/----------
스마트스토어 상품 링크를 입력해주세요.

▶변경/취소/환불 불가 : 주의사항
· 작업이 시작된 이후에는 키워드 변경 및 환불이 불가합니다.
· 슬롯 특성상 시간 단위로 노출 결과가 달라질 수 있음을 유의해주세요.', 50000.00, 1, 1000000, NULL, true, '2025-06-18 13:16:41.253357', '2025-06-18 13:16:41.253357', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (186, 76, '상품찜💕', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
💚🛍️네이버 스마트스토어 상품찜 🙋🏻
· 스마트스토어 상품찜 수를 증가시켜 스토어 신뢰도 상승 및 알고리즘 노출 강화를 유도하는 상품입니다.
· 상품찜 수가 많을수록 상위 노출 및 쇼핑탭 내 경쟁력 강화에 효과적인 상품 입니다.

▶안내사항
· 작업은 스마트스토어 메인 상품찜 기준으로 진행됩니다.
· 상품찜 수는 자연스러운 속도로 분산되어 작업되며, 단기간 집중 작업을 지양합니다.
· 원하는 스마트스토어 상품 링크를 꼭 함께 전달해주세요.
· 별도 문의는 아래 링크를 통해 문의 주세요.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일 이내 작업 시작

▶링크입력 예
https://smartstore.naver.com/----------
상품찜을 원하는 스마트스토어 상품 링크를 입력해주세요.

▶변경/취소/환불 불가 : 주의사항
· 작업이 시작된 이후에는 변경 및 환불이 불가합니다.
· 상품찜 작업은 실제 노출 및 판매를 보장하는 상품은 아니며, 스토어 신뢰도 향상을 위한 서포트성 작업입니다.', 200.00, 1, 1000000, NULL, true, '2025-06-18 13:17:00.843335', '2025-06-18 13:17:00.843335', NULL, 2);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (187, 76, '알림받기📌', '📌서비스 신청 후 카카오채널로 문의 부탁드립니다.

📣[서비스]
🔔🛒네이버 스마트스토어 알림받기 🙋🏻
· 스마트스토어 ‘알림받기’를 통해 신상품 등록 시 고객에게 푸시 알림이 가는 구조로, 충성 고객 확보 및 재구매 유도에 효과적인 마케팅 상품입니다.

▶안내사항
· ‘알림받기’ 수가 많을수록 스토어의 인기 및 관심도 상승에 도움이 됩니다.
· 작업은 자연 유입 기반으로 분산되어 진행되며, 비정상적인 급증을 방지하기 위해 단계별로 수행됩니다.
· 원하는 스마트스토어 링크를 꼭 함께 전달해주세요.
· 별도 문의는 아래 링크를 통해 문의 주세요.
https://open.kakao.com/me/gramii

▶시작시간
· 주문 접수 후 3일 이내 작업 시작

▶링크입력 예
https://smartstore.naver.com/----------
알림받기 작업을 원하는 스마트스토어 메인 링크를 입력해주세요.

▶변경/취소/환불 불가 : 주의사항
· 작업이 시작된 이후에는 변경 및 환불이 불가합니다.
· 본 서비스는 스토어 팔로워 수를 증가시키는 마케팅 목적의 작업이며, 실시간 매출 증가와는 무관할 수 있습니다.', 200.00, 1, 1000000, NULL, true, '2025-06-18 13:17:16.913452', '2025-06-18 13:17:16.913452', NULL, 3);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (158, 77, '웹사이트 트래픽 from 구글🧡', '📣[서비스]
웹사이트 트래픽 구글 
웹사이트의 트레픽을 늘려드리는 서비스입니다.

[ 주문 후 작업시간]
평균 1~12시간내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

[서비스 설명]
100% 실제 유저 트래픽입니다.
전 세계에서 유입되는 트래픽입니다.
구글 애널리틱스 지원, 하루 평균 1만명 증가

[주의사항]
주문실수의 경우 취소 및 수정이 불가능합니다.
동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.
성인/도박/불법 사이트는 작업이 불가능합니다.

[링크형식]
전체 웹 사이트 URL을 입력해주세요', 1.30, 500, 10000000, '974', true, '2025-06-18 12:58:35.129627', '2025-06-18 12:58:35.129627', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (159, 78, '웹사이트 트래픽 from 페이스북💙', '📣[서비스]
웹사이트 트래픽 페이스북 
페이스북내에 트레픽을 늘려드리는 서비스입니다.

[ 주문 후 작업시간]
평균 1~12시간내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

[서비스 설명]
100% 실제 유저 트래픽입니다.
전 세계에서 유입되는 트래픽입니다.
하루 최대 5만명 증가

[주의사항]
주문실수의 경우 취소 및 수정이 불가능합니다.
동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.
성인/도박/불법 사이트는 작업이 불가능합니다.

[링크형식]
전체 웹 사이트 URL을 입력해주세요', 1.30, 500, 1000000, '975', true, '2025-06-18 12:58:51.628401', '2025-06-18 12:58:51.628401', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (160, 79, '웹사이트 트래픽 from 인스타그램💗', '📣[서비스]
웹사이트 트래픽 인스타그램 
인스타그램의 트레픽을 늘려드리는 서비스입니다.

[ 주문 후 작업시간]
평균 1~12시간내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

[서비스 설명]
100% 실제 유저 트래픽입니다.
전 세계에서 유입되는 트래픽입니다.
하루 최대 5만명 증가

[주의사항]
주문실수의 경우 취소 및 수정이 불가능합니다.
동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.
성인/도박/불법 사이트는 작업이 불가능합니다.

[링크형식]
전체 웹 사이트 URL을 입력해주세요', 1.30, 500, 1000000, '976', true, '2025-06-18 12:59:16.851451', '2025-06-18 12:59:16.851451', NULL, 1);
INSERT INTO public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) VALUES (161, 80, '웹사이트 트래픽 from 네이버💚', '📣[서비스]
웹사이트 트래픽 네이버 
네이버 웹사이트의 트레픽을 늘려드리는 서비스입니다.

[ 주문 후 작업시간]
평균 1~12시간내 시작됩니다.
365일 24시간 언제든지 자동으로 시작됩니다.

[서비스 설명]
100% 실제 유저 트래픽입니다.
데스크탑 45~55%
모바일 45~55%
실제 한국에서 유입되는 트래픽입니다.
하루 최대 10만명 증가
이탈율 30~40%

[주의사항]
주문실수의 경우 취소 및 수정이 불가능합니다.
동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.
성인/도박/불법 사이트는 작업이 불가능합니다.

[링크형식]
전체 웹 사이트 URL을 입력해주세요', 2.00, 1000, 1000000, '1746', true, '2025-06-18 12:59:49.25954', '2025-06-18 12:59:49.25954', NULL, 1);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 26, true);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_types_id_seq', 80, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 187, true);


--
-- PostgreSQL database dump complete
--

