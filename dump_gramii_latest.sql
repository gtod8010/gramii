--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    service_id integer NOT NULL,
    quantity integer NOT NULL,
    link character varying(2048),
    total_price numeric(10,2) NOT NULL,
    order_status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    processed_quantity integer DEFAULT 0
);


ALTER TABLE public.orders OWNER TO "dwight.k";

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO "dwight.k";

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: point_transactions; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.point_transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    transaction_type character varying(50) NOT NULL,
    related_order_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.point_transactions OWNER TO "dwight.k";

--
-- Name: point_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.point_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.point_transactions_id_seq OWNER TO "dwight.k";

--
-- Name: point_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.point_transactions_id_seq OWNED BY public.point_transactions.id;


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.service_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_categories OWNER TO "dwight.k";

--
-- Name: service_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_categories_id_seq OWNER TO "dwight.k";

--
-- Name: service_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;


--
-- Name: service_types; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.service_types (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_types OWNER TO "dwight.k";

--
-- Name: service_types_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.service_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_types_id_seq OWNER TO "dwight.k";

--
-- Name: service_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.service_types_id_seq OWNED BY public.service_types.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.services (
    id integer NOT NULL,
    service_type_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price_per_unit numeric(10,2) NOT NULL,
    min_order_quantity integer NOT NULL,
    max_order_quantity integer NOT NULL,
    external_id character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO "dwight.k";

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO "dwight.k";

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dwight.k
--

CREATE TABLE public.users (
    id integer NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    points integer DEFAULT 0,
    role character varying(50) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) NOT NULL,
    phone_number character varying(50) NOT NULL,
    referrer_id integer,
    admin_referral_code character varying(4)
);


ALTER TABLE public.users OWNER TO "dwight.k";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dwight.k
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "dwight.k";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dwight.k
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: point_transactions id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.point_transactions ALTER COLUMN id SET DEFAULT nextval('public.point_transactions_id_seq'::regclass);


--
-- Name: service_categories id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);


