--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.12

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
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: point_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.point_transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    transaction_type character varying(50) NOT NULL,
    related_order_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.point_transactions OWNER TO postgres;

--
-- Name: point_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.point_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.point_transactions_id_seq OWNER TO postgres;

--
-- Name: point_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.point_transactions_id_seq OWNED BY public.point_transactions.id;


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.service_categories OWNER TO postgres;

--
-- Name: service_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_categories_id_seq OWNER TO postgres;

--
-- Name: service_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;


--
-- Name: service_types; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.service_types OWNER TO postgres;

--
-- Name: service_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_types_id_seq OWNER TO postgres;

--
-- Name: service_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_types_id_seq OWNED BY public.service_types.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
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
    phone_number character varying(50),
    referrer_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: point_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_transactions ALTER COLUMN id SET DEFAULT nextval('public.point_transactions_id_seq'::regclass);


--
-- Name: service_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);


--
-- Name: service_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_types ALTER COLUMN id SET DEFAULT nextval('public.service_types_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, service_id, quantity, link, total_price, order_status, created_at, updated_at) FROM stdin;
5	3	2	22	http://localhost:3000/order	220.00	Pending	2025-05-18 22:01:56.211199	2025-05-18 22:01:56.211199
6	3	1	10000	http://localhost:3000/order	5000.00	Pending	2025-05-18 22:28:36.688388	2025-05-18 22:28:36.688388
\.


--
-- Data for Name: point_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.point_transactions (id, user_id, amount, transaction_type, related_order_id, created_at) FROM stdin;
1	3	-220	order_payment	5	2025-05-18 22:01:56.211199
2	3	-5000	order_payment	6	2025-05-18 22:28:36.688388
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
4	인스타그램 서비스	\N	t	2025-05-18 19:43:45.595187	2025-05-18 19:43:45.595187
5	🟥 유튜브 [ 구독자 , 좋아요 , 조회수]	\N	t	2025-05-18 20:57:04.752674	2025-05-18 20:57:04.752674
\.


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_types (id, category_id, name, description, is_active, created_at, updated_at) FROM stdin;
2	4	💗 인스타그램 유저 좋아요	\N	t	2025-05-18 20:47:30.22059	2025-05-18 20:47:30.22059
3	5	💗 유튜브  좋아요	\N	t	2025-05-18 20:57:04.752674	2025-05-18 20:57:04.752674
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at) FROM stdin;
2	3	🟥 [좋아요] 유튜브 외국인 동영상 좋아요	🔊 주문 전 주의사항\n1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n2⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.\n3⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.\n4⃣ 좋아요수가 보이게 공개 상태여야 합니다.\n\n🔉 주문 후 평균 시작시간\n24시간 주문이 가능하며 주문 후 평균 1시간~6시간내 자동으로 작업이 시작됩니다.\n(서버 상황에 따라 지연될 수 있습니다.)\n\n🔉 서비스품질 및 보장안내\n1⃣ 실제 외국인 작업\n2⃣ 30일내 이탈시 리필 가능 (담당자 문의)	10.00	22	100000	\N	t	2025-05-18 20:57:04.752674	2025-05-18 21:10:32.852342
1	2	[파워] [서버1] 실제 외국인 좋아요 AS30일	📣작업상품\n외국인 좋아요 입니다.\n\n서버 상태에 따라 주문 시작 및 처리 속도가 매번 다릅니다.\n\n[ 효과 ]\n높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.\n단순 좋아요 수치 증가를 원하면 권장드립니다.\n\n📣착수시간\n⏰ 1분~1시간 이내\n※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.50	10	500000	\N	t	2025-05-18 20:47:30.22059	2025-05-18 21:11:17.546589
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, password, email, points, role, created_at, updated_at, name, phone_number, referrer_id) FROM stdin;
3	$2b$10$R1x7QkJ54mBz1lgN5gcHX..tk9gL5IXaOrvDsqEmG4cwmT8poJOdW	gtod8010@naver.com	4780	user	2025-05-13 21:23:42.457399	2025-05-13 21:23:42.457399	강동현	010-5788-9281	\N
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 6, true);


--
-- Name: point_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.point_transactions_id_seq', 2, true);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 5, true);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_types_id_seq', 3, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: point_transactions point_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_name_key UNIQUE (name);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_types service_types_category_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_name_key UNIQUE (category_id, name);


--
-- Name: service_types service_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_service_type_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_name_key UNIQUE (service_type_id, name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: orders orders_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: point_transactions point_transactions_related_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.orders(id);


--
-- Name: point_transactions point_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_types service_types_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);


--
-- Name: services services_service_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_fkey FOREIGN KEY (service_type_id) REFERENCES public.service_types(id);


--
-- Name: users users_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