--
-- Name: service_types id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_types ALTER COLUMN id SET DEFAULT nextval('public.service_types_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.orders (id, user_id, service_id, quantity, link, total_price, order_status, created_at, updated_at, processed_quantity) FROM stdin;
6	3	1	10000	http://localhost:3000/order	5000.00	Pending	2025-05-18 22:28:36.688388	2025-05-18 22:28:36.688388	0
7	3	22	100	test	30.00	Pending	2025-05-21 18:48:41.315371	2025-05-21 18:48:41.315371	0
8	3	28	1	test	30.00	Pending	2025-05-21 19:03:50.451483	2025-05-21 19:03:50.451483	0
\.


--
-- Data for Name: point_transactions; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.point_transactions (id, user_id, amount, transaction_type, related_order_id, created_at) FROM stdin;
2	3	-5000	order_payment	6	2025-05-18 22:28:36.688388
3	3	-30	order_payment	7	2025-05-21 18:48:41.315371
4	3	-30	order_payment	8	2025-05-21 19:03:50.451483
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.service_categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
4	인스타그램 서비스	\N	t	2025-05-18 19:43:45.595187	2025-05-18 19:43:45.595187
\.


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.service_types (id, category_id, name, description, is_active, created_at, updated_at) FROM stdin;
2	4	💗 인스타그램 유저 좋아요	\N	t	2025-05-18 20:47:30.22059	2025-05-18 20:47:30.22059
4	4	👩‍❤️‍👨인스타그램 유저 팔로워	인스타그램 사용자의 팔로워를 늘리는 서비스입니다.	t	2025-05-21 18:42:09.410197	2025-05-21 18:42:09.410197
5	4	💬 인스타그램 댓글	인스타그램 게시물에 댓글을 제공하는 서비스입니다.	t	2025-05-21 18:42:09.410197	2025-05-21 18:42:09.410197
6	4	🌈 인스타그램 도달 노출 프로필방문 조회수	인스타그램 게시물의 도달, 노출, 프로필 방문, 조회수 등을 늘리는 서비스입니다.	t	2025-05-21 18:44:02.570217	2025-05-21 18:44:02.570217
7	4	🔃 인스타그램 자동화 서비스	인스타그램 계정 활동을 자동화하는 서비스입니다.	t	2025-05-21 19:02:11.95397	2025-05-21 19:02:11.95397
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at) FROM stdin;
1	2	[파워] [서버1] 실제 외국인 좋아요 AS30일	📣작업상품\n외국인 좋아요 입니다.\n\n서버 상태에 따라 주문 시작 및 처리 속도가 매번 다릅니다.\n\n[ 효과 ]\n높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.\n단순 좋아요 수치 증가를 원하면 권장드립니다.\n\n📣착수시간\n⏰ 1분~1시간 이내\n※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.50	10	500000	\N	t	2025-05-18 20:47:30.22059	2025-05-18 21:11:17.546589
4	2	[파워] 리얼 한국인 게시물 좋아요❤️		3.00	50	10000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
5	2	실제 한국인 남성 게시물 좋아요		30.00	5	5000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
6	2	실제 한국인 여성 게시물 좋아요		30.00	5	5000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
7	2	실제 한국인 20대 연령 게시물 좋아요		30.00	5	10000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
8	2	실제 한국인 20대 연령 남성 게시물 좋아요		40.00	5	3000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
9	2	실제 한국인 20대 연령 여성 게시물 좋아요		40.00	5	5000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
10	2	실제 한국인 30대 연령 게시물 좋아요		30.00	5	5000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
11	2	실제 한국인 30대 연령 남성 게시물 좋아요		40.00	5	3000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
12	2	실제 한국인 30대 연령 여성 게시물 좋아요		40.00	5	3000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
13	2	실제 한국인 좋아요 늘리기❤️		15.00	5	10000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
14	2	[파워] [서버2] 실제 외국인 좋아요 AS30일		0.60	10	500000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
15	2	상위노출 리얼 한국인 좋아요		10.00	100	1000	\N	t	2025-05-21 18:39:12.509941	2025-05-21 18:39:12.509941
16	4	[고품질] 외국인 팔로워 🤔		6.00	10	5000000	\N	t	2025-05-21 18:42:34.452202	2025-05-21 18:42:34.452202
17	4	[추천]🇰🇷실제 한국인 팔로워		100.00	10	50000	\N	t	2025-05-21 18:42:34.452202	2025-05-21 18:42:34.452202
18	4	[가성비]🇰🇷고품질 한국인 팔로워		30.00	1	15000	\N	t	2025-05-21 18:42:34.452202	2025-05-21 18:42:34.452202
19	5	인스타 실제 한국인 지정 댓글		200.00	3	2000	\N	t	2025-05-21 18:42:34.452202	2025-05-21 18:42:34.452202
20	5	인스타 실제 한국인 랜덤 댓글		200.00	3	2000	\N	t	2025-05-21 18:42:34.452202	2025-05-21 18:42:34.452202
22	6	[파워] 실제 한국인 프로필 방문		0.30	100	500000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
23	6	[파워] [빠름] 실제 한국인 노출 + 도달		0.30	10	10000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
24	6	[파워] 실제 한국인 저장		0.50	100	1000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
25	6	[파워] [서버1] 실제 한국인 노출 + 도달 + 탐색 탭		1.00	100	2000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
26	6	📹[빠름] 인스타그램 동영상 조회수		0.10	100	100000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
27	6	[파워] [느림] 실제 한국인 노출 + 도달		0.25	100	1000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 18:44:19.829746
28	7	인스타그램 외국인 자동 이모지 댓글❤️		30.00	1	2000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
29	7	인스타그램 한국인 실유저 노출+도달+프로필방문❤️		0.60	100	1000000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
30	7	[파워/빠름] 실제 한국인 게시물 자동 좋아요		4.00	1	10000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
31	7	실제 한국인 자동 게시물 댓글		250.00	3	10000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
32	7	인스타그램 한국인 게시물 자동 저장		1.00	100	60000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
33	7	인스타그램 한국인 게시물 자동 공유		1.00	100	5000000	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
34	7	[자동✅원클릭/슈퍼+]🇰🇷리얼한국인 좋아요❤️+댓글💬 - 3,500원		3000.00	1	101	\N	t	2025-05-21 19:02:30.736862	2025-05-21 19:02:30.736862
21	6	[파워] 실제 한국인 공유	📣작업상품\n실제 한국인 공유입니다.\n※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.\n\n📣착수시간\n⏰ 10분~30분 이내\n※동시 주문량이 많은경우 60분까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣혜택\n인기게시물 상승 및 유지에 도움이 됩니다.\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	1.00	100	5000000	\N	t	2025-05-21 18:44:19.829746	2025-05-21 19:13:51.470558
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dwight.k
--

COPY public.users (id, password, email, points, role, created_at, updated_at, name, phone_number, referrer_id, admin_referral_code) FROM stdin;
3	$2b$10$R1x7QkJ54mBz1lgN5gcHX..tk9gL5IXaOrvDsqEmG4cwmT8poJOdW	gtod8010@naver.com	4720	admin	2025-05-13 21:23:42.457399	2025-05-13 21:23:42.457399	강동현	010-5788-9281	\N	1234
4	$2b$10$xRdHqkTPVYJCuetbhicGTOAlpB7aQOaA6RJkP57kup4.I0PHcH1Fe	you@1.com	0	user	2025-05-21 19:24:43.583228	2025-05-21 19:24:43.583228	홍길동	010-2222-2222	3	\N
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.orders_id_seq', 8, true);


--
-- Name: point_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.point_transactions_id_seq', 4, true);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 5, true);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.service_types_id_seq', 7, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.services_id_seq', 34, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dwight.k
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: point_transactions point_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_name_key UNIQUE (name);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_types service_types_category_id_name_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_name_key UNIQUE (category_id, name);


--
-- Name: service_types service_types_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_service_type_id_name_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_name_key UNIQUE (service_type_id, name);


--
-- Name: users users_admin_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_admin_referral_code_key UNIQUE (admin_referral_code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders orders_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: point_transactions point_transactions_related_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.orders(id);


--
-- Name: point_transactions point_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_types service_types_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);


--
-- Name: services services_service_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_fkey FOREIGN KEY (service_type_id) REFERENCES public.service_types(id);


--
-- Name: users users_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dwight.k
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

