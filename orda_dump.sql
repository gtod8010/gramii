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

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: deposit_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deposit_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    depositor_name character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    receipt_type character varying(50) DEFAULT 'none'::character varying,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    confirmed_at timestamp with time zone,
    receipt_info jsonb,
    admin_memo text,
    account_number character varying(255),
    is_tax_invoice_processed boolean DEFAULT false NOT NULL,
    CONSTRAINT deposit_requests_amount_check CHECK ((amount > 0))
);


--
-- Name: deposit_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deposit_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deposit_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deposit_requests_id_seq OWNED BY public.deposit_requests.id;


--
-- Name: main_page_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.main_page_metrics (
    metric_id character varying(50) NOT NULL,
    metric_name character varying(100) NOT NULL,
    current_value bigint DEFAULT 0 NOT NULL,
    base_value_for_daily bigint DEFAULT 0,
    last_calculated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    increment_per_hour integer DEFAULT 0,
    increment_per_day_fixed integer DEFAULT 0,
    last_daily_increment_date date
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
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
    processed_quantity integer DEFAULT 0,
    realsite_order_id integer
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: point_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.point_transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    transaction_type character varying(50) NOT NULL,
    related_order_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    balance_after_transaction integer
);


--
-- Name: point_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.point_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: point_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.point_transactions_id_seq OWNED BY public.point_transactions.id;


--
-- Name: realsite_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realsite_services (
    id integer NOT NULL,
    realsite_service_id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(100),
    category character varying(255),
    rate numeric(14,6) NOT NULL,
    min_order integer NOT NULL,
    max_order integer NOT NULL,
    dripfeed boolean DEFAULT false,
    refill boolean DEFAULT false,
    cancel boolean DEFAULT false,
    last_synced_at timestamp with time zone DEFAULT now()
);


--
-- Name: realsite_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.realsite_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: realsite_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.realsite_services_id_seq OWNED BY public.realsite_services.id;


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    display_order integer NOT NULL
);


--
-- Name: service_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;


--
-- Name: service_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_types (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    display_order integer NOT NULL
);


--
-- Name: service_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_types_id_seq OWNED BY public.service_types.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    special_id integer,
    display_order integer NOT NULL
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: sms_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sms_logs (
    id integer NOT NULL,
    sender character varying(255),
    body text,
    received_at_app timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: sms_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sms_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sms_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sms_logs_id_seq OWNED BY public.sms_logs.id;


--
-- Name: specials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specials (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: specials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.specials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: specials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.specials_id_seq OWNED BY public.specials.id;


--
-- Name: user_service_prices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_service_prices (
    id integer NOT NULL,
    user_id integer NOT NULL,
    service_id integer NOT NULL,
    custom_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TABLE user_service_prices; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.user_service_prices IS '사용자별 특정 서비스에 대한 특별 단가 설정 테이블';


--
-- Name: COLUMN user_service_prices.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.id IS '고유 식별자';


--
-- Name: COLUMN user_service_prices.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.user_id IS '사용자 ID (users 테이블 참조)';


--
-- Name: COLUMN user_service_prices.service_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.service_id IS '서비스 ID (services 테이블 참조)';


--
-- Name: COLUMN user_service_prices.custom_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.custom_price IS '사용자 지정 특별 단가';


--
-- Name: COLUMN user_service_prices.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.created_at IS '생성 일시';


--
-- Name: COLUMN user_service_prices.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.user_service_prices.updated_at IS '수정 일시';


--
-- Name: user_service_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_service_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_service_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_service_prices_id_seq OWNED BY public.user_service_prices.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
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
    admin_referral_code character varying(6),
    username character varying(255)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: deposit_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deposit_requests ALTER COLUMN id SET DEFAULT nextval('public.deposit_requests_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: point_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_transactions ALTER COLUMN id SET DEFAULT nextval('public.point_transactions_id_seq'::regclass);


--
-- Name: realsite_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realsite_services ALTER COLUMN id SET DEFAULT nextval('public.realsite_services_id_seq'::regclass);


--
-- Name: service_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);


--
-- Name: service_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types ALTER COLUMN id SET DEFAULT nextval('public.service_types_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: sms_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_logs ALTER COLUMN id SET DEFAULT nextval('public.sms_logs_id_seq'::regclass);


--
-- Name: specials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specials ALTER COLUMN id SET DEFAULT nextval('public.specials_id_seq'::regclass);


--
-- Name: user_service_prices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_prices ALTER COLUMN id SET DEFAULT nextval('public.user_service_prices_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: deposit_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deposit_requests (id, user_id, amount, depositor_name, status, receipt_type, requested_at, confirmed_at, receipt_info, admin_memo, account_number, is_tax_invoice_processed) FROM stdin;
6	8	11000	테스트	pending	tax_invoice	2025-06-18 22:45:27.090149+09	\N	{"email": "gtod80104@naver.com", "ceoName": "나", "companyName": "가", "contactNumber": "01022222222", "businessNumber": "1020230"}	\N	KB 국민은행 444401-01-499150	f
7	8	11000	정영운	pending	tax_invoice	2025-06-20 15:57:25.43003+09	\N	{"email": "yw@naver.com", "ceoName": "정영운", "companyName": "그래미", "contactNumber": "01057889281", "businessNumber": "1112020111"}	\N	KB 국민은행 444401-01-499150	f
8	8	10000	강동연	pending	none	2025-06-20 15:58:54.067966+09	\N	\N	\N	KB 국민은행 444401-01-499150	f
9	8	11000	가나	pending	tax_invoice	2025-06-20 16:23:15.802095+09	\N	{"email": "gtod8010@naver.com", "ceoName": "가", "companyName": "아", "contactNumber": "1010301", "businessNumber": "101023020"}	\N	KB 국민은행 444401-01-499150	f
10	8	11000	강동현	pending	tax_invoice	2025-07-11 15:04:14.009902+09	\N	{"email": "user@test.com", "ceoName": "정영운", "companyName": "가", "businessItem": "나", "businessType": "간", "contactNumber": "01090083547", "businessNumber": "1112020111"}	\N	KB 국민은행 444401-01-499150	f
\.


--
-- Data for Name: main_page_metrics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.main_page_metrics (metric_id, metric_name, current_value, base_value_for_daily, last_calculated_at, increment_per_hour, increment_per_day_fixed, last_daily_increment_date) FROM stdin;
live_jobs	실시간 자동화 작업	12550	0	2025-08-03 17:37:08.003+09	1	0	2025-05-30
total_users	총 GRAMII 이용자	24350	0	2025-08-03 17:37:08.003+09	3	0	2025-05-30
orda_daily_orders	Orda Today's Order Count	5201	0	2025-08-03 17:37:08.003+09	2	0	\N
daily_completed	일일 요청 처리량	15852	0	2025-08-03 17:57:52.321+09	0	32	2025-08-03
orda_total_users	Orda Members	243355	0	2025-08-03 17:57:52.321+09	5	50	2025-08-03
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, service_id, quantity, link, total_price, order_status, created_at, updated_at, processed_quantity, realsite_order_id) FROM stdin;
1	8	93	3	http://localhost:3000/order	540.00	canceled	2025-07-11 16:30:04.522986	2025-07-11 16:30:04.522986	0	65120656
\.


--
-- Data for Name: point_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.point_transactions (id, user_id, amount, transaction_type, related_order_id, created_at, balance_after_transaction) FROM stdin;
1	8	-540	order_payment	1	2025-07-11 16:30:04.522986	3418
\.


--
-- Data for Name: realsite_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.realsite_services (id, realsite_service_id, name, type, category, rate, min_order, max_order, dripfeed, refill, cancel, last_synced_at) FROM stdin;
1	4107	Instagram Followers [ Max - 10M | Speed - 100k/day | All Flag Types Working | 30 Days Refill | Stable and Non Drop ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.320000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
2	4115	Instagram followers [ Max - 3M | Speed - 100k/day | No Refill | Latin Profiles | No Drop ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.150000	10	3000000	t	f	t	2025-06-15 19:46:39.040749+09
3	4116	Instagram followers [ Max - 3M | Speed - 100k/day | 60 Days Refill | Latin Profiles | No Drop ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.200000	10	3000000	t	f	t	2025-06-15 19:46:39.040749+09
4	4106	Instagram Followers [ All Flag Types Working | Speed: 200k per day | No Drop | 30 Days Refill ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.462500	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
5	4105	Instagram Followers [ All Flag Types Working | Speed: 200k per day | No Drop | 365 Days Refill ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.637500	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
6	4084	Instagram Followers [ Max - 1M | Speed: 30k-40k/Day | 30 Days Refill Button | Indian Quality ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.620000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
7	2498	Instagram Followers [ Max - 100k | Speed - 3k-4k/day | Mix Quality | No Refill ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.350000	100	100000	t	f	t	2025-06-15 19:46:39.040749+09
8	2770	Instagram Followers [ Max - 100k | Speed - 10k/day | Mix Quality | No Refill ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.680000	100	100000	t	f	t	2025-06-15 19:46:39.040749+09
9	4004	Instagram USA Followers [ Max - 100k | Speed - 2k-3k/day | Non Drop | Lifetime Guarantee ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	1.350000	10	100000	t	f	t	2025-06-15 19:46:39.040749+09
10	4025	Instagram Followers [ Max - 10M | Speed - 5k/hour | 30 Days Refill Button | Work On All Links ] INSTANT #BEST 🔥	Default	Instagram Followers [ Working After Update ] 🔥	2.820000	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
11	4046	Instagram Followers [ Max - 10M | Speed - 30k-40k/day | 30 Days Refill | Work On All Links ] INSTANT #BEST 🔥	Default	Instagram Followers [ Working After Update ] 🔥	3.393000	20	1000000	f	f	t	2025-06-15 19:46:39.040749+09
12	4042	Instagram Latin Followers [ Max 100K | 30 Days Refill Button | Stable | Speed - 20k/day ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	3.900000	20	1000000	f	f	t	2025-06-15 19:46:39.040749+09
13	4043	Instagram USA Followers [ Max - 200k | HQ USA Followers | Refill 30 Days ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	3.510000	10	200000	f	f	t	2025-06-15 19:46:39.040749+09
14	2995	Instagram Followers [ Max - 1M | Non Drop | 30 Days Refill With Button | Speed - 50k-100k/day | HQ ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	3.300000	10	1000000	f	f	t	2025-06-15 19:46:39.040749+09
15	3788	Instagram Followers [ Max - 700k | Speed - 10k-30k/day | 30 Days Auto Refill and 60 Days Refill Button ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	2.640000	100	700000	t	t	t	2025-06-15 19:46:39.040749+09
16	3789	Instagram Followers [ Max - 5M | Speed - 20k-30k/day | 30 Days Auto Refill and 60 Days Refill Button ] INSTANT	Default	Instagram Followers [ Working After Update ] 🔥	2.760000	100	5000000	t	t	t	2025-06-15 19:46:39.040749+09
17	3093	Youtube Live Stream [ 100% Concurrent | 15 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.060000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
18	3567	Youtube Live Stream [ 100% Concurrent | 30 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.120000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
19	3094	Youtube Live Stream [ 100% Concurrent | 60 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.240000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
20	3568	Youtube Live Stream [ 100% Concurrent | 90 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.360000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
21	3095	Youtube Live Stream [ 100% Concurrent | 120 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.480000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
22	3471	Youtube Live Stream [ 100% Concurrent | 150 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.600000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
23	3570	Youtube Live Stream [ 100% Concurrent | 180 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	0.720000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
24	3417	Youtube Live Stream [ 100% Concurrent | 360 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	1.440000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
25	3470	Youtube Live Stream [ 100% Concurrent | 720 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	2.880000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
26	3558	Youtube Live Stream [ 100% Concurrent | 1440 Minutes | High Quality | Fast ]	Default	Youtube Live Stream [ Cheap Price, Stable and Fast ] #NEW	5.760000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
27	3983	🎉 새해 특가, 최대 40% 할인! 지금 확인하세요! ❄️	Default	Realsite.shop 축하 행사 ❤️	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
28	3984	[이벤트1] 🇰🇷 인스타 실제 한국인 팔로워	Default	Realsite.shop 축하 행사 ❤️	28.793200	5	30000	t	f	f	2025-06-15 19:46:39.040749+09
29	3985	[이벤트2] 🇰🇷 인스타 실제 한국인 여성 팔로워	Default	Realsite.shop 축하 행사 ❤️	40.790300	5	20000	t	f	f	2025-06-15 19:46:39.040749+09
30	3986	[이벤트3] 🇰🇷 인스타 실제 한국인 남성 팔로워	Default	Realsite.shop 축하 행사 ❤️	40.790300	5	20000	t	f	f	2025-06-15 19:46:39.040749+09
31	3987	[이벤트4] [일반] 🇰🇷 실제 한국인 좋아요	Default	Realsite.shop 축하 행사 ❤️	5.758700	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
32	3988	[이벤트5] [여성] 🇰🇷 실제 한국인 좋아요	Default	Realsite.shop 축하 행사 ❤️	7.998100	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
33	3989	[이벤트6] [남성] 🇰🇷 실제 한국인 좋아요	Default	Realsite.shop 축하 행사 ❤️	7.998100	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
34	3990	[이벤트7] [일반] 🇰🇷 실제 한국인 댓글	Default	Realsite.shop 축하 행사 ❤️	67.184000	3	10000	t	f	f	2025-06-15 19:46:39.040749+09
35	3991	[이벤트8] [여성] 🇰🇷 실제 한국인 댓글	Default	Realsite.shop 축하 행사 ❤️	99.976200	3	5000	t	f	f	2025-06-15 19:46:39.040749+09
36	3992	[이벤트9] [남성] 🇰🇷 실제 한국인 댓글	Default	Realsite.shop 축하 행사 ❤️	99.976200	3	5000	t	f	f	2025-06-15 19:46:39.040749+09
37	3993	[이벤트10] [일반] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	Realsite.shop 축하 행사 ❤️	63.984800	3	10000	f	f	f	2025-06-15 19:46:39.040749+09
38	3994	[이벤트11] [여성] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	Realsite.shop 축하 행사 ❤️	99.976200	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
39	3995	[이벤트12] [남성] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	Realsite.shop 축하 행사 ❤️	99.976200	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
40	3996	[이벤트13] [유령] 🇰🇷 고퀄리티 한국인 팔로워	Default	Realsite.shop 축하 행사 ❤️	8.250000	1	15000	t	f	f	2025-06-15 19:46:39.040749+09
41	3997	[이벤트14] [파워] 🇰🇷 한국인 좋아요⚡Realsite.shop 단독⚡	Default	Realsite.shop 축하 행사 ❤️	0.856000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
42	3998	[이벤트15] [인플루언서] 🇰🇷 한국인 좋아요⚡Realsite.shop 단독⚡	Default	Realsite.shop 축하 행사 ❤️	2.625000	5	20000	t	f	f	2025-06-15 19:46:39.040749+09
43	4047	[이벤트15] [인플루언서] 🇰🇷 한국인 좋아요⚡Realsite.shop 단독⚡- 오토매틱	Subscriptions	Realsite.shop 축하 행사 ❤️	2.625000	5	20000	f	f	f	2025-06-15 19:46:39.040749+09
44	4052	인스타그램 한국인 팔로워, 빠르고 드롭 없음	Default	Realsite.shop 축하 행사 ❤️	15.000000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
45	4053	인스타그램 한국인 팔로워, 빠르고 드롭 없음 - 남성	Default	Realsite.shop 축하 행사 ❤️	15.000000	10	10000	t	f	f	2025-06-15 19:46:39.040749+09
46	4054	인스타그램 한국인 팔로워, 빠르고 드롭 없음 - 여성	Default	Realsite.shop 축하 행사 ❤️	15.000000	10	20000	t	f	f	2025-06-15 19:46:39.040749+09
47	3891	Instagram USA Followers [ Max - 30k | Insights : USA | Speed - 10k/day | All Accounts With Stories | Never Drop ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	6.500000	10	40000	t	f	f	2025-06-15 19:46:39.040749+09
48	3793	Instagram USA Likes + Impressions + Reach [ Max - 10k | Speed 2k/hour | English Profiles With Stories | BEST ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	2.600000	10	10000	t	f	t	2025-06-15 19:46:39.040749+09
49	3783	Instagram USA Followers [ Max - 100k | Speed - 2k-3k/day | NEVER DROP | Lifetime Guarantee ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	1.200000	10	100000	t	f	t	2025-06-15 19:46:39.040749+09
50	3784	Instagram Male USA Followers [ Max - 100k | Speed - 2k-3k/day | NEVER DROP | Lifetime Guarantee ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	1.200000	20	100000	t	f	t	2025-06-15 19:46:39.040749+09
51	3785	Instagram Female USA Followers [ Max - 100k | Speed - 2k-3k/day | NEVER DROP | Lifetime Guarantee ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	1.200000	20	100000	t	f	t	2025-06-15 19:46:39.040749+09
52	3937	--------------------------------------------	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
53	3931	Instagram USA Custom Comments [ Max - 1k | Speed - 100-300/hour | High Quality ] INSTANT	Custom Comments	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	1	100	t	f	f	2025-06-15 19:46:39.040749+09
54	3932	Instagram USA Custom Comments - Male [ Max - 1k | Speed - 100-300/hour | High Quality ] INSTANT	Custom Comments	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	1	100	t	f	f	2025-06-15 19:46:39.040749+09
55	3933	Instagram USA Custom Comments - Female [ Max - 1k | Speed - 100-300/hour | High Quality ] INSTANT	Custom Comments	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	1	100	t	f	f	2025-06-15 19:46:39.040749+09
56	3934	Instagram USA Random Comments [ Max - 1k | Speed - 100-300/hour | High Quality | Comment Related To Post ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
57	4051	Instagram AUTO USA Random Comments [ Max - 1k | Speed - 100-300/hour | High Quality | Comment Related To Post ] INSTANT	Subscriptions	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	2	100	f	f	t	2025-06-15 19:46:39.040749+09
58	3935	Instagram USA Random Comments - Male [ Max - 1k | Speed - 100-300/hour | High Quality | Comment Related To Post ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
59	3936	Instagram USA Random Comments - Female [ Max - 1k | Speed - 100-300/hour | High Quality | Comment Related To Post ] INSTANT	Default	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	4.800000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
60	4073	Instagram USA AUTO Likes + Impressions + Reach [ Max - 10k | Speed 2k/hour | English Profiles With Stories | BEST ] INSTANT	Subscriptions	[ 𝐔𝐒𝐀 ] Best Quality Instagram Followers and Likes	2.600000	20	10000	f	f	f	2025-06-15 19:46:39.040749+09
61	4122	YouTube Views [ Min 3K | Speed: 50K+/Day | Lifetime Guaranteed | Real Social Ads Views | Refill Button ] 0-12 HRS	Default	Youtube Views [ Working Stable After Update ]	1.014600	3000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
62	4123	YouTube Views [ Min 10K | Speed: 100K+/Day | Lifetime Guaranteed | Real Social Ads Views | Refill Button ] 0-12 HRS	Default	Youtube Views [ Working Stable After Update ]	0.818000	10000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
63	4124	YouTube Views [ Min 40K | Speed: 200K+/Day | Lifetime Guaranteed | Real Social Ads Views | Refill Button ] 0-12 HRS	Default	Youtube Views [ Working Stable After Update ]	0.698400	40000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
64	4111	YouTube Native ADS Views [ Minimum 300 | Speed - 10k+/day | No Drop | Lifetime Guarantee ] 0-1 HRS	Default	Youtube Views [ Working Stable After Update ]	0.996000	100	10000000	f	f	f	2025-06-15 19:46:39.040749+09
65	4112	YouTube Native ADS Views [ Minimum 1k | Speed - 20k-30k/day | No Drop | Lifetime Guarantee ] 0-1 HRS	Default	Youtube Views [ Working Stable After Update ]	0.996000	100	10000000	f	f	f	2025-06-15 19:46:39.040749+09
66	4113	YouTube Native ADS Views [ Minimum 3k | Speed - 50k/day | No Drop | Lifetime Guarantee ] 0-1 HRS	Default	Youtube Views [ Working Stable After Update ]	0.924000	3000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
67	4114	YouTube Native ADS Views [ Minimum 5k | Speed - 80k-100k/day | No Drop | Lifetime Guarantee ] 0-1 HRS	Default	Youtube Views [ Working Stable After Update ]	0.912000	5000	1000000	f	f	f	2025-06-15 19:46:39.040749+09
68	3579	Youtube Views [ Max - 100k | Speed - 3-5k/day | Real Active Views | Lifetime Guarantee ] INSTANT	Default	Youtube Views [ Working Stable After Update ]	1.320000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
69	3928	Youtube Views [ Max - 1M | Speed - 1k/day | Lifetime Guarantee ] INSTANT	Default	Youtube Views [ Working Stable After Update ]	1.128000	100	10000000	t	f	f	2025-06-15 19:46:39.040749+09
70	3683	Youtube Views [ Max - 1M | Speed - 5k/day | No Drop from last 1 year | Lifetime Guarantee ] INSTANT	Default	Youtube Views [ Working Stable After Update ]	1.620000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
71	3584	Youtube Views [ Max - 1M | Speed - 5k/day | Lifetime Auto Refill | Non Drop ] INSTANT	Default	Youtube Views [ Working Stable After Update ]	1.920000	100	10000000	t	f	f	2025-06-15 19:46:39.040749+09
72	3577	Youtube Views [ Max - 1M | High Retention | Speed - 500-1K/Day | Non Drop | 30 Days Guarantee ] 0-30 Mins	Default	Youtube Views [ Working Stable After Update ]	1.560000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
73	3684	Youtube Views [ Max - 1M | Speed - 3-5k/day | Stable | Lifetime Guarantee ] INSTANT	Default	Youtube Views [ Working Stable After Update ]	1.620000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
74	3802	Youtube Views [ Max - 10M | Real Active Views | Speed: 500K-800K/Day | Non Drop | 30 Days Guarantee ] 6-12 HRS	Default	Youtube Views [ Working Stable After Update ]	1.300000	20000	5000000	t	f	f	2025-06-15 19:46:39.040749+09
75	4125	Youtube Adword Views [Video length &lt; 5 mins] [Min 100K | Speed: 500K/Day | Lifetime Guaranteed | 24-48 Hours Completed ]	Default	Youtube Views [ Working Stable After Update ]	0.648000	100000	1000000000	f	f	f	2025-06-15 19:46:39.040749+09
76	4126	Youtube Adword Views [Video length &lt; 5 mins] [Min 500K | Speed: 2m/Day | Lifetime Guaranteed | 24-48 Hours Completed ]	Default	Youtube Views [ Working Stable After Update ]	0.348000	500000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
77	4127	Youtube Adword Views [Video length &lt; 5 mins] [Min 1m | Speed: 5m/Day | Lifetime Guaranteed | 24-48 Hours Completed ]	Default	Youtube Views [ Working Stable After Update ]	0.336000	1000000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
78	3694	[한국인] 🇰🇷 한국인 리그램 서비스	Default	[한국인] 인스타 리그램 서비스 🔄	212.239700	1	1000	f	f	f	2025-06-15 19:46:39.040749+09
79	3701	[한국인] 🇰🇷 한국인 리그램 서비스 - AUTOMATIC	Subscriptions	[한국인] 인스타 리그램 서비스 🔄	212.239700	1	1000	f	f	f	2025-06-15 19:46:39.040749+09
80	3721	[한국인] 🇰🇷 실제 한국인 스레드 팔로워	Default	[한국인] 스레드 서비스 ❤️	41.653300	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
81	3722	[한국인] 🇰🇷 실제 한국인 스레드 좋아요	Default	[한국인] 스레드 서비스 ❤️	8.330000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
82	3691	[상위노출] 인스타 인기게시물 상위노출	Default	인스타 인기게시물 상위노출 🚀	7.840000	100	500	t	f	f	2025-06-15 19:46:39.040749+09
83	3697	[상위노출] 인스타 인기게시물 상위노출\t- AUTOMATIC	Subscriptions	인스타 인기게시물 상위노출 🚀	7.840000	100	500	f	f	f	2025-06-15 19:46:39.040749+09
84	3889	[상위노출] 인스타 인기게시물 상위노출\t- 대체 서비스 #2	Default	인스타 인기게시물 상위노출 🚀	8.489600	100	10000	t	f	f	2025-06-15 19:46:39.040749+09
85	3902	[상위노출] 인스타 인기게시물 상위노출 - 대체 서비스 #2 - AUTOMATIC	Subscriptions	인스타 인기게시물 상위노출 🚀	8.489600	100	10000	f	f	f	2025-06-15 19:46:39.040749+09
86	3692	[상위노출] 인스타 인기게시물 상위노출 유지	Default	인스타 인기게시물 상위노출 🚀	31.836000	100	3000	t	f	f	2025-06-15 19:46:39.040749+09
87	3698	[상위노출] 인스타 인기게시물 상위노출 유지\t- AUTOMATIC	Subscriptions	인스타 인기게시물 상위노출 🚀	31.836000	100	3000	f	f	f	2025-06-15 19:46:39.040749+09
88	3693	[상위노출] 인스타 인기게시물 댓글	Default	인스타 인기게시물 상위노출 🚀	118.854200	3	10	f	f	f	2025-06-15 19:46:39.040749+09
89	3699	[상위노출] 인스타 인기게시물 댓글 - AUTOMATIC	Subscriptions	인스타 인기게시물 상위노출 🚀	118.854200	3	10	f	f	f	2025-06-15 19:46:39.040749+09
90	3814	[상위노출] 인스타 인기게시물 상위노출\t- 대체 서비스 #3 | 세계 최저가	Default	인스타 인기게시물 상위노출 🚀	6.162200	100	500	t	f	f	2025-06-15 19:46:39.040749+09
91	1556	🌟 Instagram Real Korean Likes + Impressions + Reach [ Real Likes | Max 15k | Non Drop ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	7.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
92	2393	↪ Instagram AUTO Real Korean Likes + Impressions + Reach [ Real Likes | Max 15k | Non Drop ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	7.000000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
93	2817	🌟 Instagram Korean Real Likes + Impressions + Reach [ BEST | Framed Network Likes With Stories | Non Drop | Max - 5000 ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	1.100000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
94	2824	↪ Instagram AUTO Korean Real Likes + Impressions + Reach [ BEST | Framed Network Likes With Stories | Non Drop | Max - 1500 ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	1.100000	1	2000	f	f	f	2025-06-15 19:46:39.040749+09
95	3938	[파워] 🇰🇷 한국인 좋아요 ⚡ Realsite 독점적인 ⚡	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	2.399500	10	1000	t	f	f	2025-06-15 19:46:39.040749+09
96	3945	↪ Instagram AUTO Korean POWER Likes [ Max - 1k | Speed - 100/hour | EXCLUSIVE ] 1-10 Mins	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	2.399500	10	1000	f	f	f	2025-06-15 19:46:39.040749+09
97	3888	🌟 Instagram Power Korean Likes + Impressions + Reach + Explore [ Max - 20k | Speed - 10k/hour | Non Drop ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	2.625000	5	20000	t	f	f	2025-06-15 19:46:39.040749+09
98	3946	↪ Instagram AUTO Power Korean Likes + Impressions + Reach + Explore [ Max - 20k | Speed - 10k/hour | Non Drop ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	2.625000	5	20000	f	f	f	2025-06-15 19:46:39.040749+09
99	3600	논드롭 한국 인스타그램 좋아요 수	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	4.850000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
100	3602	↪ Instagram AUTO Korean Likes [ Max - 10k | Speed - 1k-3k/hour | High Quality | Non Drop ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	4.850000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
101	3565	⭐️ Instagram Real Korean Likes [ Max - 2k | 100% Real Users | Highest Quality In The World | All Accounts With Stories ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	5.600000	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
102	3566	↪ Instagram AUTO Real Korean Likes [ Max - 2k | 100% Real Users | Highest Quality In The World | All Accounts With Stories ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	5.600000	5	5000	f	f	f	2025-06-15 19:46:39.040749+09
103	3588	Instagram Korean Likes [ Max - 10k | Non Drop | Cheap Likes | Organic Slow Speed ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.900000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
104	3947	↪ Instagram AUTO Korean Likes [ Max - 10k | Non Drop | Cheap Likes | Organic Slow Speed ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.900000	1	10000	f	f	f	2025-06-15 19:46:39.040749+09
105	3532	Instagram Korean Likes [ Max - 10k | Non Drop | High Quality | Fast Speed ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	2.388000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
106	3944	--------------------------------------------	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
107	3168	🌟 Instagram Real Korean Followers [ Max - 40k | Fast Speed | 100% Real Korean Users | Refill 3 Times Within 60 Days ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	35.000000	5	40000	t	f	f	2025-06-15 19:46:39.040749+09
108	3794	고품질의 한국 인스타그램 팔로워	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.250000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
109	3795	Instagram Korean Male Followers [ Max - 50k | Speed - 2k-3k/day | NEVER DROP | Lifetime Guarantee ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	9.900000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
110	3796	Instagram Korean Female Followers [ Max - 50k | Speed - 2k-3k/day | NEVER DROP | Lifetime Guarantee ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	9.900000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
111	3601	고품질 인스타그램 한국인 팔로워	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	25.000000	5	100000	t	f	f	2025-06-15 19:46:39.040749+09
112	2486	🌟 Instagram Korean Followers [ BEST | Speed - 2k-5k/day | Very Real Looking | Non Drop | Lifetime Guarantee | Max - 20k ] 0-1 HRS	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	45.000000	5	30000	t	f	f	2025-06-15 19:46:39.040749+09
113	3969	Instagram South Korea Followers [ Max - 30k | Non Drop | Fast Server | 30 Days Guarantee ] #Alternative Server	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	42.000000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
340	2535	Youtube - Shares (FB referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
114	3040	Instagram MALE 👦 Korean Followers [ BEST | Speed - 2k-5k/day | Very Real Looking | Non Drop | Lifetime Guarantee | Max - 5k ] 0-1 HRS	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	55.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
115	3041	Instagram FEMALE 👧 Korean Followers [ BEST | Speed - 2k-5k/day | Very Real Looking | Non Drop | Lifetime Guarantee | Max - 10k ] 0-1 HRS	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	55.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
116	3948	--------------------------------------------	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
117	3942	[여성] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
118	3943	[남성] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
119	3534	Instagram Korean Random Comments [ Max - 1k | Non Drop | Cheap ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	15.000000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
120	3175	Instagram Real Korean Views [ Max - 300k | Fast Speed | Works for all videos | 100% Real Korean Users ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.720000	100	50000000	t	f	t	2025-06-15 19:46:39.040749+09
121	2891	인스 타 그램 한국인 노출 수 + 도달 범위 [최대 500 만명 | 진짜 한국어 | 빨리 | 랭킹 탑] 인스턴트	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.700000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
122	2892	인스 타 그램 한국인 노출 수 + 도달 범위 + 프로필 방문수 [최대 500 만 명 | 진짜 한국어 | 빨리 | 랭킹 탑] 인스턴트	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.700000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
123	3169	Instagram Real Korean Likes In Their 20s [ Real Likes | Max 5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
124	3170	Instagram Real 👧 FEMALE Korean Likes In Their 20s [ Real Likes | Max 2.5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	11.779100	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
125	3312	↪ Instagram AUTO Real 👧 FEMALE Korean Likes In Their 20s [ Real Likes | Max 2.5k | Non Drop ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	11.779100	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
126	3171	Instagram Real MALE 👦 Korean Likes In Their 20s [ Real Likes | Max 2.5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	11.779100	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
127	3172	Instagram Real Korean Likes In Their 30s [ Real Likes | Max 5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
128	3173	Instagram Real 👧 FEMALE Korean Likes In Their 30s [ Real Likes | Max 2.5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	11.779100	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
129	3174	Instagram Real MALE 👦 Korean Likes In Their 30s [ Real Likes | Max 2.5k | Non Drop ] INSTANT 🆕	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	11.779100	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
130	2487	Instagram Real MALE 👦 Korean Likes + Impressions + Reach [ Real Likes | Max 3k | Non Drop ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
131	3300	↪ Instagram AUTO Real MALE 👦 Korean Likes + Impressions + Reach [ Real Likes | Max 3k | Non Drop ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	f	f	f	2025-06-15 19:46:39.040749+09
132	2488	Instagram Real 👧 FEMALE Korean Likes + Impressions + Reach [ Real Likes | Max 3k | Non Drop ] INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
133	3301	↪ Instagram AUTO Real 👧 FEMALE Korean Likes + Impressions + Reach [ Real Likes | Max 3k | Non Drop ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	8.725200	5	5000	f	f	f	2025-06-15 19:46:39.040749+09
134	2976	Instagram Korean Random Comments [ Very Real Looking Users | Max 1000 | Non Drop ] SUPER INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	80.000000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
135	3571	Instagram AUTO Korean Emoji Comments [ Very Real Looking Users | Max 1000 | Non Drop ] SUPER INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	80.000000	2	100	f	f	f	2025-06-15 19:46:39.040749+09
136	2825	Instagram Korean Custom Comments [ Very Real Looking Users | Max 1000 | Non Drop ] SUPER INSTANT	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	85.000000	1	100	f	f	f	2025-06-15 19:46:39.040749+09
137	2778	🌟 Instagram Real Korean Random Comments [ Real Users | Max 100 | Non Drop ] SUPER INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	69.016300	3	10000	t	f	f	2025-06-15 19:46:39.040749+09
138	2782	↪ AUTO Instagram Real Korean Random Comments [ Real Users | Max 100 | Non Drop ] SUPER INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	69.016300	3	10000	f	f	f	2025-06-15 19:46:39.040749+09
139	2779	Instagram Real Korean Random 👧 FEMALE Comments [ Real FEMALE Users | Max 100 | Non Drop ] SUPER INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	t	f	f	2025-06-15 19:46:39.040749+09
140	3298	↪ Instagram AUTO Real Korean Random 👧 FEMALE Comments [ Real FEMALE Users | Max 100 | Non Drop ] SUPER INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
141	2780	Instagram Real Korean Random MALE 👦 Comments [ Real MALE Users | Max 100 | Non Drop ] SUPER INSTANT	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	t	f	f	2025-06-15 19:46:39.040749+09
142	3299	↪ Instagram AUTO Real Korean Random MALE 👦 Comments [ Real MALE Users | Max 100 | Non Drop ] SUPER INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	102.702800	3	5000	f	f	f	2025-06-15 19:46:39.040749+09
143	3644	AUTO Instagram Korean Impressions + Reach + Profile Visits [ Max 5M | Real Korean | Fast | Top For Ranking ] INSTANT	Subscriptions	▶ 인스타그램 한국인 좋아요/조회수 ❤️	0.700000	100	5000000	f	f	f	2025-06-15 19:46:39.040749+09
144	3876	인스타그램 한국어 맞춤 댓글	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	1	100	f	f	f	2025-06-15 19:46:39.040749+09
145	3877	인스타그램 한국어 맞춤 댓글 - 남성	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	1	100	f	f	f	2025-06-15 19:46:39.040749+09
146	3878	인스타그램 한국어 맞춤 댓글 - 여성	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	1	100	f	f	f	2025-06-15 19:46:39.040749+09
147	3879	인스타그램 한국어 무작위 댓글	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
148	3880	인스타그램 한국어 무작위 댓글 - 남성	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
149	3881	인스타그램 한국어 무작위 댓글 - 여성	Default	▶ 인스타그램 한국인 좋아요/조회수 ❤️	18.000000	2	100	t	f	f	2025-06-15 19:46:39.040749+09
150	3941	[일반] 🇰🇷 실제 한국인 커스텀 댓글	Custom Comments	▶ 인스타그램 한국인 좋아요/조회수 ❤️	65.729800	3	10000	f	f	f	2025-06-15 19:46:39.040749+09
151	3623	50개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	4.620000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
152	3624	100개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	9.240000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
153	3628	150개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	13.860000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
154	3625	200개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	18.480000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
155	3627	250개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	23.100000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
156	3626	300개의 한국 인스타그램이 30일 동안 각 새 게시물에 좋아요를 누릅니다.	Default	인스타그램 한국인 좋아요 [ 월간패키지 ] 🇰🇷	27.720000	1000	1000	f	f	f	2025-06-15 19:46:39.040749+09
157	2187	Youtube South Korean Unique Views [ Max - 100k | Speed - 500/day | Google Search - Real and Active Views ] INSTANT	Default	▶ 한국어 유튜브 서비스 ▶️	9.900000	500	100000	f	f	f	2025-06-15 19:46:39.040749+09
158	2589	Youtube South Korean Unique Views [ Max - 100k | Speed - 500/day | RAV - Real and Active Views ] INSTANT	Default	▶ 한국어 유튜브 서비스 ▶️	10.037500	500	100000	f	f	f	2025-06-15 19:46:39.040749+09
159	1173	Youtube South Korean Unique Views [ Max - 100k | Speed - 500/day | RAV-MTS - High Monetization Views ] INSTANT	Default	▶ 한국어 유튜브 서비스 ▶️	13.612500	500	100000	f	f	f	2025-06-15 19:46:39.040749+09
160	3648	South Korean YouTube Likes [ Max - 5k | Speed - 100-150/day | Non Drop ] 0-30 Mins	Default	▶ 한국어 유튜브 서비스 ▶️	1.500000	20	25000	t	f	f	2025-06-15 19:46:39.040749+09
161	2835	Real Korean YouTube Video Shares [ Max - 10k | Speed - 200/day | Real | Non Drop ] 0-1 HRS	Default	▶ 한국어 유튜브 서비스 ▶️	1.485000	50	10000	t	f	f	2025-06-15 19:46:39.040749+09
162	3132	Real Korean Facebook Page Likes + Followers [ Max - 10k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	101.991000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
163	3133	Real Korean 👧 FEMALE Facebook Page Likes + Followers [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
164	3134	Real Korean 👦 MALE Facebook Page Likes + Followers [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
165	3135	Real Korean Facebook Page Likes + Followers In Their 20s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
166	3136	Real Korean 👧 FEMALE Facebook Page Likes + Followers In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
167	3137	Real Korean 👦 MALE Facebook Page Likes + Followers In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
168	3138	Real Korean Facebook Page Likes + Followers In Their 30s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
169	3139	Real Korean 👧 FEMALE Facebook Page Likes + Followers In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
170	3140	Real Korean 👦 MALE Facebook Page Likes + Followers In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 페이지 좋아요+팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
171	3141	Real Korean Profile / Personal Account Followers [ Max - 10k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	101.991000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
172	3142	Real Korean 👧 FEMALE Profile / Personal Account Followers [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
173	3143	Real Korean 👦 MALE Profile / Personal Account Followers [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
174	3144	Real Korean Profile / Personal Account Followers In Their 20s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
175	3145	Real Korean 👧 FEMALE Profile / Personal Account Followers In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
176	3146	Real Korean 👦 MALE Profile / Personal Account Followers In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
177	3147	Real Korean Profile / Personal Account Followers In Their 30s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	152.964700	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
178	3148	Real Korean 👧 FEMALE Profile / Personal Account Followers In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
179	3149	Real Korean 👦 MALE Profile / Personal Account Followers In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 프로필(개인계정) 팔로워 서비스 🇰🇷	203.953000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
180	3150	Real Korean Post Likes [ Max - 10k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	14.570200	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
181	3151	Real Korean 👧 FEMALE Post Likes [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	21.852100	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
341	2536	Youtube - Shares (TW referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
182	3152	Real Korean 👦 MALE Post Likes [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	21.852100	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
183	3153	Real Korean Post Likes In Their 20s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	21.852100	5	5000	f	f	f	2025-06-15 19:46:39.040749+09
184	3154	Real Korean 👧 FEMALE Post Likes In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	29.136200	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
185	3155	Real Korean 👦 MALE Post Likes In Their 20s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	29.136200	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
186	3156	Real Korean Post Likes In Their 30s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	21.852100	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
187	3157	Real Korean 👧 FEMALE Post Likes In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	29.136200	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
188	3158	Real Korean 👦 MALE Post Likes In Their 30s [ Max - 2.5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 좋아요 서비스 🇰🇷	29.136200	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
189	3159	Real Korean Post Comments [ Max - 10k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 댓글 서비스 🇰🇷	101.991000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
190	3160	Real Korean 👧 FEMALE Post Comments [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 댓글 서비스 🇰🇷	146.659600	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
191	3161	Real Korean 👦 MALE Post Comments [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 댓글 서비스 🇰🇷	146.659600	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
192	3162	Real Korean Post Comments In Their 20s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 댓글 서비스 🇰🇷	146.659600	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
193	3165	Real Korean Post Comments In Their 30s [ Max - 5k | Natural Speed | 100% Real Korean Users ] INSTANT	Default	▶ 페이스북 게시물 댓글 서비스 🇰🇷	146.659600	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
194	3123	Real Korean Youtube Video Comments [ Max - 10k | Speed - 10-100/day | 100% Real Korean Users ] INSTANT	Default	▶ 한국 유튜브 댓글 🇰🇷	139.675800	5	1000	f	f	f	2025-06-15 19:46:39.040749+09
195	3124	Real Korean 👧 FEMALE Youtube Video Comments [ Max - 5k | Speed - 10-100/day | 100% Real Korean Users ] INSTANT	Default	▶ 한국 유튜브 댓글 🇰🇷	209.513700	5	1000	f	f	f	2025-06-15 19:46:39.040749+09
196	3125	Real Korean 👦 MALE Youtube Video Comments [ Max - 5k | Speed - 10-100/day | 100% Real Korean Users ] INSTANT	Default	▶ 한국 유튜브 댓글 🇰🇷	209.513700	5	1000	f	f	f	2025-06-15 19:46:39.040749+09
197	3105	Real Korean Youtube Subscribers [ Max - 10k | Speed - 1-30/day | 100% Real Korean Users | 30 Days Guarantee ] INSTANT	Default	▶ 한국 유튜브 구독자 🇰🇷	144.307000	5	200	f	f	f	2025-06-15 19:46:39.040749+09
198	2971	🌟 Instagram Real Japanese Followers [ Max - 15k | Speed - 500-1k/hour | Non Drop | R30 ] INSTANT	Default	▶ Instagram Japanese Followers	42.000000	5	40000	t	f	f	2025-06-15 19:46:39.040749+09
199	3764	Instagram Real MALE Japanese Followers	Default	▶ Instagram Japanese Followers	63.000000	5	8000	t	f	f	2025-06-15 19:46:39.040749+09
200	3765	Instagram Real FEMALE Japanese Followers	Default	▶ Instagram Japanese Followers	63.000000	5	40000	t	f	f	2025-06-15 19:46:39.040749+09
201	3766	Instagram Real Japanese Followers In Their 20s	Default	▶ Instagram Japanese Followers	63.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
202	3767	Instagram Real Japanese Followers In Their 30s	Default	▶ Instagram Japanese Followers	63.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
203	3768	Instagram Real MALE Japanese Followers In Their 20s	Default	▶ Instagram Japanese Followers	77.000000	5	4000	t	f	f	2025-06-15 19:46:39.040749+09
204	3769	Instagram Real MALE Japanese Followers In Their 30s	Default	▶ Instagram Japanese Followers	77.000000	5	4000	t	f	f	2025-06-15 19:46:39.040749+09
205	3770	Instagram Real FEMALE Japanese Followers In Their 20s	Default	▶ Instagram Japanese Followers	77.000000	5	6000	t	f	f	2025-06-15 19:46:39.040749+09
206	3771	Instagram Real FEMALE Japanese Followers In Their 30s	Default	▶ Instagram Japanese Followers	77.000000	5	6000	t	f	f	2025-06-15 19:46:39.040749+09
207	2973	인스 타 그램 한국인 노출 수 + 도달 범위 [최대 500 만명 | 진짜 한국어 | 빨리 | 랭킹 탑] 인스턴트	Default	▶ Instagram Japanese Likes	0.700000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
208	2972	🌟 Instagram Real Japanese Likes [ Max - 10k | Speed - 500-1k/hour | Non Drop | R30 ] INSTANT	Default	▶ Instagram Japanese Likes	9.100000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
209	3755	Instagram Real Japanese Likes [ Slow ]	Default	▶ Instagram Japanese Likes	9.100000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
210	3756	Instagram Real MALE Japanese Likes	Default	▶ Instagram Japanese Likes	12.600000	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
211	3757	Instagram Real FEMALE Japanese Likes	Default	▶ Instagram Japanese Likes	12.600000	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
212	3758	Instagram Real Japanese Likes In Their 20s	Default	▶ Instagram Japanese Likes	12.600000	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
213	3759	Instagram Real Japanese Likes In Their 30s	Default	▶ Instagram Japanese Likes	12.600000	5	5000	t	f	f	2025-06-15 19:46:39.040749+09
214	3760	Instagram Real MALE Japanese Likes In Their 20s	Default	▶ Instagram Japanese Likes	16.800000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
215	3761	Instagram Real MALE Japanese Likes In Their 30s	Default	▶ Instagram Japanese Likes	16.800000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
216	3762	Instagram Real FEMALE Japanese Likes In Their 20s	Default	▶ Instagram Japanese Likes	16.800000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
217	3763	Instagram Real FEMALE Japanese Likes In Their 30s	Default	▶ Instagram Japanese Likes	16.800000	5	2500	t	f	f	2025-06-15 19:46:39.040749+09
218	2974	Instagram Japanese Custom Comments [ Very Real Looking Users | Max 1000 | Non Drop ] INSTANT	Custom Comments	▶ Instagram Japanese Likes	99.000000	3	1000	f	f	f	2025-06-15 19:46:39.040749+09
219	4075	Instagram Japanese MALE Custom Comments [ Very Real Looking Users | Max 1000 | Non Drop ] INSTANT	Custom Comments	▶ Instagram Japanese Likes	125.000000	3	1000	t	f	f	2025-06-15 19:46:39.040749+09
220	4076	Instagram Japanese FEMALE Custom Comments [ Very Real Looking Users | Max 1000 | Non Drop ] INSTANT	Custom Comments	▶ Instagram Japanese Likes	125.000000	3	1000	t	f	f	2025-06-15 19:46:39.040749+09
221	4100	Instagram Japanese Post Shares [ Max - 50k | Speed - 50k/hour | Real ] INSTANT	Default	▶ Instagram Japanese Likes	0.700000	100	50000	t	f	f	2025-06-15 19:46:39.040749+09
222	4099	Instagram Japanese Saves [ Max - 20k | Super Fast | Non Drop ] INSTANT	Default	▶ Instagram Japanese Likes	0.700000	50	20000	t	f	t	2025-06-15 19:46:39.040749+09
223	3772	Thread Real Japanese Likes	Default	▶ Thread Japanese Services	9.100000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
224	3773	Thread Real Japanese Followers	Default	▶ Thread Japanese Services	42.000000	5	40000	f	f	f	2025-06-15 19:46:39.040749+09
225	3305	Instagram Chinese Traditional Likes [ Max - 50k | Non Drop | Fast | 7 Days Guarantee ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	9.200000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
226	3306	Instagram Chinese Traditional Followers [ Max - 50k | Non Drop | Fast | 30 Days Guarantee | Autorefill ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	30.000000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
227	3733	Instagram Chinese Traditional Likes [ Max - 5k | Speed - 5k/day | Non Drop | HQ ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	4.370000	10	10000	t	f	f	2025-06-15 19:46:39.040749+09
228	3735	Instagram Chinese Simplifiled Likes [ Max - 6k | Speed - 6k/day | Non Drop | HQ ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	2.230000	20	6000	t	f	f	2025-06-15 19:46:39.040749+09
229	3736	Instagram Chinese Traditional Followers [ Max - 30k | Speed - 5k/day | Non Drop | 30 Days Guarantee | HQ ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	11.000000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
230	3737	Instagram Chinese Random Comments [ Max - 1k | Speed - 100-500/day | Non Drop | HQ ] INSTANT	Default	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	73.750000	1	1000	t	f	f	2025-06-15 19:46:39.040749+09
231	4108	Instagram AUTO Chinese Traditional Likes [ Max - 5k | Speed - 5k/day | Non Drop | HQ ] INSTANT	Subscriptions	▶ Instagram 华人繁体赞 / 追随者 🇨🇳	4.370000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
232	2685	Instagram Likes + Impressions + Reach [ Max - 300k | Speed - 50k/hour | 30 Days Auto Refill ] INSTANT	Default	🌟 PROMOTION - Cheap Services 🌟	0.216000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
233	3815	Youtube Views [ Minimum - 500 | Native ADS Views | Never Drop | Speed is 1k per day ] 0-6 HRS	Default	▶ Youtube Views	1.050000	100	5000	t	f	f	2025-06-15 19:46:39.040749+09
234	2909	Youtube Views [ Minimum - 3k | Native ADS Views | Never Drop | Complete Within 12 Hours ] 0-6 HRS	Default	▶ Youtube Views	1.001000	3000	10000000	t	f	f	2025-06-15 19:46:39.040749+09
235	3832	Youtube Views [ Minimum - 10k | Native ADS Views | Never Drop | Complete Within 12 Hours ] 0-6 HRS	Default	▶ Youtube Views	0.912000	10000	1000000	f	f	f	2025-06-15 19:46:39.040749+09
236	3833	Youtube Views [ Minimum - 20k | Native ADS Views | Never Drop | Complete Within 12 Hours ] 0-6 HRS	Default	▶ Youtube Views	0.852000	20000	100000000	t	f	f	2025-06-15 19:46:39.040749+09
237	3834	Youtube Views [ Minimum - 30k | Native ADS Views | Never Drop | Complete Within 12 Hours ] 0-6 HRS	Default	▶ Youtube Views	0.818000	30000	100000000	t	f	f	2025-06-15 19:46:39.040749+09
238	3835	Youtube Views [ Minimum - 40k | Native ADS Views | Never Drop | Complete Within 12 Hours ] 0-6 HRS	Default	▶ Youtube Views	0.698400	40000	100000000	t	f	f	2025-06-15 19:46:39.040749+09
239	3837	Youtube Views [ Minimum - 500k | Native ADS Views | Never Drop | Complete Within 12-36 Hours ] 0-6 HRS	Default	▶ Youtube Views	0.362500	500000	10000000	t	f	f	2025-06-15 19:46:39.040749+09
240	3777	Youtube Views [ Max - 100k | Speed - 50k/day | Non Drop | Social Network Views | Lifetime Auto Refill ] INSTANT	Default	▶ Youtube Views	1.560000	1000	100000	t	f	f	2025-06-15 19:46:39.040749+09
241	3779	Youtube Views [ Max - 100k | Speed: 3-5K/Day  | Real Active Views | 30 Days Refill ] INSTANT	Default	▶ Youtube Views	1.716000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
242	3780	Youtube Views [ Max - 1M | Speed: 25-50K/Day | Real Active Views | Lifetime Guarantee ] INSTANT	Default	▶ Youtube Views	1.872000	1000	10000000	t	f	f	2025-06-15 19:46:39.040749+09
243	2328	YouTube Views [ Real | Speed 500-1k/day | Non Drop Lifetime Guarantee ] INSTANT	Default	▶ Youtube Views	1.794000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
244	2464	YouTube Real Views [ RAV - Google Search | Real &amp; Active Views + Engagements ] INSTANT	Default	▶ Youtube Views	3.110400	500	500000	f	f	f	2025-06-15 19:46:39.040749+09
245	2465	YouTube Real Views [ RAV - Real And Active Views + Engagements ] INSTANT	Default	▶ Youtube Views	3.240000	500	500000	f	f	f	2025-06-15 19:46:39.040749+09
246	3822	YouTube Shorts Views [ Max - 100k | Speed - 5k/day | Non Drop | Real Views | 30 Days Refill ] 0-1 HRS	Default	▶ Youtube Views	1.920000	500	10000000	t	f	f	2025-06-15 19:46:39.040749+09
247	3892	Youtube Live Stream [ 100% Concurrent | 15 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	0.265100	100	200000	t	f	f	2025-06-15 19:46:39.040749+09
248	3893	Youtube Live Stream [ 100% Concurrent - 30 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	0.530200	50	500000	t	f	f	2025-06-15 19:46:39.040749+09
249	3894	Youtube Live Stream [ 100% Concurrent - 60 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	1.083000	25	500000	t	f	f	2025-06-15 19:46:39.040749+09
250	3895	Youtube Live Stream [ 100% Concurrent - 90 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	1.596000	25	500000	t	f	f	2025-06-15 19:46:39.040749+09
251	3896	Youtube Live Stream [ 100% Concurrent - 120 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	2.143200	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
252	3897	Youtube Live Stream [ 100% Concurrent - 150 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	2.143200	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
253	3898	Youtube Live Stream [ 100% Concurrent - 180 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	3.306000	25	500000	t	f	f	2025-06-15 19:46:39.040749+09
254	3899	Youtube Live Stream [ 100% Concurrent - 360 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	6.542400	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
255	3900	Youtube Live Stream [ 100% Concurrent - 720 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	13.084800	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
256	3901	Youtube Live Stream [ 100% Concurrent - 1440 Minutes | Normal Quality ]	Default	Youtube Live Stream [ Low Price and Normal Quality ] #NEW	24.816000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
257	3774	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 1 Hour | Best For Ranking All Type Of Live Streams ] INSTANT	Default	↪ Youtube Livestream [ Realsite Exclusive | Best For Ranking ]	3.000000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
258	3775	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 2 Hour | Best For Ranking All Type Of Live Streams ] INSTANT	Default	↪ Youtube Livestream [ Realsite Exclusive | Best For Ranking ]	5.000000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
259	3776	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 3 Hour | Best For Ranking All Type Of Live Streams ] INSTANT	Default	↪ Youtube Livestream [ Realsite Exclusive | Best For Ranking ]	8.500000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
260	3651	YouTube Livestream Views [ Stable concurrent viewers for 30+ mins | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	0.356400	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
261	3652	YouTube Livestream Views [ Stable concurrent viewers for 60+ mins | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	0.712800	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
262	3653	YouTube Livestream Views [ Stable concurrent viewers for 90+ mins | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	1.069200	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
263	3654	YouTube Livestream Views [ Stable concurrent viewers for 120+ mins | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	1.425600	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
264	3655	YouTube Livestream Views [ Stable concurrent viewers for 150+ mins | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	1.425600	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
265	3656	YouTube Livestream Views [ Stable concurrent viewers for 3 hours | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	2.138400	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
266	3657	YouTube Livestream Views [ Stable concurrent viewers for 6 hours | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	4.276800	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
267	3658	YouTube Livestream Views [ Stable concurrent viewers for 12 hours | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	8.553600	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
268	3659	YouTube Livestream Views [ Stable concurrent viewers for 24 hours | 1000 views equals 1000+ concurrent viewers | Viewers increase fast ]	Default	↪ Youtube Livestream Views [ NEW | Fast Concurrent ]	17.107200	50	300000	t	f	f	2025-06-15 19:46:39.040749+09
269	3595	Youtube Live HR Concurrent Views [ Guaranteed Rank Crypto / Gaming / Lottery Stream | 1000 Order = 1000 Viewers | Stay For 1 Hours ] INSTANT	Default	Youtube Livestream Views [ Rank Crypto / Gaming Streams ]	5.000000	500	10000	t	f	f	2025-06-15 19:46:39.040749+09
270	3596	Youtube Live HR Concurrent Views [ Guaranteed Rank Crypto / Gaming / Lottery Stream | 1000 Order = 1000 Viewers | Stay For 2 Hours ] INSTANT	Default	Youtube Livestream Views [ Rank Crypto / Gaming Streams ]	8.000000	500	10000	t	f	f	2025-06-15 19:46:39.040749+09
271	3597	Youtube Live HR Concurrent Views [ Guaranteed Rank Crypto / Gaming / Lottery Stream | 1000 Order = 1000 Viewers | Stay For 3 Hours ] INSTANT	Default	Youtube Livestream Views [ Rank Crypto / Gaming Streams ]	12.000000	500	10000	t	f	f	2025-06-15 19:46:39.040749+09
272	3215	YouTube Live Stream Views [ Fast | High Concurrent for 30 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	1.200000	100	75000	t	f	f	2025-06-15 19:46:39.040749+09
273	3219	YouTube Live Stream Views [ Fast | High Concurrent for 60 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	2.376000	100	50000	t	f	f	2025-06-15 19:46:39.040749+09
274	3220	YouTube Live Stream Views [ Fast | High Concurrent for 90 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	3.564000	100	50000	t	f	f	2025-06-15 19:46:39.040749+09
275	3210	YouTube Live Stream Views [ Fast | High Concurrent for 120 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	4.752000	100	40000	t	f	f	2025-06-15 19:46:39.040749+09
276	3557	YouTube Live Stream Views [ Fast | High Concurrent for 180 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	7.128000	100	40000	t	f	f	2025-06-15 19:46:39.040749+09
277	3560	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 60 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	0.816000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
278	1216	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 90 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	0.972000	25	500000	t	f	f	2025-06-15 19:46:39.040749+09
279	3563	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 120 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	1.632000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
280	2978	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 180 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	2.448000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
281	3023	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 360 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	4.884000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
282	3025	YouTube Live Stream Views [ 1000 quantity = 1000 viewers | Viewers 720 minutes ] INSTANT	Default	↪ Youtube LIVE STREAM Views	9.768000	100	25000	t	f	f	2025-06-15 19:46:39.040749+09
283	2968	Youtube Organic Live Stream Views ~ Max - 100k | Real and Active Views - INSTANT	Default	↪ Youtube LIVE STREAM Views	3.780000	1000	100000	f	f	f	2025-06-15 19:46:39.040749+09
284	1937	YouTube - Views ~ Active Live Stream	Default	↪ Youtube LIVE STREAM Views	3.780000	1000	100000	f	f	f	2025-06-15 19:46:39.040749+09
285	3660	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 60 Minutes ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | RECOMMENDED | BEST ]	5.000000	25	400000	t	f	f	2025-06-15 19:46:39.040749+09
286	3661	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 2 Hours ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | RECOMMENDED | BEST ]	9.000000	25	400000	t	f	f	2025-06-15 19:46:39.040749+09
287	3662	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 3 Hours ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | RECOMMENDED | BEST ]	13.000000	25	400000	t	f	f	2025-06-15 19:46:39.040749+09
288	3592	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 60 Minutes ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | BEST ]	8.250000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
289	3593	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 2 Hours ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | BEST ]	14.250000	50	50000	t	f	f	2025-06-15 19:46:39.040749+09
290	3594	Youtube Live HR Concurrent Views [ 1000 Order = 1000 Viewers | Stay For 3 Hours ] INSTANT	Default	↪ Youtube Livestream Views [ NEW | BEST ]	19.500000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
291	3341	YouTube Livestream Viewers [ Stable Concurrent Viewers for 15 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	5.154300	25	50000	t	f	f	2025-06-15 19:46:39.040749+09
292	3342	YouTube Livestream Viewers [ Stable Concurrent Viewers for 30 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	10.374000	25	50000	t	f	f	2025-06-15 19:46:39.040749+09
293	3343	YouTube Livestream Viewers [ Stable Concurrent Viewers for 60 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	20.617000	25	50000	t	f	f	2025-06-15 19:46:39.040749+09
294	3344	YouTube Livestream Viewers [ Stable Concurrent Viewers for 90 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	57.144000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
295	3345	YouTube Livestream Viewers [ Stable Concurrent Viewers for 120 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	41.244900	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
296	3457	YouTube Livestream Viewers [ Stable Concurrent Viewers for 180 min | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	61.829100	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
297	3459	YouTube Livestream Viewers [ Stable Concurrent Viewers for 720 mins / 12 hours | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	247.294400	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
298	3460	YouTube Livestream Viewers [ Stable Concurrent Viewers for 1440 mins / 24 hours | 1000 = 1000 Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Views [ VIP | Working After Update ]	494.588700	50	300000	t	f	f	2025-06-15 19:46:39.040749+09
299	3472	YouTube Livestream Viewers [ Stable Concurrent Viewers for 30 min | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	3.960000	50	50000	t	f	f	2025-06-15 19:46:39.040749+09
300	3473	YouTube Livestream Viewers [ Stable Concurrent Viewers for 60 min | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	8.640000	25	400000	t	f	f	2025-06-15 19:46:39.040749+09
301	3474	YouTube Livestream Viewers [ Stable Concurrent Viewers for 90 min | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	13.080000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
302	3475	YouTube Livestream Viewers [ Stable Concurrent Viewers for 120 min | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	17.400000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
303	3476	YouTube Livestream Viewers [ Stable Concurrent Viewers for 150 min | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	21.720000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
304	3477	YouTube Livestream Viewers [ Stable Concurrent Viewers for 3 Hours | 1000 Quantity = 1050+ Concurrent Viewers ] INSTANT	Default	↪ Youtube Livestream Cheap Views [ 1000 Views = 1000 Concurrent | Cheapest ]	25.800000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
305	2157	Youtube Live Stream Views [ 15 Minutes Concurrent | If You Order 1000 Viewers You Get 90-100% Watching ] INSTANT	Default	↪ Youtube Livestream Views [ Premium Quality | High Concurrent ]	5.664000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
306	2158	Youtube Live Stream Views [ 60 Minutes Concurrent | If You Order 1000 Viewers You Get 90-100% Watching ] INSTANT	Default	↪ Youtube Livestream Views [ Premium Quality | High Concurrent ]	22.656000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
307	2159	Youtube Live Stream Views [ 180 Minutes Concurrent | If You Order 1000 Viewers You Get 90-100% Watching ] INSTANT	Default	↪ Youtube Livestream Views [ Premium Quality | High Concurrent ]	67.944000	50	400000	t	f	f	2025-06-15 19:46:39.040749+09
308	3973	Youtube Likes [ Max 10K | Speed - 10K/Day | 30 Days Guarantee ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.252000	10	10000	t	f	f	2025-06-15 19:46:39.040749+09
309	3970	YouTube Likes [ Max - 150k | Real | Speed - 50k/hour | Non Drop | 30 Days Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.432000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
310	3971	YouTube Likes [ Max - 150k | Real | Speed - 50k/hour | Non Drop | 365 Days Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.486000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
311	3972	YouTube Likes [ Max - 150k | Real | Speed - 50k/hour | Non Drop | Lifetime Guarantee ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.540000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
312	3839	Youtube Likes [ Max - 1M | Speed - 50k-100k/day | Non Drop | 30 Days Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.504000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
313	3364	Youtube Likes [ Max - 50k | Speed - 20k/day | Non Drop | No Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.875000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
314	3255	Youtube Likes [ Max - 1M | Speed - 100k/day | Less Drop | No Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.987500	10	1000000	t	f	f	2025-06-15 19:46:39.040749+09
315	3730	Youtube Likes [ Max - 20k | Speed - 20k/hour | Non Drop | 30 Days Refill ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.900000	10	1000000	t	f	f	2025-06-15 19:46:39.040749+09
316	2476	YouTube Real Likes [ R30 | Non Drop | Max 100k | Organic ] 0-1 HRS	Default	↪ Youtube Likes | Dislikes	1.440000	10	1000000	t	f	f	2025-06-15 19:46:39.040749+09
317	599	Youtube Real Likes [ Max - 100k | Fast | Lifetime Guarantee | Speed - 5k-10k/day ] INSTANT	Default	↪ Youtube Likes | Dislikes	0.900000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
318	2475	YouTube USA Likes [ R30 | No Drop | Speed - 200/day | Max 1500 | Organic ] 0-1 HRS	Default	↪ Youtube Likes | Dislikes	6.000000	10	150000	t	f	f	2025-06-15 19:46:39.040749+09
319	2878	Youtube Real Subscribers [ Max 500k | Speed - 10k/day | 30 Days Refill | Non Drop ] INSTANT	Default	↪ Youtube Subscribers	8.400000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
320	3629	Youtube Subscribers [ Max - 200k | Speed - 500-3k/day | 30 Days Refill | Non Drop ] INSTANT	Default	↪ Youtube Subscribers	5.400000	100	100000	t	t	f	2025-06-15 19:46:39.040749+09
321	3026	Youtube Subscribers [ Max - 15k | Speed - 100-150/day | 60 Days Refill | Non Drop | Real ] INSTANT #BEST	Default	↪ Youtube Subscribers	2.700000	50	100000	t	t	f	2025-06-15 19:46:39.040749+09
322	2375	Youtube Subscribers [ Max - 6k | 30-50/day | Non Drop | 60 Days Guarantee ] 0-1 HRS #BEST	Default	↪ Youtube Subscribers	1.404000	20	30000	t	t	f	2025-06-15 19:46:39.040749+09
323	2374	Youtube Subscribers [ Max - 6k | Speed - 30-50/day | 60 Days Guarantee | Non Drop | Real ] 0-1 HRS	Default	↪ Youtube Subscribers	1.404000	20	30000	t	t	f	2025-06-15 19:46:39.040749+09
324	3578	Youtube Subscribers [ Max - 10k | Speed - 100-150/day | Non Drop | 30 Days Guarantee ] 0-1 HRS	Default	↪ Youtube Subscribers	6.300000	100	10000	f	f	f	2025-06-15 19:46:39.040749+09
325	3543	YouTube Subscribers [ Max - 250k | Speed - 5k/day | Real | Non Drop | 60 Days Auto Refill | Bonus Views ] INSTANT #BEST	Default	↪ Youtube Subscribers	9.100000	100	250000	t	t	f	2025-06-15 19:46:39.040749+09
326	3427	YouTube Subscribers [ Max - 100k | Speed - 10k-20k/day | Real | Non Drop | 30 Days Refill Button | Bonus Views ] INSTANT #BEST	Default	↪ Youtube Subscribers	25.200000	100	100000	t	f	t	2025-06-15 19:46:39.040749+09
327	2898	Youtube Subscribers [ Max - 5k | Speed - 200-500/day | Non Drop | 30 Days Refill ] 0-6 HRS	Default	↪ Youtube Subscribers	6.240000	50	200000	f	f	f	2025-06-15 19:46:39.040749+09
328	3811	Youtube Subscribers [ Max - 50k | Speed - 500-1k/day | 30 Days Refill Button | Non Drop ] INSTANT	Default	↪ Youtube Subscribers	3.456000	200	100000	f	t	f	2025-06-15 19:46:39.040749+09
329	2542	YouTube Social Shares from Twitter	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
330	2543	YouTube Social Shares from Reddit	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
331	2544	YouTube Social Shares from Tumblr	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
332	2545	YouTube Social Shares from Linkedin	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
333	2546	YouTube Social Shares from Odnoklassniki	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
334	2547	YouTube Social Shares from Pinterest	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
335	2548	YouTube Social Shares from Blogger	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
336	2549	YouTube Social Shares from Stumbleupon	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
337	2550	YouTube Social Shares from Vkontakte	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
338	2551	YouTube Social Shares from Facebook	Default	↪ Youtube Shares &amp; Favorites	1.080000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
339	2534	Youtube - Shares (VK referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	500000	t	f	f	2025-06-15 19:46:39.040749+09
342	2537	Youtube - Shares (OK referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
343	2538	Youtube - Shares (REDITT referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
344	2539	Youtube - Shares (Whatsapp referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
345	2540	Youtube - Shares (Tumblr referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
346	2541	Youtube - Shares (Google+ referrer)	Default	↪ Youtube Shares &amp; Favorites	1.200000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
347	2590	YouTube Shares [ South Korea ]	Default	↪ Youtube Shares &amp; Favorites	1.425600	50	10000	f	f	f	2025-06-15 19:46:39.040749+09
348	2532	Youtube - Share S2 [ Instant ]	Default	↪ Youtube Shares &amp; Favorites	2.400000	50	1000000	f	f	f	2025-06-15 19:46:39.040749+09
349	2531	Youtube - Share S1 [ Instant ]	Default	↪ Youtube Shares &amp; Favorites	4.800000	50	22000	t	f	f	2025-06-15 19:46:39.040749+09
350	2533	Youtube - Superfast Share [ 20k-30k/day ]	Default	↪ Youtube Shares &amp; Favorites	18.000000	100	150000	f	f	f	2025-06-15 19:46:39.040749+09
351	3257	YouTube Comment Likes [ Max - 500k | Speed - 10k/day | Non Drop | 30 Days Refill ] INSTANT	Default	↪ YouTube Comments	1.187500	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
352	2910	Youtube Comments Likes [ Max - 500k | UPVOTES | Fast | No Refill ] INSTANT	Default	↪ YouTube Comments	6.760000	10	10000	t	f	f	2025-06-15 19:46:39.040749+09
353	1208	Youtube Custom Comments [ Max - 5k | Non Drop | Fast ] 0-1 HRS	Custom Comments	↪ YouTube Comments	5.400000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
354	4026	Real Google 5 Star Reviews [ Max - 100 | 5 Star Reviews | No Comments ] 4-6 HRS	Default	Google Reviews [ 5 Star | Custom ] 🔥	3000.000000	1	1000	f	f	f	2025-06-15 19:46:39.040749+09
355	4027	Real Google 5 Star Reviews [ Max - 100 | 5 Star Reviews | With Custom Comments ] 4-6 HRS	Custom Comments	Google Reviews [ 5 Star | Custom ] 🔥	3000.000000	1	1000	f	f	f	2025-06-15 19:46:39.040749+09
356	4028	Real Google 1 Star Reviews [ Max - 100 | 1 Star Reviews | No Comments ] 4-6 HRS	Default	Google Reviews [ 5 Star | Custom ] 🔥	3000.000000	1	1000	f	f	f	2025-06-15 19:46:39.040749+09
357	4038	Instagram Followers [ Max - 1M | Speed - 20k-30k/day | 60 Days Refill Button ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	2.280000	100	200000	t	t	t	2025-06-15 19:46:39.040749+09
358	3807	Instagram Followers [ Max - 500k | Speed - 10k-20k/day | 30 Days Refill Button ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	3.240000	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
359	3808	Instagram Followers [ Max - 500k | Speed - 10k-20k/day | 365 Days Refill Button ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	3.912000	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
360	4020	Instagram Followers [ Max - 5M | 1 Year Refill | 50k/day | 365 Days Refill Button ]  INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	2.280000	100	5000000	t	t	t	2025-06-15 19:46:39.040749+09
361	3810	Instagram Followers [ Max - 1M | Speed - 10k-20k/day | 365 Days Refill Button ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	2.892000	10	5000000	t	t	t	2025-06-15 19:46:39.040749+09
362	4019	Instagram Followers [ Max - 5M | Speed - 50k/day | Real Mix | Non Drop | 30 Days Refill ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	2.400000	100	5000000	t	t	t	2025-06-15 19:46:39.040749+09
363	3731	Instagram Followers [ Max - 10k | Speed - 3k/day | English Profiles | NEVER DROP | Lifetime Guarantee ] #BEST #RECOMMENDED	Default	▶ Instagram Followers [ Guaranteed ]	3.750000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
364	2720	Instagram Real Followers [ Max - 20k | Real Mix Users | Less Drop | Refill AR 30 Days | Speed - 3k-5k/day ] 15-20% Extra Delivery | RECOMMENDED	Default	▶ Instagram Followers [ Guaranteed ]	2.820000	100	300000	t	f	f	2025-06-15 19:46:39.040749+09
365	2994	Instagram Followers [Max 100k | R30 WITH BUTTON | 5k Per day | Mix ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	1.953800	10	250000	t	t	t	2025-06-15 19:46:39.040749+09
366	2652	Instagram Followers [ Max - 1M | Non Drop | 60 Days Refill With Button | Speed - 50k-100k/day | HQ ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	1.524000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
367	2946	Instagram Followers [ Max - 1M | Non Drop | 90 Days Refill With Button | Speed - 50k-100k/day | HQ ] INSTANT	Default	▶ Instagram Followers [ Guaranteed ]	1.656000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
368	2637	Instagram AFRICA Followers [ Max - 3k | Speed - 100-200/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	6.000000	10	3000	f	f	t	2025-06-15 19:46:39.040749+09
369	2818	Instagram SOUTH ASIA Followers [ Max - 5k | Speed - 50-70/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	4.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
370	2911	Instagram ASIA Followers [ Max - 5k | Speed - 300-500/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	4.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
371	3503	Instagram Real Arabic Followers [ Max - 100k | Natural Speed | No Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	2.040000	100	200000	t	f	f	2025-06-15 19:46:39.040749+09
372	2721	Instagram EUROPE Followers [ Max - 5k | Speed - 500/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	4.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
373	3017	Instagram ARAB Followers [ Max - 5k | Speed - 1k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	4.200000	10	5000	t	t	t	2025-06-15 19:46:39.040749+09
374	3018	Instagram LATINOS Followers [ Max - 10k | Speed - 4k-5k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	4.200000	10	10000	t	t	t	2025-06-15 19:46:39.040749+09
375	3019	Instagram USA Followers [ Max - 5k | Speed - 2k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Followers [ Targeted ]	5.300000	10	5000	t	t	t	2025-06-15 19:46:39.040749+09
376	3903	Instagram Real and Active Brazilian Likes [ Max - 5k | Speed - 300+/day | No Refill ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	1.200000	100	2000	t	f	f	2025-06-15 19:46:39.040749+09
377	3915	Instagram Brazilian Likes [ Max - 100k | Speed - 500/hour | 100% HQ Profiles | No Refill ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	0.348000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
378	3916	Instagram Brazilian Likes [ Max - 100k | Speed - 500/hour | 100% HQ Profiles | 30 Days Refill ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	0.384000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
379	3926	--------------------------------------------	Default	▶ Instagram Brazil Services 🇧🇷	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
380	3906	Instagram Brazil Followers [ Max - 500k | Speed - 10k/day | No Refill | 50% Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.364000	10	5000	t	f	t	2025-06-15 19:46:39.040749+09
381	3907	Instagram Brazil Followers [ Max - 500k | Speed - 10k/day | No Refill | 75% Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.376000	10	5000	t	f	t	2025-06-15 19:46:39.040749+09
382	3908	Instagram Brazil Followers [ Max - 500k | Speed - 10k/day | No Refill | 100% Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.388000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
383	3909	Instagram Brazil Followers [ Max - 50k | Speed - 10k/day | Low Drop | No Refill | 100% HQ Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.400000	20	100000	t	f	t	2025-06-15 19:46:39.040749+09
384	3910	Instagram Brazil Followers [ Max - 500k | Speed - 20k/day | 30 Days Refill | 100% HQ Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.868000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
385	3911	Instagram Brazil Followers [ Max - 500k | Speed - 20k/day | 30 Days Refill | 100% HQ Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	2.868000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
386	3913	Instagram Brazil Female Followers [ Max - 100k | Speed - 20k/day | 30 Days Refill | 100% HQ Brazilian Profiles ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	3.780000	10	10000	t	t	t	2025-06-15 19:46:39.040749+09
387	3927	--------------------------------------------	Default	▶ Instagram Brazil Services 🇧🇷	0.000000	1	1	f	f	f	2025-06-15 19:46:39.040749+09
388	3919	Instagram Premium Comments [ Accounts with 10k-30k followers | Positive Random Comments | 100% Brazil Accounts | No Refill ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	156.000000	1	200	f	f	f	2025-06-15 19:46:39.040749+09
389	3920	Instagram Premium Comments [ Accounts with 10k-30k followers | Positive Custom Comments | 100% Brazil Accounts | No Refill ] 0-60 Mins	Custom Comments	▶ Instagram Brazil Services 🇧🇷	162.000000	1	200	f	f	f	2025-06-15 19:46:39.040749+09
390	3922	Instagram Comments [ Positive Random Comments | 100% Brazil MQ Accounts | No Refill ] 0-60 Mins	Default	▶ Instagram Brazil Services 🇧🇷	60.000000	1	100	t	f	f	2025-06-15 19:46:39.040749+09
391	3923	Instagram Comments [ Custom Comments | 100% Brazil MQ Accounts | No Refill ] 0-60 Mins	Custom Comments	▶ Instagram Brazil Services 🇧🇷	120.000000	1	1000	t	f	f	2025-06-15 19:46:39.040749+09
392	3351	Instagram Likes [ Max - 500k | Speed - 5k-7k/hour | Non Drop | No Refill ] INSTANT	Default	↪ Instagram Likes	0.019200	10	500000	t	f	t	2025-06-15 19:46:39.040749+09
393	3583	Instagram Latin Likes [ Max - 100k | Speed - 50k-100k/day | Latin American Quality | No Drop ] INSTANT	Default	↪ Instagram Likes	0.501600	20	100000	t	t	t	2025-06-15 19:46:39.040749+09
394	2723	Instagram Likes [ Max - 50k | Speed 10k/hour | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.042000	50	50000	t	f	t	2025-06-15 19:46:39.040749+09
395	3554	Instagram Likes [ Max - 300k | Speed 70k/hour | No Refill | No Drop ] INSTANT	Default	↪ Instagram Likes	0.033600	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
396	2671	Instagram Likes [ Max - 50k | Speed - 1k-2k/hour | Russian Real Accounts | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.118800	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
397	2808	Instagram Likes [ Max - 500k | Speed - 100k/day | Cheap | No Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.022800	10	500000	t	t	t	2025-06-15 19:46:39.040749+09
398	3462	Instagram Real Likes [ Max - 50k | Speed 20k/hour | No Refill | No Drop ] INSTANT	Default	↪ Instagram Likes	0.031200	10	500000	t	f	t	2025-06-15 19:46:39.040749+09
399	3553	Instagram Likes [ Max - 300k | Speed 20k/hour | No Refill | No Drop ] INSTANT	Default	↪ Instagram Likes	0.036000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
400	2928	Instagram Likes [ Max - 300k | Speed 20k/hour | No Refill | No Drop ] INSTANT	Default	↪ Instagram Likes	0.036000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
401	3611	Instagram Likes [ Max - 150k | Speed - 20k/hour | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.048000	10	150000	t	t	t	2025-06-15 19:46:39.040749+09
402	1466	Instagram likes [ Max - 300k | Speed - 4k-5k/day | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.042000	10	300000	f	f	t	2025-06-15 19:46:39.040749+09
403	3469	Instagram Likes [ Max - 80k | Speed - 20k/hour | Good Quality | Non Drop | No Refill ] INSTANT	Default	↪ Instagram Likes	0.048000	10	300000	t	t	t	2025-06-15 19:46:39.040749+09
404	3612	Instagram Likes [ Max - 200k | Speed - 20k/hour | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.072000	10	200000	t	t	t	2025-06-15 19:46:39.040749+09
405	3613	Instagram Likes [ Max - 100k | Speed - 20k/hour | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.096000	10	100000	t	t	t	2025-06-15 19:46:39.040749+09
406	2960	Instagram Likes [ Max - 300k | Speed 3k-5k/hour| NO REFILL ] INSTANT	Default	↪ Instagram Likes	0.072000	10	300000	f	t	t	2025-06-15 19:46:39.040749+09
407	2900	Instagram Likes [ Max - 50k | Speed 10k/hour | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes	0.264000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
408	3445	Instagram Real Likes [ Max - 100k | Speed - 1k-2k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.072000	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
409	3576	Instagram Likes [ Max - 50k | No Drop | No Guarantee | Speed - 5k/hour ] INSTANT	Default	↪ Instagram Likes	0.082800	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
410	3313	Instagram Likes [ Max - 50k | Speed - 10k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.084000	10	150000	t	f	t	2025-06-15 19:46:39.040749+09
411	3013	Instagram Likes [ Max - 50k | Speed - 10k-15k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.084000	10	150000	t	f	t	2025-06-15 19:46:39.040749+09
412	2970	Instagram Likes [ Max - 50k | Speed 50k-80k/day | No Refill | Likes Have Drop ] INSTANT	Default	↪ Instagram Likes	0.084000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
413	2506	Instagram Likes [ Max - 30k | Speed - 30k/day | No Refill ] INSTANT	Default	↪ Instagram Likes	0.096000	10	30000	t	f	t	2025-06-15 19:46:39.040749+09
414	2881	Instagram Likes [ Max - 30k | Speed - 1k-2k/hour | Accounts with Posts | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.093600	10	30000	t	f	t	2025-06-15 19:46:39.040749+09
415	3614	Instagram Likes [ Max - 100k | Speed - 20k/day | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.096000	10	100000	t	t	t	2025-06-15 19:46:39.040749+09
416	3461	Instagram Likes [ Max - 10k | Speed - 3k-5k/hour | Non Drop | No Refill ] INSTANT	Default	↪ Instagram Likes	0.108000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
417	2894	Instagram Likes [ Max - 10k | HQ | Auto Refill 30 Days | Speed - 20k/hour ] INSTANT	Default	↪ Instagram Likes	0.264000	10	50000	t	t	t	2025-06-15 19:46:39.040749+09
418	3615	Instagram Likes [ Max - 500k | Speed - 10k/day | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.132000	10	500000	t	t	t	2025-06-15 19:46:39.040749+09
419	3446	Instagram Real Turkish Likes [ Max - 1k | Speed - 1k-2k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.151400	50	15000	t	f	f	2025-06-15 19:46:39.040749+09
420	2507	Instagram Likes + Impressions + Reach [ Max - 35k | Speed - 35k/hour | Very Less Drop | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.134400	10	35000	t	f	t	2025-06-15 19:46:39.040749+09
421	2963	Instagram Likes [ Max - 10k | Speed - 1k-3k/hour | 45 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.138000	10	100000	t	t	t	2025-06-15 19:46:39.040749+09
422	3616	Instagram Likes [ Max - 200k | Speed - 5k-10k/day | Less Drop | 30 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.144000	20	200000	t	t	t	2025-06-15 19:46:39.040749+09
423	2961	Instagram Likes + Impressions + Reach [ Max - 100k | Speed 1k-2k/hour | 45 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.168000	10	100000	t	t	t	2025-06-15 19:46:39.040749+09
424	2903	Instagram Likes + Impressions + Reach [ HQ | Speed 5k-10k/hour | Max 200k ] INSTANT	Default	↪ Instagram Likes	0.216000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
425	3617	Instagram Likes [ Max - 200k | Speed - 50k/day | Less Drop | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes	0.180000	10	250000	t	t	t	2025-06-15 19:46:39.040749+09
426	2499	Instagram Likes [ Max - 300k | Speed - 5k/hour | Very Less Drop | Auto Refill 90 Days ] INSTANT	Default	↪ Instagram Likes	0.192000	10	300000	t	t	t	2025-06-15 19:46:39.040749+09
427	2863	Instagram Likes [ Max - 300k | Speed - 400-500/hour | Russian HQ ] 0-10 Mins	Default	↪ Instagram Likes	0.192000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
428	3444	Instagram Real Likes [ Max - 10k | Speed - 5k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.200000	20	10000	f	f	f	2025-06-15 19:46:39.040749+09
429	2959	Instagram Likes + Impressions + Reach [ Max - 300k | Speed 1k-3k/hour | 45 Days Refill Button ] INSTANT	Default	↪ Instagram Likes	0.200000	10	300000	t	t	t	2025-06-15 19:46:39.040749+09
430	2580	Instagram Likes 100% Real [ Country - Turkey + Asia | 100-200/hour]	Default	↪ Instagram Likes	0.072000	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
431	2508	Instagram Likes [ Max - 45k | Speed - 45k/hour | Very Less Drop | No Refill ] INSTANT	Default	↪ Instagram Likes	0.240000	10	45000	t	f	t	2025-06-15 19:46:39.040749+09
432	2865	Instagram Likes [ Max - 300k | Speed - 400-500/hour | Refill 30 Days | Russian HQ ] 0-10 Mins	Default	↪ Instagram Likes	0.250000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
433	2852	Instagram Likes [ Max - 100k | Speed - 1k/hour | Non Drop | Russian HQ ] 0-20 Mins	Default	↪ Instagram Likes	0.266000	10	100000	t	t	t	2025-06-15 19:46:39.040749+09
434	2582	Instagram Likes Real [ Min 50 Max 3000 ] [ 500-1k/hour]	Default	↪ Instagram Likes	0.252000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
435	2614	🌟 Instagram Real Likes [ Non Drop | Speed 3k-5k/hour | Max 20k | Lifetime Guarantee ] INSTANT	Default	↪ Instagram Likes	0.072000	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
436	2407	Instagram Likes [ Max - 50k | Speed - 5k-10k/hour | Non Drop | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes	0.300000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
437	2945	Instagram Likes + Impressions + Reach [ HQ | Speed 5k-10k/hour | Max 200k ] INSTANT	Default	↪ Instagram Likes	0.300000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
438	3328	Instagram Real Likes [ Max - 75k | Speed - 2k-3k/hour | Real with Stories | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.262500	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
439	3330	Instagram Real Likes [ Max - 50k | Speed - 5k-7k/hour | Real with Stories | Non Drop 30 Days Guarantee ] INSTANT	Default	↪ Instagram Likes	0.250000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
440	3327	Instagram Likes [ Max - 100k | Speed - 1k-5k/hour | Real with Stories | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.287500	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
441	3329	Instagram Real Likes [ Max - 10k | Speed - 5k-7k/hour | Real with Stories | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.325000	30	10000	t	f	f	2025-06-15 19:46:39.040749+09
442	2853	Instagram Likes [ Max - 300k | Speed - 500-1k/hour | Non Drop  | Refill 45 Days | Russian HQ ] 0-20 Mins	Default	↪ Instagram Likes	0.340000	10	300000	t	t	t	2025-06-15 19:46:39.040749+09
443	3452	Instagram Real Turkish Likes [ Max - 1k | Speed - 1k-2k/hour | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.796400	20	3000	t	f	f	2025-06-15 19:46:39.040749+09
444	2962	Instagram Likes + Impressions + Reach [ Max - 500k | Speed 10k/hour | HQ | Non Drop | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes	0.394000	10	500000	t	t	t	2025-06-15 19:46:39.040749+09
445	3619	Instagram Likes [ Max - 30k | Speed - 5k-10k/day | Non Drop | 30 Days Refill ] INSTANT	Default	↪ Instagram Likes	0.420000	50	30000	t	t	t	2025-06-15 19:46:39.040749+09
446	2872	Instagram Likes + Impressions + Reach [ Speed 5k-10k/hour | Non Drop | Auto Refill 30 Days | Real Mix ] INSTANT	Default	↪ Instagram Likes	0.430000	10	100000	t	f	t	2025-06-15 19:46:39.040749+09
447	3021	Instagram Real Likes [ Max - 200k | Speed - 1k-5k/hour | Non Drop | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes	0.450000	50	200000	t	t	t	2025-06-15 19:46:39.040749+09
448	2832	Instagram Likes Real [ Speed - 1k-2k/hour | Mostly with Stories and Public Profiles ] INSTANT	Default	↪ Instagram Likes	0.464000	25	25000	t	f	f	2025-06-15 19:46:39.040749+09
449	2411	🌟 Instagram Real Likes [ Fast | Speed - 1k-2k/hour | Non Drop | Max 10k ] INSTANT	Default	↪ Instagram Likes	0.552000	50	200000	t	f	t	2025-06-15 19:46:39.040749+09
450	2485	🌟 Instagram Real Likes + Impressions + Reach [ Real | Speed - 200-300/hour | Non Drop | Max 10k ] INSTANT	Default	↪ Instagram Likes	0.572000	5	20000	t	f	t	2025-06-15 19:46:39.040749+09
451	3620	Instagram Likes [ Max - 5k | Speed - 1k/day | Non Drop | No Refill ] INSTANT	Default	↪ Instagram Likes	0.600000	20	5000	t	f	t	2025-06-15 19:46:39.040749+09
452	2676	🌟 Instagram Likes + Impressions + Reach [ Max 10k | Non Drop | Speed - 20k-50k/hour ] INSTANT	Default	↪ Instagram Likes	0.654000	10	20000	t	f	t	2025-06-15 19:46:39.040749+09
453	3618	Instagram Likes [ Max - 70k | Speed - 70k/day | Non Drop | 30 Days Refill ] INSTANT	Default	↪ Instagram Likes	0.660000	50	70000	t	t	t	2025-06-15 19:46:39.040749+09
454	2395	Instagram Real Mix Likes [ Fast | Speed - 1k-2k/hour | Non Drop | Max 5k ] INSTANT	Default	↪ Instagram Likes	0.669000	10	5000	t	f	t	2025-06-15 19:46:39.040749+09
455	2926	Instagram Real Likes + Impressions + Reach [ Max - 2k | Speed - 1k-2k/hour | Real ] INSTANT	Default	↪ Instagram Likes	0.675000	10	75000	t	f	f	2025-06-15 19:46:39.040749+09
456	2529	🌟 Instagram Likes + Impressions + Reach [ HQ | Speed 20k/hour | Non Drop | Max 10k ] INSTANT	Default	↪ Instagram Likes	0.690000	10	100000	t	f	t	2025-06-15 19:46:39.040749+09
457	2690	Instagram Likes [ Real and Active | Non Drop | 1k-3k/hour | Super Fast ] INSTANT	Default	↪ Instagram Likes	0.738000	10	5000000	t	f	f	2025-06-15 19:46:39.040749+09
458	3505	Instagram Real Likes [ Max - 30k | Speed - 5k/hour | 1% From Verified Accounts | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.750000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
459	2528	🌟 Instagram Real Likes + Impressions + Reach [ HQ | Speed 200-400/hour | Non Drop | Max 10k ] INSTANT	Default	↪ Instagram Likes	0.762000	10	10000	t	f	t	2025-06-15 19:46:39.040749+09
460	766	Instagram Likes + Impressions + Reach [ Non Drop | Speed 20-50k/hour | Max 10k | Lifetime Guarantee ] INSTANT	Default	↪ Instagram Likes	0.850000	10	20000	t	f	t	2025-06-15 19:46:39.040749+09
461	2687	Instagram Likes + Impressions + Reach [ Max 10k | Non Drop | Slow ] INSTANT	Default	↪ Instagram Likes	0.860000	5	20000	t	f	t	2025-06-15 19:46:39.040749+09
462	2697	Instagram Real Likes [ Real | Speed 500-1k/day | Non Drop | Max 10k ] INSTANT	Default	↪ Instagram Likes	0.900000	50	200000	t	f	t	2025-06-15 19:46:39.040749+09
463	860	🌟 Instagram Likes [ Always Stable | Max - 5k | Non Drop | Speed - 500-700/hour | 10% Extra Delivery ] INSTANT	Default	↪ Instagram Likes	0.940000	100	15000	t	f	f	2025-06-15 19:46:39.040749+09
464	2748	Instagram Likes [ Max - 50k | Speed - 5k-10k/day | Non Drop | 30 Days Auto Refill	Default	↪ Instagram Likes	0.960000	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
465	2688	Instagram Likes + Impressions + Reach [ Max 10k | Non Drop | Slow ~ Natural Pattern ] INSTANT	Default	↪ Instagram Likes	1.140000	10	10000	t	f	t	2025-06-15 19:46:39.040749+09
466	3303	Instagram Likes + Impressions + Reach From Hashtags [ Max - 3k | Speed - 300/Hour | Non Drop | Real Likes From #hashtag Impressions ] INSTANT	Default	↪ Instagram Likes	1.500000	10	3000	t	t	t	2025-06-15 19:46:39.040749+09
467	2576	Instagram Likes [ Max 50k - 10k/day] [Real Accounts+HQ  ]	Default	↪ Instagram Likes	1.776000	20	50000	t	f	f	2025-06-15 19:46:39.040749+09
468	2698	Instagram Likes + Impressions + Reach [ Speed 2k/hour | English Public Profiles With Stories ] INSTANT	Default	↪ Instagram Likes	2.600000	20	15000	t	f	t	2025-06-15 19:46:39.040749+09
469	2743	🌟 Instagram Real Likes + Impressions + Reach [ Max 2k | Non Drop | Real | Slow Natural ] INSTANT	Default	↪ Instagram Likes	2.800000	20	2000	t	f	f	2025-06-15 19:46:39.040749+09
470	2575	IG Likes - Max 20 K - Fastest | 20k Likes In 2 Hours	Default	↪ Instagram Likes	2.400000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
471	2683	Instagram Real Likes + Impressions [ HQ | Speed 500-1k/hour | Non Drop | Max 20k ] INSTANT	Default	↪ Instagram Likes	3.000000	10	20000	t	f	t	2025-06-15 19:46:39.040749+09
472	401	Instagram Likes [ REAL AND ACTIVE | Max - 5k | Speed - 5k/day ] INSTANT	Default	↪ Instagram Likes	3.000000	20	5000	t	f	f	2025-06-15 19:46:39.040749+09
473	2708	🌟 Instagram Likes + Impressions + Reach + Views [ Non Drop | Speed 1k-2k/hour | Max 50k | Lifetime Guarantee ] INSTANT	Default	↪ Instagram Likes	2.850000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
474	3631	Instagram Real Likes [ Max - 5k | Speed - 5k/hour | Real Mix | Very Low Drop | No Drop ] INSTANT	Default	↪ Instagram Likes	0.112500	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
475	3710	Instagram Real Human Likes + Reach + Impressions [ Max - 10k | Speed - 10k/day | Real and Active Accounts | Non Drop ] INSTANT	Default	↪ Instagram Likes	0.900000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
476	4061	Instagram Likes [ Max - 1M | Speed - 300k/day | Non Drop | Old Accounts | English Mix ] INSTANT	Default	↪ Instagram Likes	0.330000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
477	4117	Instagram Likes [ Max - 5M | Speed - 100k-200k/day | Old Accounts | Good Quality ] INSTANT	Default	↪ Instagram Likes	0.020400	10	5000000	t	f	t	2025-06-15 19:46:39.040749+09
478	2991	Instagram Likes 100% Real [ Country - Turkey + Asia | 100-200/hour]	Default	↪ Instagram REAL Likes	0.072000	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
479	3020	Instagram Real Likes [ Max - 200k | Speed - 1k-5k/hour | Non Drop | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram REAL Likes	0.431000	50	200000	t	t	t	2025-06-15 19:46:39.040749+09
480	2980	Instagram Likes Real [ Max - 10k | Speed - 1k-2k/hour | Stories and Public Profiles ] INSTANT	Default	↪ Instagram REAL Likes	0.362500	25	25000	t	f	f	2025-06-15 19:46:39.040749+09
481	2982	Instagram Real Mix Likes [ Fast | Speed - 1k-2k/hour | Non Drop | Max 5k ] INSTANT	Default	↪ Instagram REAL Likes	0.669000	10	5000	t	f	t	2025-06-15 19:46:39.040749+09
482	2984	Instagram Likes [ Real and Active | Non Drop | 1k-3k/hour | Super Fast ] INSTANT	Default	↪ Instagram REAL Likes	0.738000	10	5000000	t	f	f	2025-06-15 19:46:39.040749+09
483	2981	Instagram Likes + Impressions + Reach + Views [ Non Drop | Speed 1k-2k/hour | Max 25k | Lifetime Guarantee ] INSTANT	Default	↪ Instagram REAL Likes	3.100000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
484	4062	Instagram Likes [ Max - 30k | Speed - 30k/day | Real Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.300000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
485	4063	Instagram Likes [ Max - 3k | Speed - 3k/day | Real Turkish Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.300000	20	3000	t	f	f	2025-06-15 19:46:39.040749+09
486	4064	Instagram Power Likes [ Max - 50k | Speed - 50k/day | Real Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.460000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
487	4065	Instagram Likes [ Max - 5k | Speed - 5k/day | Real Turkish Mix | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.620000	50	5000	t	f	f	2025-06-15 19:46:39.040749+09
488	4066	Instagram Indian Likes [ Max - 50k | Speed - 50k/day | Real Indian Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.290000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
489	4067	Instagram Indian Power Likes [ Max - 50k | Speed - 50k/day | Real Indian Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.460000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
490	4068	Instagram Female Indian Likes [ Max - 3k | Speed - 3k/day | Real Female Users | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.460000	10	3000	t	f	f	2025-06-15 19:46:39.040749+09
491	4069	Instagram Likes [ Max - 30k | Speed - 30k/day | Real Users | Non Indian Accounts | Non Drop ] INSTANT	Default	↪ Instagram REAL Likes	0.390000	10	30000	t	f	f	2025-06-15 19:46:39.040749+09
492	3014	Instagram AUTO Likes [ Max - 30k | Speed - 10k-15k/hour | Non Drop ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.084000	10	150000	f	f	t	2025-06-15 19:46:39.040749+09
493	2996	Instagram Likes [ Max - 50k | Speed 50k-80k/day | No Refill | No Drop ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.036000	10	150000	f	f	t	2025-06-15 19:46:39.040749+09
494	2912	Instagram AUTO Likes + Impressions + Reach [ HQ | Speed 5k-10k/hour | Max 200k ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.216000	10	200000	f	f	t	2025-06-15 19:46:39.040749+09
495	2893	Instagram Likes [ Max - 100k | Speed - 1k/hour | Non Drop | Russian HQ ] 0-20 Mins	Subscriptions	↪ Instagram Auto Likes	0.266000	10	100000	f	f	t	2025-06-15 19:46:39.040749+09
496	2137	Instagram Auto Likes - USA	Subscriptions	↪ Instagram Auto Likes	0.900000	10	500000	f	f	f	2025-06-15 19:46:39.040749+09
497	2785	🌟 Instagram Real Likes [ Fast | Speed - 1k-2k/hour | Non Drop | Max 10k ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.552000	50	200000	f	f	t	2025-06-15 19:46:39.040749+09
498	2786	🌟 Instagram Likes + Impressions + Reach [ Max 10k | Non Drop | Speed - 20k-50k/hour ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.666000	10	20000	f	f	t	2025-06-15 19:46:39.040749+09
499	2128	Instagram Auto Likes ~ Max 100k ~ Good Quality	Subscriptions	↪ Instagram Auto Likes	0.108000	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
500	2586	🌟 Instagram Auto Likes + Impressions + Reach [ Non Drop | Speed 1k-3k/hour | Max 10k | Lifetime Guarantee ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.840000	10	20000	f	f	t	2025-06-15 19:46:39.040749+09
501	2847	Instagram Likes + Impressions + Reach [ Always Stable | Max - 10k | Non Drop | Speed - 500-2k/hour | 10% Extra Delivery ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.940000	10	20000	f	f	t	2025-06-15 19:46:39.040749+09
502	2692	🌟 Instagram Likes [3K] [100% Real] [1000-1500 Hourly]	Subscriptions	↪ Instagram Auto Likes	0.312000	30	10000	f	f	f	2025-06-15 19:46:39.040749+09
503	2691	🌟 Instagram Likes [ Real and Active | Non Drop | 1k-3k/hour | Super Fast ] INSTANT	Subscriptions	↪ Instagram Auto Likes	1.200000	10	5000000	f	f	f	2025-06-15 19:46:39.040749+09
504	2827	Instagram Likes + Impressions + Reach [ Speed 2k/hour | English Public Profiles With Stories ] INSTANT	Subscriptions	↪ Instagram Auto Likes	2.850000	20	2000	f	f	f	2025-06-15 19:46:39.040749+09
505	2826	Instagram Real Likes + Impressions + Reach [ Max 2k | Non Drop | Real | Slow Natural ] INSTANT	Subscriptions	↪ Instagram Auto Likes	3.200000	20	2000	f	f	f	2025-06-15 19:46:39.040749+09
506	2145	Instagram - Power Likes ~ INSTANT	Subscriptions	↪ Instagram Auto Likes	2.476800	50	50000	f	f	f	2025-06-15 19:46:39.040749+09
507	2787	🌟 Instagram Likes + Impressions + Reach + Views [ Non Drop | Speed 1k-2k/hour | Max 25k | Lifetime Guarantee ] INSTANT	Subscriptions	↪ Instagram Auto Likes	3.100000	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
508	2351	🌟 AUTO Instagram Real Korean Likes + Impressions + Reach [ Real Likes | Max 15k | Non Drop ] INSTANT	Subscriptions	↪ Instagram Auto Likes	7.000000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
509	3297	Instagram Likes Real [ Max - 10k | Speed - 1k-2k/hour | Stories and Public Profiles ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.362500	25	25000	f	f	f	2025-06-15 19:46:39.040749+09
510	3484	Instagram Likes [ Max - 10k | Speed - 3k-5k/hour | Non Drop | No Refill ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.108000	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
511	3489	Instagram Likes [ Max - 50k | Speed 3k-5k/hour | 45 Days Refill Button ] INSTANT	Subscriptions	↪ Instagram Auto Likes	0.072000	10	100000	f	f	t	2025-06-15 19:46:39.040749+09
512	4070	Instagram Auto Likes ~ Super Power Likes ~ Max 5k	Subscriptions	↪ Instagram Auto Likes	0.270000	10	30000	f	f	f	2025-06-15 19:46:39.040749+09
513	3443	Instagram Real Likes [ Max - 10k | Speed - 1k-5k/hour | No Refill ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.054400	10	20000	f	f	f	2025-06-15 19:46:39.040749+09
514	3047	Instagram Likes [ Max - 5k | Speed - 1k-2k/hour | Non Refill ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.036000	10	30000	t	f	t	2025-06-15 19:46:39.040749+09
515	2957	Instagram Likes [ CHEAPEST | Max - 15k | Speed - 3k/day | No Refill | No Refund ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.074400	10	15000	f	f	t	2025-06-15 19:46:39.040749+09
516	2956	Instagram Likes [ Max - 15k | Speed - 3k/day | No Refill | No Refund ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.084000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
517	2895	Instagram Likes [ No Refill | No Guarantee | Speed - 5k-10k/hour | Max - 10k ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.100000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
518	2775	Instagram Likes [ No Refill | No Guarantee | Speed - 20k/hour | Max - 15k ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.216000	10	200000	t	f	t	2025-06-15 19:46:39.040749+09
519	2777	Instagram Likes [ No Refill | No Guarantee | Speed - 5k/hour | Max - 10k ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.540000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
520	2502	Instagram Likes [ Max - 50k | Speed - 1k-2k/day | Less Drop | No Guarantee ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.082800	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
521	2503	Instagram Likes [ Max - 45k | Speed - 45k/day | Less Drop | No Guarantee ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.240000	10	45000	t	f	t	2025-06-15 19:46:39.040749+09
522	2504	Instagram Likes + Impressions + Reach [ Max - 35k | Speed - 35k/hour | Very Less Drop | Non Drop ] INSTANT	Default	↪ Instagram Likes [ No Guarantee ]	0.134400	10	35000	t	f	t	2025-06-15 19:46:39.040749+09
523	1847	Instagram Likes - Max 10k ~ HQ ~ INSTANT	Default	↪ Instagram Power Likes	0.195000	10	500000	f	f	f	2025-06-15 19:46:39.040749+09
524	2553	Instagram Power Likes {5K} - Real Users	Default	↪ Instagram Power Likes	0.780000	50	5000	t	f	f	2025-06-15 19:46:39.040749+09
525	2557	Instagram Power Likes {5K} [ 100% Real profiles ] [ Speed 300-500/hour]	Default	↪ Instagram Power Likes	0.864000	50	10000	t	f	f	2025-06-15 19:46:39.040749+09
526	2554	Instagram Likes [ Max 50k - 10k/day] [Real Accounts+HQ ] [ Real Profile With Stories]	Default	↪ Instagram Power Likes	2.124000	50	50000	t	f	f	2025-06-15 19:46:39.040749+09
527	1852	Instagram Likes ~ Super Power Likes ~ Max 5k	Default	↪ Instagram Power Likes	0.270000	10	30000	f	f	f	2025-06-15 19:46:39.040749+09
528	2555	Instagram Likes Max 5000 - 100% Real Profiles - With stories and post [ 500/hour]	Default	↪ Instagram Power Likes	2.760000	50	5000	t	f	f	2025-06-15 19:46:39.040749+09
529	2432	Instagram Likes + Impression [ Max - 10k ] [ Worldwide - High Quality Likes ] SUPER INSTANT	Default	↪ Instagram Power Likes	3.100000	10	50000	f	f	t	2025-06-15 19:46:39.040749+09
530	2431	Instagram Likes - [ REAL AND ACTIVE ] SUPER INSTANT	Default	↪ Instagram Power Likes	3.000000	20	5000	t	f	f	2025-06-15 19:46:39.040749+09
531	1856	Instagram Likes [ Max - 10k | R30 | English Profiles | Speed - 5k/day ] 0-1 HRS	Default	↪ Instagram Likes [ Targeted ]	0.900000	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
532	2724	Instagram AFRICA Likes [ Max - 3k | Speed - 100-200/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	3.000000	10	3000	f	f	t	2025-06-15 19:46:39.040749+09
533	3502	Instagram Real Iran Likes [ Max - 50k | Natural Speed | Non Drop | Real Likes ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	0.287500	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
534	2675	Instagram ARAB Likes [ Max - 5k | Speed - 500-1k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.800000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
535	2833	Instagram SOUTH ASIA Likes [ Max - 5k | Speed - 50-70/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
536	2977	Instagram ASIA Likes [ Max - 5k | Speed - 300-500/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.070000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
537	2719	Instagram EUROPE Likes [ Max - 5k | Speed - 1k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
538	2965	Instagram LATINOS Likes [ Max - 10k | Speed - 1k/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.188000	10	5000	t	f	t	2025-06-15 19:46:39.040749+09
539	2745	Instagram USA Likes [ Max - 5k | Speed - 100-200/day | 30 Days Auto Refill ] INSTANT	Default	↪ Instagram Likes [ Targeted ]	1.200000	10	5000	f	f	t	2025-06-15 19:46:39.040749+09
540	3813	Instagram AUTO LATINOS Likes [ Max - 10k | Speed - 1k/day | 30 Days Auto Refill ] INSTANT	Subscriptions	↪ Instagram Likes [ Targeted ]	0.495000	20	100000	f	f	t	2025-06-15 19:46:39.040749+09
541	4060	Instagram Views [ Max - 10M | Speed - 1M/day | Stable ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.004400	10	2141483647	t	f	f	2025-06-15 19:46:39.040749+09
542	3703	Instagram Views [ Max - 10k | Speed - 200k-300k/hour |  Works On All Videos | Works After Update ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.007200	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
543	2349	Instagram Views [ Max - 10M | Super Fast | Works on all links ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.002400	100	2147483647	t	f	f	2025-06-15 19:46:39.040749+09
544	2640	Instagram Video Views [ Max - 50k | Speed - 10k/Hour | Works On All Videos ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.010800	100	500000	t	f	t	2025-06-15 19:46:39.040749+09
545	1196	Instagram Video Views + Impression + Reach [ Max - 250k | Speed - 20k/hour | Stable ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.055200	100	250000	t	f	t	2025-06-15 19:46:39.040749+09
546	3042	Instagram Views [ Max - 10M | Super Fast | Works on all links | Stable ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.007200	100	1000000000	t	f	t	2025-06-15 19:46:39.040749+09
547	3700	Reel Views [ Max - 10M | Speed - 300k-500k/hour | Works On All Videos ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.072000	100	2147483647	t	f	t	2025-06-15 19:46:39.040749+09
548	3696	Instagram Views | Works On All Videos - Emergency [S2]	Default	↪ Instagram Views  | Views + Impressions	0.126000	100	2147483647	t	f	t	2025-06-15 19:46:39.040749+09
549	3695	Instagram Views [ Max - 100M | Super Fast | Works on all links ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.036000	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
550	3702	Instagram Views [ Emergency Views | Working After Update ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.250000	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
551	3038	Instagram views [Works for REEL/IGTV/VIDEO] Emergency #NEW	Default	↪ Instagram Views  | Views + Impressions	0.240000	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
552	758	Instagram Views [ Max - 10M | Speed - 1m/hour | Works On All Videos | Real ] INSTANT	Default	↪ Instagram Views  | Views + Impressions	0.030000	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
553	3045	Emergency Instagram Video Views [ Reel + TV + Normal ]	Default	↪ Instagram Views  | Views + Impressions	0.300000	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
554	2484	Instagram Impressions [ Max - 100k | Speed - 100k/day | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.050000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
555	2713	Instagram Impression + Home + Discover + Tags + Other - [ Max - 1M | Cheap | HQ ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.062500	100	100000000	t	f	f	2025-06-15 19:46:39.040749+09
556	2746	Instagram Impressions + Reach [ Max 1M | Speed - 100k/hour | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
557	3352	Instagram Reach + Impressions [ Max - 300k | Speed - 300k/day | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.060000	10	30000	f	f	t	2025-06-15 19:46:39.040749+09
558	3968	Instagram AUTO Reach + Impressions [ Max - 300k | Speed - 300k/day | Real ] INSTANT	Subscriptions	↪ Instagram Impressions | AUTO Impressions	0.060000	10	300000	f	f	t	2025-06-15 19:46:39.040749+09
559	2714	Instagram Impression [ Explore ] [ Max - 1M | Speed - 100k/hour | HQ ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
560	2715	Instagram Impression [ Home ] [ Max - 1M | Speed - 100k/hour | HQ ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
561	1893	Instagram - Impressions\t~ All time Work	Default	↪ Instagram Impressions | AUTO Impressions	0.077000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
562	1422	Instagram Photo ( Impression + Location + Explore + Home + Profile ) INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.250000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
563	3642	AUTO Instagram Photo ( Impression + Location + Explore + Home + Profile ) INSTANT	Subscriptions	↪ Instagram Impressions | AUTO Impressions	0.250000	10	1000000	f	f	t	2025-06-15 19:46:39.040749+09
564	2424	Instagram Profile + Interaction + Access + Reach (ALL) [ Max 10k | Real | Fast ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.420000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
565	2938	Instagram Impressions From Explore [ Max - 100k | Speed - 100k/day | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.100000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
566	4029	Instagram Reach + Impressions From Explore [ Max - 300k | Speed - 100k/hour | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
567	4030	Instagram Post Shares [ Max - 5M | Speed - 20k/hour | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.096000	100	5000000	t	f	t	2025-06-15 19:46:39.040749+09
568	4032	Instagram Reach + Impressions [ Max - 1M | Speed - 20k/hour | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
569	2869	Instagram Impressions + Reach + Profile Visits [ Max 1M | Speed - 100k/hour | Real ] INSTANT	Default	↪ Instagram Impressions | AUTO Impressions	0.048000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
570	1450	Instagram Photo ( Impression + Location + Explore + Home+ Profile ) INSTANT	Default	↪ Instagram AUTO Views | Impressions | Views + Impressions	0.250000	100	1000000	t	f	f	2025-06-15 19:46:39.040749+09
571	1892	Instagram - Impressions + Discover + Profile Visit	Subscriptions	↪ Instagram AUTO Views | Impressions | Views + Impressions	0.187200	100	5000000	f	f	f	2025-06-15 19:46:39.040749+09
572	3483	Instagram Profile Visits [ Max - 20k | Real | For IG Post Only ] INSTANT	Subscriptions	↪ Instagram AUTO Views | Impressions | Views + Impressions	0.212500	100	100000000	f	f	f	2025-06-15 19:46:39.040749+09
573	4085	Instagram AUTO Views [ Max - 10k | Speed - 200k-300k/hour | Works On All Videos | Works After Update ] INSTANT	Subscriptions	↪ Instagram AUTO Views | Impressions | Views + Impressions	0.007200	100	100000000	f	f	t	2025-06-15 19:46:39.040749+09
574	3940	Instagram Saves [ Max - 50K | Fast ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.060000	100	50000	t	f	t	2025-06-15 19:46:39.040749+09
575	2422	🌟  Instagram Saves [ Max 60k | Fast | Real ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.192000	10	60000	t	f	t	2025-06-15 19:46:39.040749+09
576	3084	Instagram Story Views [ Max - 200k | Speed - 10k-20k/hour | Real Users | All Stories ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
577	3574	📹 Instagram Story Views + Reach + Impressions | Max 15K	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	f	f	f	2025-06-15 19:46:39.040749+09
578	2747	Instagram Profile Visits	Default	↪ Instagram Story Views | Profile Visits | Saves	0.100000	100	5000000	f	f	f	2025-06-15 19:46:39.040749+09
579	1501	Instagram Saves [ Max - 1M | Super Fast | Non Drop ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.048000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
580	2829	Instagram Saves [ Max - 50k | Real | Fast ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.048000	50	50000	t	f	t	2025-06-15 19:46:39.040749+09
581	3575	📹 Instagram Story Views + Reach + Profile Visits + Impressions | Max 50K | One Story | Instant	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	f	f	f	2025-06-15 19:46:39.040749+09
582	1139	Instagram Profile Visits [ Max 10k | Real | Stable ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.100000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
583	1888	Instagram - Save	Default	↪ Instagram Story Views | Profile Visits | Saves	0.148000	10	15000	t	f	f	2025-06-15 19:46:39.040749+09
584	2749	Instagram Reach + Impressions + Profile Visits	Default	↪ Instagram Story Views | Profile Visits | Saves	0.150000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
585	2668	Instagram Story Views [ Max - 15k | Speed - 15k/hour | Order With Profile Link | All Stories ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.109200	10	15000	t	f	t	2025-06-15 19:46:39.040749+09
586	2670	🌟 Instagram Story Views [ Max 10k | Real | Fast | Enter Profile Link ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.110000	10	10000	t	f	t	2025-06-15 19:46:39.040749+09
587	1199	Instagram - Story Views ~ All Story Views ~ INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.313800	10	15000	t	f	f	2025-06-15 19:46:39.040749+09
588	2716	Instagram Profile Visits [ Max - 20k | Real | For IG Post Only ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.212500	100	100000000	t	f	f	2025-06-15 19:46:39.040749+09
589	2849	Instagram Saves [ Max - 20k | Real | Fast ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.078000	100	20000	t	f	t	2025-06-15 19:46:39.040749+09
590	2933	Instagram Post Shares [ Max - 500k | Speed - 100k/hour | Real ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.300000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
591	3466	Instagram Story Likes + Views + Reach [ Max - 5k | Turkish Real Users | High Quality | One Story ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.084000	20	250000	t	f	f	2025-06-15 19:46:39.040749+09
592	3467	Instagram Story Views [ Max - 200k | Speed - 10k-20k/hour | Turkish Real Users | All Stories ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
593	3468	Instagram Story Views [ Max - 150k | Speed - 10k-20k/day | Turkish Real Users | All Stories ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	t	f	f	2025-06-15 19:46:39.040749+09
594	3610	Instagram Post Saves [ Max - 4k | Real Users | Best ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.048000	50	4000	t	f	t	2025-06-15 19:46:39.040749+09
595	4072	Instagram Post Saves [ Max - 3k | Real Users | Best ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	1.440000	5	3000	t	f	t	2025-06-15 19:46:39.040749+09
596	2810	Instagram Story Views + Likes [ Max - 15k | Speed - 5k/hour | Enter Profile Link | 10 Stories Are Viewed With Random Likes ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.680000	10	15000	t	f	t	2025-06-15 19:46:39.040749+09
597	3643	🌟 AUTO Instagram Saves [ Max 60k | Fast | Real ] INSTANT	Subscriptions	↪ Instagram Story Views | Profile Visits | Saves	0.060000	100	60000	f	f	t	2025-06-15 19:46:39.040749+09
598	3890	Instagram Reach + Engagement + Share + Impressions + Profile Visits	Default	↪ Instagram Story Views | Profile Visits | Saves	1.008000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
599	4021	Instagram Saves [ Max - 50k | Super Fast | Non Drop ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.054000	50	10000	t	f	t	2025-06-15 19:46:39.040749+09
600	4033	Instagram Saves [ Max - 10k | Speed - 3k-4k/hour | Real ] INSTANT	Default	↪ Instagram Story Views | Profile Visits | Saves	0.060000	10	10000	t	t	t	2025-06-15 19:46:39.040749+09
601	4048	Instagram AUTO Saves [ Max - 50k | Super Fast | Non Drop ] INSTANT	Subscriptions	↪ Instagram Story Views | Profile Visits | Saves	0.054000	50	50000	f	f	t	2025-06-15 19:46:39.040749+09
602	4101	Instagram Reach + Profile Visits + Impressions For Story | Max 100K | One Story | Instant	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	f	f	f	2025-06-15 19:46:39.040749+09
603	4102	Instagram Story Views + Reach + Profile Visits + Impressions | Max 100K | All Stories | Instant	Default	↪ Instagram Story Views | Profile Visits | Saves	0.117600	10	100000	f	f	f	2025-06-15 19:46:39.040749+09
604	4103	Instagram Reach + Profile Visits + Impressions For Story | Max 100K | One Story | SuperInstant	Default	↪ Instagram Story Views | Profile Visits | Saves	0.084000	20	250000	f	f	f	2025-06-15 19:46:39.040749+09
605	4104	Instagram AUTO Post Shares [ Max - 500k | Speed - 100k/hour | Real ] INSTANT	Subscriptions	↪ Instagram Story Views | Profile Visits | Saves	0.300000	100	5000000	f	f	f	2025-06-15 19:46:39.040749+09
606	2942	Instagram Emoji Comments [ Max - 100k | Real | Super Fast ] INSTANT	Default	↪ Instagram Comments	4.375000	5	100001	f	f	f	2025-06-15 19:46:39.040749+09
607	2917	Instagram English Positive Comments [ Max - 1500 | Speed - 500/hour | English Comments With Relevant Emoji In Text ] INSTANT	Default	↪ Instagram Comments	14.400000	1	1500	t	f	t	2025-06-15 19:46:39.040749+09
608	2992	Instagram AUTO Emoji Comments [ Max - 100k | Real | Super Fast ] INSTANT	Subscriptions	↪ Instagram Comments	4.375000	5	100001	f	f	f	2025-06-15 19:46:39.040749+09
609	2943	Instagram Random Comments [ Max - 100k | Real | Super Fast ] INSTANT	Default	↪ Instagram Comments	4.200000	5	100001	t	f	f	2025-06-15 19:46:39.040749+09
610	2993	Instagram AUTO Random Comments [ Max - 100k | Real | Super Fast ] INSTANT	Subscriptions	↪ Instagram Comments	4.375000	5	100001	f	f	f	2025-06-15 19:46:39.040749+09
611	2944	Instagram Custom Comments [ Max - 100k | Real | Super Fast ] INSTANT	Custom Comments	↪ Instagram Comments	3.750000	5	1000001	f	f	f	2025-06-15 19:46:39.040749+09
612	2509	Instagram Emoji Comments [ Max - 1k  | Speed - 1k/hour | Non Drop | Fast ] INSTANT	Default	↪ Instagram Comments	7.200000	1	1000	t	f	t	2025-06-15 19:46:39.040749+09
613	2751	Instagram Emoji Comments [ Real | Non Drop | Max - 1500 ] INSTANT	Default	↪ Instagram Comments	6.000000	1	1500	t	f	t	2025-06-15 19:46:39.040749+09
614	2672	Instagram Random Comments [ Recommended | Non Drop | Max - 1k ] INSTANT	Default	↪ Instagram Comments	7.280000	10	1000	t	f	t	2025-06-15 19:46:39.040749+09
615	2474	Instagram Real Custom Comments [ R30 | Non Drop | Max 1k | Fast ] 0-1 HRS	Custom Comments	↪ Instagram Comments	9.600000	5	100000	f	f	f	2025-06-15 19:46:39.040749+09
616	2929	Instagram AUTO Real Random Comments [ R30 | Non Drop | Max 1k | Fast ] 0-1 HRS	Subscriptions	↪ Instagram Comments	9.600000	10	200000	f	f	f	2025-06-15 19:46:39.040749+09
617	3176	Instagram Custom Comments [ Max - 1k | Real Users | Non Drop ] INSTANT	Custom Comments	↪ Instagram Comments	11.232000	10	1000	f	f	f	2025-06-15 19:46:39.040749+09
618	2094	Instagram Custom Comments [ Real | Non Drop | Max - 100 ] INSTANT	Custom Comments	↪ Instagram Comments	12.630000	1	1200	f	f	t	2025-06-15 19:46:39.040749+09
619	2856	Instagram English Comments [ Max 10k | HQ | English Comments ] 0-1 HRS	Default	↪ Instagram Comments	20.400000	2	10000	t	f	t	2025-06-15 19:46:39.040749+09
620	2897	Instagram Auo English Comments [ Max 10k | HQ | English Comments ] 0-1 HRS	Subscriptions	↪ Instagram Comments	20.400000	2	10000	f	f	t	2025-06-15 19:46:39.040749+09
621	2750	Instagram Random Comments [ Real | Non Drop | Max - 200 ] INSTANT	Default	↪ Instagram Comments	36.250000	1	200	t	f	t	2025-06-15 19:46:39.040749+09
622	2752	Instagram Random Comments [ On The Topic Of The Post | Real | Non Drop | Max - 300 ] INSTANT	Default	↪ Instagram Comments	41.700000	1	300	t	f	t	2025-06-15 19:46:39.040749+09
623	2828	Instagram Random Positive English Comments [ Max - 100 | Real Positive Comments | Non Drop ] INSTANT	Default	↪ Instagram Comments	62.500000	1	50	t	f	t	2025-06-15 19:46:39.040749+09
624	3450	Instagram Custom Comments [ Max - 10k | Fast Speed | HQ ] INSTANT	Custom Comments	↪ Instagram Comments	5.313000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
625	3482	Instagram Random Comments [ Recommended | Non Drop | Max - 1k ] INSTANT	Subscriptions	↪ Instagram Comments	7.280000	10	1000	f	f	t	2025-06-15 19:46:39.040749+09
626	3485	Instagram Real Emoji Comments [ R30 | Non Drop | Max 100k | Fast ] 0-1 HRS	Default	↪ Instagram Comments	9.600000	10	200000	t	f	f	2025-06-15 19:46:39.040749+09
627	3496	Instagram Emoji Comments [ Max - 10k | Speed - 5k/day | Good Quality ] INSTANT	Custom Comments	↪ Instagram Comments	6.360000	10	2000	f	f	f	2025-06-15 19:46:39.040749+09
628	3497	Instagram Emoji Comments [ Max - 2k | Speed - 5k/day | Best Quality ] INSTANT	Custom Comments	↪ Instagram Comments	3.000000	10	2000	f	f	f	2025-06-15 19:46:39.040749+09
629	3498	Instagram Random Comments [ Max - 10k | Speed - 5k/day | Best Quality ] INSTANT	Default	↪ Instagram Comments	10.200000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
630	3499	Instagram Random Comments [ Max - 10k | Speed - 5k/day | Good Quality ] INSTANT	Default	↪ Instagram Comments	10.200000	10	10000	t	f	t	2025-06-15 19:46:39.040749+09
631	3500	Instagram Random Comments [ Max - 2k | Speed - 2k/day | Top Quality ] INSTANT	Default	↪ Instagram Comments	9.000000	20	2000	f	f	f	2025-06-15 19:46:39.040749+09
632	3504	Instagram Post Related Comments [ Max - 2k | Speed - 2k/day | Top Quality | Comments Related To Picture ] INSTANT	Default	↪ Instagram Comments	10.800000	20	2000	t	f	f	2025-06-15 19:46:39.040749+09
633	3690	Instagram Random Comments [ Max - 1k | Speed - 200/day | Post Related | No Drops | All Real Comments With Highest Quality Real Accounts | Best In The World Quality ] INSTANT	Default	↪ Instagram Comments	62.500000	5	1000	f	f	f	2025-06-15 19:46:39.040749+09
634	3724	Instagram Comments [CUSTOM] [Max: 100K] [Start Time: 0-1 Hour] [Speed: 10K/Day]	Custom Comments	↪ Instagram Comments	9.075000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
635	3729	Instagram Comment Likes [ Max - 5k | Speed - 5k/day | SPECIFIC COMMENT | No Refill ] 0-1 HRS	Default	↪ Instagram Comments	3.975000	20	15000	f	f	f	2025-06-15 19:46:39.040749+09
636	4034	Instagram Custom Comments [ Max - 1k | Speed - 50-60/hour | HQ ] INSTANT	Custom Comments	↪ Instagram Comments	14.400000	1	1000	t	t	t	2025-06-15 19:46:39.040749+09
637	4055	Instagram AUTO Emoji Comments [ Max - 1k | Speed - 1k/hour | Non Drop | Fast ] INSTANT	Subscriptions	↪ Instagram Comments	7.200000	1	1000	f	f	t	2025-06-15 19:46:39.040749+09
638	3061	Instagram Direct Message [ Max - 250k | Speed - 250k/day | Works for hashtags ] 24-72 HRS	Mentions with Hashtags	↪ Instagram DM Services	2.000000	100000	199999	f	f	f	2025-06-15 19:46:39.040749+09
639	3062	Instagram Direct Message [ Max - 500k | Speed - 500k/day | Works for hashtags ] 24-72 HRS	Mentions with Hashtags	↪ Instagram DM Services	1.750000	250000	499999	f	f	f	2025-06-15 19:46:39.040749+09
640	3063	Instagram Direct Message [ Max - 1M | Speed - 500k/day | Works for hashtags ] 24-72 HRS	Mentions with Hashtags	↪ Instagram DM Services	1.375000	500000	999999	f	f	f	2025-06-15 19:46:39.040749+09
641	3064	Instagram Direct Message [ Max - 2M | Speed - 500k/day | Works for hashtags ] 24-72 HRS	Mentions with Hashtags	↪ Instagram DM Services	1.125000	1000000	2999999	f	f	f	2025-06-15 19:46:39.040749+09
642	3999	Instagram Direct Message User Followers	Mentions with Hashtags	↪ Instagram DM Services	2.400000	1000	1000001	f	f	f	2025-06-15 19:46:39.040749+09
643	4000	Instagram Direct Message Custom list	Mentions with Hashtags	↪ Instagram DM Services	2.400000	1000	1000001	f	f	f	2025-06-15 19:46:39.040749+09
644	4001	Instagram Direct Message Media Liker	Mentions with Hashtags	↪ Instagram DM Services	2.400000	1000	1000001	f	f	f	2025-06-15 19:46:39.040749+09
645	4002	Instagram Direct Message Multi Hashtag Likers	Mentions with Hashtags	↪ Instagram DM Services	2.400000	1000	1000001	f	f	f	2025-06-15 19:46:39.040749+09
646	4003	Instagram Direct Message Multi Hashtag (Those who made the publication)	Mentions with Hashtags	↪ Instagram DM Services	2.400000	1000	1000001	f	f	f	2025-06-15 19:46:39.040749+09
647	3752	Twitter Followers [ Max: 100k | Refill: No | Start Time: 0 - 1 Hour | Speed: 3K/Day | NFT Female ]	Default	▶ Twitter Followers	6.915000	100	100000	t	f	t	2025-06-15 19:46:39.040749+09
648	3753	Twitter Followers [ Max: 500k | Refill: 30 days | Start Time: 0 - 1 Hour | Speed: 3K/Day | Real ]	Default	▶ Twitter Followers	9.030000	100	500000	t	t	t	2025-06-15 19:46:39.040749+09
649	3754	Twitter Likes [ Max: 50K | Refill: No | Start Time: 0 - 1 Hours | Speed 25K/Day ]	Default	▶ Twitter Followers	1.470000	10	50000	t	f	f	2025-06-15 19:46:39.040749+09
650	3237	Twitter Video Views + Interactions + Profile Clicks [ Max - 10M | Real | Non Drop | Superfast ] INSTANT	Default	↪ Twitter [ Other ]	0.024000	10	10000000	f	f	f	2025-06-15 19:46:39.040749+09
651	4077	Twitter Real Japanese Likes	Default	Twitter日本人いいね	8.125000	20	6000	f	f	f	2025-06-15 19:46:39.040749+09
652	4080	Twitter Real Japanese Retweets	Default	Twitter日本人リツイート	8.125000	10	1000	f	f	f	2025-06-15 19:46:39.040749+09
653	3409	TikTok Random Emoji Comments [ Max - 1k | Natural Increase ] 0-60 Mins	Default	▶ Tiktok Followers	12.640700	5	1000	t	f	f	2025-06-15 19:46:39.040749+09
654	3410	TikTok Custom Comments [ Max - 1k | Natural Increase ] 0-60 Mins	Custom Comments	▶ Tiktok Followers	46.349200	5	1000	f	f	f	2025-06-15 19:46:39.040749+09
655	2461	TikTok Real Russian Followers [ Real | Max 25k | Speed - 3k/day ] 0-1 HRS	Default	▶ Tiktok Followers	6.700000	10	50000	t	f	t	2025-06-15 19:46:39.040749+09
656	3949	Tiktok Likes + Views [ Max - 1M | Speed - 20k/day | HQ + Real | Refill 30 Days ] 0-60 Mins	Default	↪ Tiktok Likes	0.144000	10	10000000	t	t	t	2025-06-15 19:46:39.040749+09
657	3663	Tiktok Likes [ Max - 2M | Speed - 2k/hour | No Drop | 30 Days Refill ] 0-5 Mins	Default	↪ Tiktok Likes	0.225000	10	2000000	t	f	f	2025-06-15 19:46:39.040749+09
658	3953	Tiktok Likes + Views [ Max - 1M | Speed - 20k/day | HQ + Real | Refill 30 Days ] 0-60 Mins	Default	↪ Tiktok Likes	0.142800	10	10000000	t	f	t	2025-06-15 19:46:39.040749+09
659	3952	Tiktok Likes + Views [ Max - 1M | Speed - 20k/day | HQ + Real | No Refill ] 0-5 Mins	Default	↪ Tiktok Likes	0.135600	10	10000000	t	f	t	2025-06-15 19:46:39.040749+09
660	3950	Tiktok Male Likes + Views [ Max - 1M | Speed - 20k/day | HQ + Real | Refill 30 Days ] 0-60 Mins	Default	↪ Tiktok Likes	0.204000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
661	3951	Tiktok Female Likes + Views [ Max - 1M | Speed - 20k/day | HQ + Real | Refill 30 Days ] 0-60 Mins	Default	↪ Tiktok Likes	0.204000	10	1000000	t	t	t	2025-06-15 19:46:39.040749+09
662	2291	TikTok Views [ Max 10M | Speed - 100k/hour | Non Drop | Real ] INSTANT	Default	↪ TikTok Views	0.001900	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
663	3665	TikTok Video Views [ Max - 100M | Stable | Very Fast ] INSTANT	Default	↪ TikTok Views	0.000700	100	100000000	t	f	t	2025-06-15 19:46:39.040749+09
664	3311	Tiktok Views [ Max - 100M | Ultrafast | Non Drop | Real | RECOMMENDED ] INSTANT	Default	↪ TikTok Views	0.048000	100	100000000	f	f	f	2025-06-15 19:46:39.040749+09
665	3431	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 30 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	1.320000	10	150000	f	f	f	2025-06-15 19:46:39.040749+09
666	3432	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 60 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	2.640000	10	150000	f	f	f	2025-06-15 19:46:39.040749+09
667	3433	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 90 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	3.960000	10	150000	f	f	f	2025-06-15 19:46:39.040749+09
668	3434	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 120 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	5.280000	10	150000	f	f	f	2025-06-15 19:46:39.040749+09
669	3435	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 180 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	7.920000	10	150000	f	f	f	2025-06-15 19:46:39.040749+09
670	3436	Tiktok Live Broadcast Views [ Max - 100k | Gradually Start In 5 Minutes | Stays For 240 Minutes ] INSTANT	Default	↪ TikTok Live Boradcast Views	10.560000	20	100000	f	f	t	2025-06-15 19:46:39.040749+09
671	648	Spotify FREE Plays [ Speed 200-1k/day | Low Plays Time | 30 Days Refill | Max 1M ] 0-3 HRS	Default	▶ Spotify FREE Account Plays	0.215300	500	20000000	t	f	f	2025-06-15 19:46:39.040749+09
672	640	Spotify FREE Plays [ Speed 200-500/day | Low Plays Time | 30 Days Refill | Max 1M ] 1-12 HRS	Default	▶ Spotify FREE Account Plays	0.209100	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
673	1230	Spotify FREE Plays [ Speed 1k-5k/day | Low Plays Time | 30 Days Refill | Max 100M ] 0-3 HRS	Default	▶ Spotify FREE Account Plays	1.014800	1000	100000000	t	f	f	2025-06-15 19:46:39.040749+09
674	1231	Spotify FREE Plays [ Speed 5k-10k/day | Low Plays Time | 30 Days Refill | Max 100M ] 0-3 HRS	Default	▶ Spotify FREE Account Plays	1.230000	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
675	1900	Spotify FREE Search Plays [ Speed 200-500/day | Low Plays Time | 30 Days Refill | Max 1M ] 1-12 HRS	Default	▶ Spotify FREE Account Plays	0.461300	1000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
676	2764	Spotify FREE Playlist Plays [ Speed 200-500/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify FREE Account Playlist Plays	0.590400	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
677	2765	Spotify FREE Playlist Plays [ Speed 2k-5k/day | 30 Days Refill | Max 100M ] 1-12 HRS	Default	↪ Spotify FREE Account Playlist Plays	1.000000	1000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
678	2766	Spotify FREE Playlist Plays [ Speed 5k-10k/day | 30 Days Refill | Max 100M ] 1-12 HRS	Default	↪ Spotify FREE Account Playlist Plays	0.768800	1000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
679	2767	Spotify FREE Playlist Plays [ Last 10 Tracks | Speed 2k-5k/day | 30 Days Refill | Max 100M ] 1-12 HRS	Default	↪ Spotify FREE Account Playlist Plays	0.369000	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
680	1903	Spotify Premium Plays [ Speed 250/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.384400	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
681	1910	Spotify Premium Plays [ Speed 500/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.615000	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
682	2071	Spotify Premium Plays [ Speed 2K-5K/day | 30 Days Refill | Max 10M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.461300	1000	1000000	f	f	f	2025-06-15 19:46:39.040749+09
683	1904	Spotify Premium Playlist Plays [ Speed 500/day | 30 Days Refill | Max 10M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.461300	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
684	139	Spotify Premium Plays [ Speed 1K/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.738000	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
685	141	Spotify Premium Plays [ Speed 2K/day | 30 Days Refill | Max 1M ] 1 HRS	Default	↪ Spotify PREMIUM Account Plays	1.537500	1000	2147483647	f	f	f	2025-06-15 19:46:39.040749+09
686	1902	Spotify Search Premium Plays [ Speed 250/day | 30 Days Refill | Max 10M ] 1-12 HRS	Default	↪ Spotify PREMIUM Account Plays	0.538200	1000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
687	639	Spotify Followers [ Speed 10k-20k/day | LQ | 30 Days Refill | Max 1M ] 0-12 HRS	Default	↪ Spotify Followers	0.184500	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
688	1909	Spotify Playlist Followers [ Speed 10k-20k/day | No Refill, No Refund | Max 100k ] INSTANT	Default	↪ Spotify Playlist Followers	1.060900	50	9999999	t	f	f	2025-06-15 19:46:39.040749+09
689	1912	Spotify USA Playlist Followers [ Speed 1.5k-3k/day | 30 Days Refill | Max 100k ] 1-12 HRS	Default	↪ Spotify Playlist Followers	0.461300	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
690	1913	Spotify USA Monthly Listeners [ Speed 200-500/day | 30 Days Refill | Max 50k ] 1-12 HRS	Default	↪ Spotify Monthly Listeners	1.691300	1000	5000000	f	f	f	2025-06-15 19:46:39.040749+09
691	1905	Spotify USA Premium Plays [ Speed 200-500/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify USA	0.238400	1000	10000000	f	f	f	2025-06-15 19:46:39.040749+09
692	2048	Spotify USA FREE Followers [ Speed 5k/day | 30 Days Refill | Max 10k ] 1-3 HRS	Default	↪ Spotify USA	0.246000	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
693	1920	Spotify USA FREE Save [ Speed 5k/day | 30 Days Refill | Max 100k ] 1-3 HRS	Default	↪ Spotify USA	0.479700	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
694	1908	Spotify Podcast Plays [ Speed 500-2.5k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Podcast Plays	1.082400	1000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
695	2019	Spotify FREE BRAZIL Plays [ Speed 200-500/day | 30 Days Refill | Max 1M ] 0-12 HRS	Default	↪ Spotify Country Targeted	0.246000	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
696	2020	Spotify FREE BRAZIL Playlist Plays [ Speed 200-500/day | 30 Days Refill | Max 1M ] 0-12 HRS	Default	↪ Spotify Country Targeted	0.292200	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
697	2021	Spotify BRAZIL Followers [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.384400	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
698	2023	Spotify BRAZIL Saves For Tracks [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.479700	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
699	2029	Spotify UNITED KINGDOM Playlist Plays [ Speed 1.5k-3K/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.246000	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
700	2030	Spotify UNITED KINGDOM Playlist Plays [ Speed 1.5k-3K/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.292200	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
701	2032	Spotify UNITED KINGDOM Followers [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.384400	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
702	2033	Spotify UNITED KINGDOM Saves For Tracks [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.479700	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
703	2034	Spotify GERMAN Plays [ Speed 1.5K-3K/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.246000	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
704	2035	Spotify GERMAN Playlist Plays [ Speed 1.5K-3K/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.292200	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
705	2037	Spotify GERMAN Followers [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.384400	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
706	2038	Spotify GERMAN Saves [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.479700	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
707	2052	Spotify CANADA Followers [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.246000	500	20000000	f	f	f	2025-06-15 19:46:39.040749+09
708	2053	Spotify CANADA Saves For Track [ Speed 1.5k-3k/day | 30 Days Refill | Max 1M ] 1-12 HRS	Default	↪ Spotify Country Targeted	0.479700	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
709	1917	Spotify FREE USA Saves [ Speed 1.5k-3k/day | 30 Days Refill | Max 10k ] 1-12 HRS	Default	↪ Spotify Save	0.450000	100	9999999	f	f	f	2025-06-15 19:46:39.040749+09
710	1915	Spotify PREMIUM USA Saves [ Speed 5k/day | 30 Days Refill | Max 10k ] 1-12 HRS	Default	↪ Spotify Save	1.500000	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
711	2939	Facebook Profile Followers [ Max 20k | Speed - 1k-2k/day | 30 Days Refill ] 6-12 HRS	Default	▶ Facebook [ Page Likes + Followers ]	1.600000	100	2000000	f	f	f	2025-06-15 19:46:39.040749+09
712	3310	🌟 Facebook Post Likes [ Max - 10k | Super Instant | Mostly From Vietnam | Non Drop Guaranteed ] INSTANT #BEST	Default	↪ Facebook [ Post Likes + Emoticons ]	1.068000	50	10000	t	f	f	2025-06-15 19:46:39.040749+09
713	2323	🌟 Real Facebook Photo/Post Likes [ Max 5k | NON DROP | R30 ] INSTANT	Default	↪ Facebook [ Post Likes + Emoticons ]	4.800000	10	55000	t	f	f	2025-06-15 19:46:39.040749+09
714	2495	Facebook Photo/Post likes [ 50k Max | Real | R30D | Speed 5k/day ] INSTANT	Default	↪ Facebook [ Post Likes + Emoticons ]	6.000000	10	400000	t	f	f	2025-06-15 19:46:39.040749+09
715	3741	Facebook Live Stream Views [ 15 Minutes ]	Default	↪ Facebook Live Stream Views	1.020000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
716	3742	Facebook Live Stream Views [ 30 Minutes ]	Default	↪ Facebook Live Stream Views	2.028000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
717	3743	Facebook Live Stream Views [ 60 Minutes ]	Default	↪ Facebook Live Stream Views	4.056000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
718	3744	Facebook Live Stream Views [ 90 Minutes ]	Default	↪ Facebook Live Stream Views	6.084000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
719	3745	Facebook Live Stream Views [ 120 Minutes ]	Default	↪ Facebook Live Stream Views	8.100000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
720	3746	Facebook Live Stream Views [ 150 Minutes ]	Default	↪ Facebook Live Stream Views	10.128000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
721	3747	Facebook Live Stream Views [ 180 Minutes ]	Default	↪ Facebook Live Stream Views	12.156000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
722	3748	Facebook Live Stream Views [ 210 Minutes ]	Default	↪ Facebook Live Stream Views	14.184000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
723	3749	Facebook Live Stream Views [ 240 Minutes ]	Default	↪ Facebook Live Stream Views	16.200000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
724	3750	Facebook Live Stream Views [ 300 Minutes ]	Default	↪ Facebook Live Stream Views	20.256000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
725	3751	Facebook Live Stream Views [ 360 Minutes ]	Default	↪ Facebook Live Stream Views	24.300000	10	10000	f	f	f	2025-06-15 19:46:39.040749+09
726	1666	Facebook - Comment ~ Custom ~ 0-6 hrs	Custom Comments	↪ Facebook &amp; Others	82.225000	10	250	f	f	f	2025-06-15 19:46:39.040749+09
727	3537	Facebook Video Views [ Max - 1M | Speed - 50k-100k/day | Emergency Server ] INSTANT	Default	↪ Facebook &amp; Others	0.287500	500	10000000	t	f	f	2025-06-15 19:46:39.040749+09
728	2562	SoundCloud Fast Plays [100M]	Default	▶ Soundcloud	0.024000	50000	100000000	f	f	f	2025-06-15 19:46:39.040749+09
729	2563	SoundCloud Plays [1M] [Lifetime Guaranteed]	Default	▶ Soundcloud	0.180000	100	1000000	f	f	f	2025-06-15 19:46:39.040749+09
730	2564	SoundCloud Plays	Default	▶ Soundcloud	0.084000	100	250000	f	f	f	2025-06-15 19:46:39.040749+09
731	2566	Soundcloud USA Followers Mixed Quality(Refill 30 Days)	Default	▶ Soundcloud	5.520000	50	2000	f	f	f	2025-06-15 19:46:39.040749+09
732	2570	Soundcloud USA Likes Mixed Quality(Refill 30 Days)	Default	▶ Soundcloud	1.056000	50	1000000	f	f	f	2025-06-15 19:46:39.040749+09
733	2571	Soundcloud USA Reposts Mixed Quality(Refill 30 Days)	Default	▶ Soundcloud	1.056000	50	1000000	f	f	f	2025-06-15 19:46:39.040749+09
734	2567	SoundCloud Followers {R30 }	Default	▶ Soundcloud	5.760000	50	2000	f	f	f	2025-06-15 19:46:39.040749+09
735	2568	SoundCloud Followers	Default	▶ Soundcloud	2.400000	20	3000	f	f	f	2025-06-15 19:46:39.040749+09
736	2573	Soundcloud track Comments HQ	Default	▶ Soundcloud	14.400000	20	100000	f	f	f	2025-06-15 19:46:39.040749+09
737	726	Soundcloud - Repost	Default	▶ Soundcloud	0.936000	20	1000000	f	f	f	2025-06-15 19:46:39.040749+09
738	2572	SoundCloud Reposts	Default	▶ Soundcloud	4.320000	50	1000000	f	f	f	2025-06-15 19:46:39.040749+09
739	973	WorldWide Traffic - Direct Visits	Default	▶ Website Traffic	0.096000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
740	974	WorldWide Traffic from Google	Default	▶ Website Traffic	0.216000	500	10000000	f	f	f	2025-06-15 19:46:39.040749+09
741	975	WorldWide Traffic from Facebook	Default	▶ Website Traffic	0.216000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
742	976	WorldWide Traffic from Instagram	Default	▶ Website Traffic	0.216000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
743	3738	🇻🇳 Vietnam Traffic from iPhone 14 [RST™ - Real Social Traffic]	Default	▶ Website Traffic	1.176000	500	106000	t	f	t	2025-06-15 19:46:39.040749+09
744	3739	🔎 Vietnam Traffic from Google.com.vn [Organic] [Custom Keywords]	Default	▶ Website Traffic	0.564000	1000	1000000	t	f	t	2025-06-15 19:46:39.040749+09
745	3740	Vietnam Traffic from Google.com.vn	Default	▶ Website Traffic	0.420000	500	1000000	t	f	t	2025-06-15 19:46:39.040749+09
746	1746	South Korea Traffic from Naver [Organic] [Custom Keywords]	Default	↪ Website Traffic [ South Korea ]	0.552000	1000	1000000	t	f	f	2025-06-15 19:46:39.040749+09
747	1745	South Korea Traffic from Google.co.kr [Organic] [Custom Keywords]	Default	↪ Website Traffic [ South Korea ]	0.760000	500	1000000	t	f	f	2025-06-15 19:46:39.040749+09
748	1747	South Korea Traffic from Daum.net Search [Organic] [Custom Keywords]	Default	↪ Website Traffic [ South Korea ]	0.760000	1000	1000000	t	f	f	2025-06-15 19:46:39.040749+09
749	1748	South Korea Traffic from iPhone [100% 아이폰 유기 트래픽] [INSTANT]	Default	↪ Website Traffic [ South Korea ]	1.200000	1000	60000	t	f	f	2025-06-15 19:46:39.040749+09
750	3840	South Korea Traffic - Direct Visits	Default	↪ Website Traffic [ South Korea ]	0.600000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
751	3841	🇰🇷 South Korea Traffic from iPhone 14 [RST™ - Real Social Traffic]	Default	↪ Website Traffic [ South Korea ]	1.176000	500	207000	f	f	t	2025-06-15 19:46:39.040749+09
752	3842	South Korea Traffic from Google	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
753	3843	South Korea Traffic from Naver Search	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
754	3844	South Korea Social Traffic from Naver blogs	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
755	3845	South Korea Organic Traffic from Daum.net Search	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
756	3846	South Korea Direct Traffic from Daum.net News	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
757	3847	South Korea Traffic from Facebook	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
758	3848	South Korea Traffic from YouTube	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
759	3849	South Korea Traffic from Instagram	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
760	3850	South Korea Traffic from Twitter	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
761	3851	South Korea Traffic from Wikipedia	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
762	3852	South Korea Traffic from Twitch.tv	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
763	3853	South Korea Traffic from Amazon.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
764	3854	South Korea Traffic from Baidu	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
765	3855	South Korea Traffic from namu.wiki	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
766	3856	South Korea Traffic from gmarket.co.kr	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
767	3857	South Korea Traffic from Tistory.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
768	3858	South Korea Traffic from Blogspot	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
769	3859	South Korea Traffic from donga.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
770	3860	South Korea Traffic from nate.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
771	3861	South Korea Traffic from Reddit	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
772	3862	South Korea Traffic from Ebay.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
773	3863	South Korea Traffic from Quora	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
774	3864	South Korea Traffic from LinkedIn	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
775	3865	South Korea Traffic from Tumblr	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
776	3866	South Korea Traffic from Pinterest	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
777	3867	South Korea Traffic from Yahoo.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
778	3868	South Korea Traffic from Bing.com	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
779	3869	South Korea Traffic from Auction.co.kr	Default	↪ Website Traffic [ South Korea ]	0.420000	500	1000000	f	f	t	2025-06-15 19:46:39.040749+09
780	984	USA Traffic from Google	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
781	986	USA Traffic from Instagram	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
782	987	USA Traffic from YouTube	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
783	993	India Traffic from Google	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
784	1018	Spain Traffic from Google	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
785	1004	Canada Traffic from Google	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
786	989	UK Traffic from Google	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
787	991	UK Traffic from Facebook	Default	↪ Website Traffic [ Targeted | Keyword | SEO Traffic ]	0.420000	500	1000000	f	f	f	2025-06-15 19:46:39.040749+09
788	3187	Telegram Vote [ Max - 200k | Super fast | High Quality | Stable ] INSTANT	Default	↪ Telegram Reactions + Views and Vote	1.075000	5	200000	f	f	f	2025-06-15 19:46:39.040749+09
789	3205	Telegram Auto Post View [ Last 5 Posts ] [ MONTHLY PACKAGE | Super Fast | High Quality | Stable ]	Default	↪ Telegram Post Views [ Auto View ] [ MONTHLY PACKAGE ]	3.650000	100	300000	f	f	f	2025-06-15 19:46:39.040749+09
790	3206	Telegram Auto Post View [Last 10 Posts] [ MONTHLY PACKAGE | Super Fast | High Quality | Stable ]	Default	↪ Telegram Post Views [ Auto View ] [ MONTHLY PACKAGE ]	7.088000	100	300000	f	f	f	2025-06-15 19:46:39.040749+09
791	3207	Telegram Auto Post View [Last 20 Posts] [ MONTHLY PACKAGE | Super Fast | High Quality | Stable ]	Default	↪ Telegram Post Views [ Auto View ] [ MONTHLY PACKAGE ]	14.750000	100	300000	f	f	f	2025-06-15 19:46:39.040749+09
792	3208	Telegram Auto Post View [Last 50 Posts] [ MONTHLY PACKAGE | Super Fast | High Quality | Stable ]	Default	↪ Telegram Post Views [ Auto View ] [ MONTHLY PACKAGE ]	28.350000	100	300000	f	f	f	2025-06-15 19:46:39.040749+09
793	3209	Telegram Auto Post View [Last 100 Posts] [ MONTHLY PACKAGE | Super Fast | High Quality | Stable ]	Default	↪ Telegram Post Views [ Auto View ] [ MONTHLY PACKAGE ]	56.625000	100	299000	f	f	f	2025-06-15 19:46:39.040749+09
794	2802	Instagram Likes - Popular Post	Default	Private	2.600000	10	10000	t	f	f	2025-06-15 19:46:39.040749+09
795	2804	KR Different Quality	Default	Private	1.000000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
796	2352	PVT KR LIKES	Default	Private	7.000000	5	10000	t	f	f	2025-06-15 19:46:39.040749+09
797	4045	Private USA	Default	Private	7.000000	10	40000	t	f	f	2025-06-15 19:46:39.040749+09
798	2372	AUTO KR LIKES PVT	Subscriptions	Private	7.000000	5	10000	f	f	f	2025-06-15 19:46:39.040749+09
799	3689	New PP	Default	Private	1.100000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
800	2700	IGL 1	Default	Private	0.660000	10	20000	t	f	t	2025-06-15 19:46:39.040749+09
801	2480	Pvt vaib 2	Default	Private	0.084000	10	500000	f	f	t	2025-06-15 19:46:39.040749+09
802	2701	NEW IGL 1	Default	Private	0.550000	50	200000	t	f	t	2025-06-15 19:46:39.040749+09
803	2756	Likes No Drop	Default	Private	0.210000	10	300000	t	f	t	2025-06-15 19:46:39.040749+09
804	2757	Reach + Impressions	Default	Private	0.700000	100	5000000	f	f	f	2025-06-15 19:46:39.040749+09
805	2758	Reach + Impressions + Profile Visits	Default	Private	0.700000	100	5000000	t	f	f	2025-06-15 19:46:39.040749+09
806	2760	Real IGL PVT	Default	Private	0.560000	50	200000	t	f	t	2025-06-15 19:46:39.040749+09
807	3304	Instagram Likes + Impressions + Reach From Hashtags [ Max - 3k | Speed - 300/Hour | Non Drop | Real Likes From #hashtag Impressions ] INSTANT	Default	Private	1.500000	10	3000	t	t	t	2025-06-15 19:46:39.040749+09
808	2870	Instagram Likes - Popular Post #2	Default	Private	2.200000	10	100000	t	f	t	2025-06-15 19:46:39.040749+09
809	3331	Pvt likes	Default	Private	0.200000	10	25000	t	f	t	2025-06-15 19:46:39.040749+09
810	3346	100% Reach + Impressions From Hashtags	Default	Private	0.820000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
811	3347	100% Reach + Impressions + Profile Visits From Hashtags	Default	Private	0.870000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
812	3348	100% Reach + Engagement + Share + Impressions From Hashtags	Default	Private	1.500000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
813	3349	100% Reach + Engagement + Share + Impressions + Profile Visits From Hashtags	Default	Private	1.550000	100	100000	t	f	f	2025-06-15 19:46:39.040749+09
814	3719	Korean Likes	Default	Private	1.250000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
815	3720	Auto Korean Likes	Subscriptions	Private	1.250000	1	10000	f	f	f	2025-06-15 19:46:39.040749+09
816	3555	Api Kr	Default	Private	1.250000	1	10000	t	f	f	2025-06-15 19:46:39.040749+09
817	3803	Live 30 mins	Default	Private	0.881200	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
818	3804	Live 60 mins	Default	Private	1.762200	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
819	3805	Live 90 mins	Default	Private	2.673000	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
820	3806	Live 120 mins	Default	Private	3.524400	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
821	3882	3 hours live	Default	Private	5.286600	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
822	3883	3 hours live #2	Default	Private	2.872800	50	100000	t	f	f	2025-06-15 19:46:39.040749+09
823	3887	Fast korean power likes	Default	Private	2.730000	5	20000	t	f	f	2025-06-15 19:46:39.040749+09
824	3939	Live 180 mins	Default	Private	5.286600	20	500000	t	f	f	2025-06-15 19:46:39.040749+09
825	4037	Private korean followers	Default	Private	30.060000	5	40000	t	f	f	2025-06-15 19:46:39.040749+09
826	4074	igl eva	Default	Private	0.039000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
827	4090	api test	Default	Private	10000.000000	10	10	f	f	f	2025-06-15 19:46:39.040749+09
828	4109	Ig private	Default	Private	1.008000	10	1000000	t	f	t	2025-06-15 19:46:39.040749+09
829	4110	Ig private - off	Default	Private	0.900000	10	10000	f	f	t	2025-06-15 19:46:39.040749+09
830	3677	Instagram Likes [ Max - 500k | Speed - 50k/day | Non Drop | Old Accounts | No Refill ] INSTANT	Default	Other	0.048000	10	500000	t	f	t	2025-06-15 19:46:39.040749+09
831	3704	Instagram AUTO Likes [ Max - 500k | Speed - 50k/day | Non Drop | Old Accounts | No Refill ] INSTANT	Subscriptions	Other	0.048000	10	500000	f	f	t	2025-06-15 19:46:39.040749+09
832	3302	Instagram Likes + Impressions + Reach From Hashtags [ Max - 3k | Speed - 300/Hour | Non Drop | Real Likes From #hashtag Impressions ] INSTANT	Default	Other	1.500000	10	3000	t	t	t	2025-06-15 19:46:39.040749+09
833	3354	Instagram AUTO Likes + Impressions + Reach From Hashtags [ Max - 3k | Speed - 300/Hour | Non Drop | Real Likes From #hashtag Impressions ] INSTANT	Subscriptions	Other	1.500000	10	3000	f	f	t	2025-06-15 19:46:39.040749+09
834	3599	Instagram AUTO Korean Likes [ Max - 5k | Non Drop | Cheap Likes | 30 Days Refill Button ] INSTANT	Subscriptions	Other	3.000000	5	5000	f	f	f	2025-06-15 19:46:39.040749+09
835	4056	Small Follow	Default	Other	6.500000	10	10	f	f	f	2025-06-15 19:46:39.040749+09
836	4057	Small Likes	Default	Other	2.600000	10	10	f	f	f	2025-06-15 19:46:39.040749+09
837	4058	Small Views	Default	Other	0.007200	100	100	f	f	f	2025-06-15 19:46:39.040749+09
838	4086	Instagram AUTO Impressions [ Explore ]	Subscriptions	Other	0.048000	10	1000000	f	f	t	2025-06-15 19:46:39.040749+09
839	4087	Instagram AUTO Profile visits	Subscriptions	Other	0.048000	10	1000000	f	f	t	2025-06-15 19:46:39.040749+09
840	4088	Instagram AUTO Shares - Slow	Subscriptions	Other	0.060000	100	500000	f	f	t	2025-06-15 19:46:39.040749+09
841	4089	Instagram AUTO Shares - Fast	Subscriptions	Other	0.120000	10	5000000	f	f	t	2025-06-15 19:46:39.040749+09
842	2466	F - OFF	Default	API Test - Don&#039;t Order	10000.000000	1	100000	t	f	f	2025-06-15 19:46:39.040749+09
843	2876	IGL US	Default	API Test - Don&#039;t Order	10000.000000	10	7000	t	f	f	2025-06-15 19:46:39.040749+09
844	2840	IGL US2	Default	API Test - Don&#039;t Order	10000.000000	20	100000	t	f	f	2025-06-15 19:46:39.040749+09
845	1925	10k	Default	API Test - Don&#039;t Order	10000.000000	10000	10000	t	f	f	2025-06-15 19:46:39.040749+09
846	4091	If partial	Default	API Test - Don&#039;t Order	10000.000000	100	10000000	f	f	f	2025-06-15 19:46:39.040749+09
847	40351	인스타그램 리그램(키워드) 상위노출 배포 📃	Default	인스타그램 리그램 상위노출 패키지 📈	10000000.000000	2	10000	f	f	t	2025-08-03 18:40:27.795187+09
848	40352	인스타그램 셀프 추천탭 작업 패키지	Default	인스타그램 추천탭 셀프 상위노출 ⭐	7000000.000000	1	1	f	f	t	2025-08-03 18:40:27.795187+09
849	40353	[릴스] 추천탭 상위노출 셀프 패키지	Default	인스타그램 추천탭 동영상 작업 🚀	7500000.000000	1	10	f	f	t	2025-08-03 18:40:27.795187+09
\.


--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_categories (id, name, description, is_active, created_at, updated_at, display_order) FROM stdin;
21	💚네이버	\N	t	2025-06-18 12:04:02.005766	2025-06-18 12:04:02.005766	2
20	❤️유튜브	\N	t	2025-06-18 12:03:45.884638	2025-06-18 12:03:45.884638	3
22	💜틱톡	\N	t	2025-06-18 12:04:19.87665	2025-06-18 12:04:19.87665	4
19	💙페이스북	\N	t	2025-06-18 12:03:28.136387	2025-06-18 12:03:28.136387	5
18	💗인스타그램	\N	t	2025-06-18 12:03:17.449068	2025-06-18 12:07:35.646024	1
24	💛카카오톡	\N	t	2025-06-18 12:04:52.241019	2025-06-18 12:04:52.241019	7
25	🖤스레드	\N	t	2025-06-18 12:05:25.869046	2025-06-18 12:05:25.869046	6
26	🧡트위터	\N	t	2025-06-18 12:05:47.895024	2025-06-18 12:05:47.895024	8
23	🤍웹사이트 트래픽	\N	t	2025-06-18 12:04:40.492162	2025-06-18 12:05:12.514352	9
\.


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.service_types (id, category_id, name, description, is_active, created_at, updated_at, display_order) FROM stdin;
46	18	인스타 팔로워👨‍👩‍👧‍👦	\N	t	2025-06-18 12:08:02.486033	2025-06-18 12:08:02.486033	46
47	18	인스타 좋아요💘	\N	t	2025-06-18 12:08:06.572084	2025-06-18 12:08:06.572084	47
48	18	인스타 댓글💬	\N	t	2025-06-18 12:08:10.054103	2025-06-18 12:08:10.054103	48
49	18	인스타 인사이트🎫	\N	t	2025-06-18 12:08:24.106064	2025-06-18 12:08:24.106064	49
50	18	인스타 리그램 추천탭✨	\N	t	2025-06-18 12:08:32.062764	2025-06-18 12:08:32.062764	50
51	18	인스타그램 계정 육성 월관리🎢	\N	t	2025-06-18 12:08:50.422866	2025-06-18 12:08:50.422866	51
52	19	페이스북 페이지 좋아요+팔로워 서비스💎	\N	t	2025-06-18 12:09:08.264162	2025-06-18 12:09:08.264162	52
53	19	 페이스북 프로필(개인계정) 팔로워 서비스🚏	\N	t	2025-06-18 12:09:51.084353	2025-06-18 12:09:51.084353	53
54	19	 페이스북 게시물 좋아요 서비스🎉	\N	t	2025-06-18 12:10:11.751887	2025-06-18 12:10:11.751887	54
55	19	페이스북 게시물 댓글 서비스💬	\N	t	2025-06-18 12:10:24.790125	2025-06-18 12:10:24.790125	55
56	20	유튜브 동영상 조회수👁‍🗨	\N	t	2025-06-18 12:10:36.092359	2025-06-18 12:10:36.092359	56
57	20	유튜브 동영상 좋아요💕	\N	t	2025-06-18 12:10:56.482886	2025-06-18 12:10:56.482886	57
58	20	유튜브 채널 구독자👭	\N	t	2025-06-18 12:11:13.588204	2025-06-18 12:11:13.588204	58
59	20	유튜브 동영상 댓글💬	\N	t	2025-06-18 12:11:22.075759	2025-06-18 12:11:22.075759	59
60	20	유튜브 동영상 공유💫	\N	t	2025-06-18 12:11:39.407884	2025-06-18 12:11:39.407884	60
61	20	유튜브 라이브 시청자 서비스👁‍🗨	\N	t	2025-06-18 12:11:50.99261	2025-06-18 12:11:50.99261	61
64	22	틱톡 좋아요❤️	\N	t	2025-06-18 12:12:23.46767	2025-06-18 12:12:23.46767	64
65	22	틱톡 팔로워👨‍👩‍👧‍👦	\N	t	2025-06-18 12:12:28.366872	2025-06-18 12:12:28.366872	65
67	26	좋아요💙	\N	t	2025-06-18 12:12:59.402814	2025-06-18 12:12:59.402814	67
69	26	조회수👁‍🗨	\N	t	2025-06-18 12:13:20.797302	2025-06-18 12:13:20.797302	69
70	26	팔로워👨‍👩‍👧‍👦	\N	t	2025-06-18 12:13:28.128953	2025-06-18 12:13:28.128953	70
71	24	카카오톡 채널💡	\N	t	2025-06-18 12:15:45.943042	2025-06-18 12:15:45.943042	71
75	21	자동완성어🧩	\N	t	2025-06-18 12:19:39.899457	2025-06-18 12:19:39.899457	75
76	21	스마트스토어🎁	\N	t	2025-06-18 12:19:57.565692	2025-06-18 12:19:57.565692	76
77	23	웹사이트 트래픽 from 구글🧡	\N	t	2025-06-18 12:20:53.85382	2025-06-18 12:20:53.85382	77
78	23	웹사이트 트래픽 from 페이스북💙	\N	t	2025-06-18 12:21:01.862458	2025-06-18 12:21:01.862458	78
79	23	웹사이트 트래픽 from 인스타그램💗	\N	t	2025-06-18 12:21:07.453673	2025-06-18 12:21:07.453673	79
80	23	웹사이트 트래픽 from 네이버💚	\N	t	2025-06-18 12:21:11.426408	2025-06-18 12:21:11.426408	80
68	25	스레드🔲	\N	t	2025-06-18 12:13:12.375463	2025-06-18 12:13:12.375463	68
72	21	리워드🏃🏻‍♂️🏃🏻‍♀️	\N	t	2025-06-18 12:17:58.607798	2025-06-18 12:17:58.607798	72
74	21	리뷰💬	\N	t	2025-06-18 12:18:35.86464	2025-06-18 12:18:35.86464	73
73	21	플레이스 상위노출 월보장✨	\N	t	2025-06-18 12:18:23.051629	2025-06-18 12:18:23.051629	74
63	22	틱톡 조회수👁‍🗨	\N	t	2025-06-18 12:12:19.458019	2025-06-18 12:12:19.458019	63
62	22	틱톡 댓글💬	\N	t	2025-06-18 12:12:15.972427	2025-06-18 12:12:15.972427	62
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id, display_order) FROM stdin;
169	68	실제 한국인 스레드 팔로워🧑🏻👧🏻	📣[서비스]\n🇰🇷실제 한국인 팔로워🙋🏻‍♂\n\n[ A/S 정책 및 이탈율 안내 ]\n이탈율은 0~5% 미만입니다.\nA/S는 자동 진행되며, 90일간 지원됩니다.\nID 변경, 비공개 시 A/S 불가능합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 500명~1,000명 속도\n\n[ 링크 입력 예시 ]\nhttps://www.threads.net/@스레드아이디\n\n[ 예약작업 안내 ]\n원치않는 경우 별도 체크하지 않으셔도 됩니다.\n예약작업은 원하시는 경우 체크 후 이용이 가능합니다.\n\n[ 효과 ]\n인기게시물 유지 및 상승에 도움이 됩니다.\n높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	100.00	5	10000	3721	t	2025-06-18 13:07:14.496591	2025-06-24 14:43:17.41536	\N	1
97	48	실제 한국인 남성 랜덤 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 [남성] 랜덤 댓글\n· 실제 한국인 남성들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 남성유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~1시간\n- 효과 :\n* 인기게시물 노출에 효과적입니다.\n- 1줄 당 1개 댓글이며, 엔터로 구분	250.00	2	100	3880	t	2025-06-18 12:32:56.598585	2025-06-18 12:32:56.598585	\N	5
87	47	실제 한국인 20대 연령 게시물 좋아요💜	📣[ 서비스 ]\n100% 실제 활동하는 한국인 20대 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 20대 연령의 유저들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	20.00	5	5000	3169	t	2025-06-18 12:28:10.272012	2025-06-18 12:28:10.272012	\N	6
79	46	[가성비] 고품질 한국인 팔로워🧑🏻👩🏻	📣[ 서비스 ]\n한국인 이름 , 프로필, 피드10개 구성\n한국인 처럼 보이도록 꾸민 계정입니다\n가성비 최고 상품\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식 (자동주문 방법은 고객센터 문의)\n인스타 아이디만 입력해주세요\n[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]\n\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.	30.00	1	15000	3996	t	2025-06-18 12:24:10.899027	2025-06-18 12:24:10.899027	\N	4
94	48	인스타 실제 한국인 랜덤 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 랜덤 댓글\n· 실제 한국인들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~30분\n- 효과 :\n* 인기게시물 노출에 효과적입니다.	180.00	5	10000	3534	t	2025-06-18 12:32:04.776203	2025-06-18 12:32:04.776203	\N	2
107	51	인스타 계정육성관리 30일💥	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[ 서비스 ]\n\n✅인스타 계정 육성 소통관리(30일)📊\n· 계정 지수 상승 및 계정 최적화 보장\n· 1일 평균 약 300~500회 이상 활동합니다.\n· 한국인 팔로워 최소 300명 이상 확보 보장\n\n[링크 입력방법]\n· 인스타그램 아이디 입력 후 신청 [카톡문의]\n· 완료 후 리포트 제공 및 인기게시물 노출 1회 무료지원\n\n[서비스 장점]\n· 인플루언서/셀럽 급 성장\n· 구매전환율이 높은 실유저 확보\n· 원하는 타겟층을 소통을 통해 확보\n· 인게/인기탭 노출 및 유지가 잘 되는 최적화 성장\n· 관리가 어렵고, 바쁜신분들에게 권장드립니다.\n\n[서비스 기능]\n· 광고 계정 99% 필터링 처리(AI 기반)\n· 정밀 타겟층 소통 (UI기반)\n· 지역/업종/성별/연령/카피라이팅 등 다양한 타겟 접근\n\n[메인 서비스 안내]\n메인 : 활동을 통해 반응이 일어나는 소통\n· 좋아요 : 일 평균 150~500회 활동\n· 팔로잉 : 일 평균 : 50~200회 활동\n· 스토리 : 일 평균 : 500~1,000회 시청 및 좋아요\n· 언팔로잉 : 일 평균 : 50~100회 활동\n→ 선팔 후 7일간 맞팔이 아닌 유저는 언팔로잉 처리합니다.\n\n[서브 서비스 안내]\n서브 : 활동을 통해 반응을 이끌어내는 소통\n· DM : 일 평균 : 3~10회 활동\n· 댓글 : 일 평균 : 3~10회 활동\n· 예약 업로드 : 사진을 제공해주시는 경우\n→ DM 원하시는 경우 수신받을 계정리스트와 문구(내용)를 전달주셔야 합니다.\n\n[부가 서비스 안내]\n부가 : 자사에서 제공하는 계정성장에 도움이되는 서비스\n· 트래픽 : 게시물 클릭 후 30초 체류+방문 (1일 100회)\n\n* 메인/서브/부가 서비스 중 원치 않는 기능은 중지가 가능합니다.\n\n[서비스 보안]\n· AI기반 광고 계정 99% 필터링 처리합니다.\n· 모바일 IP를 사용하여 매우 안전하게 진행됩니다.\n· 1계정 1디바이스 1아이피 서버 기반으로 운영됩니다.\n· 인스타의 알고리즘 난수화 패턴을 완벽 보완했습니다.\n· 로그인 이력이 없는 아이피 접속시 로그인 차단합니다.\n\n[서비스 성과(테스트 계정)]\n· 계정지수 상승 및 계정 최적화 도달\n· 소통을 통한 많은 타겟팅 유저 확보(작업유입 제외)\n· [30일 진행 결과]\n· 팔로워 약 800명 확보\n· 게시물 당 좋아요 100~150개 증가\n\n[인기게시물 / 인기탭 작업 테스트 결과]\n· 릴스 #제주맛집 상위노출 테스트 완료\n· 인기탭 #강남반영구 상위노출 테스트 완료\n· 인기게시물 #눈썹문신 상위노출 테스트 완료\n· 경쟁이 치열한 태그 내 평균 1~2일 유지됩니다.\n\n[자주묻는질문]\n· 로그인 유지 : 가능합니다.\n· 스팸계정 차단 여부 : 자동 진행됩니다.\n· 지인에게 활동 유무 : 원하는 경우 가능합니다.\n· 개인 활동 여부 : 가능하나, 1일 10회 활동 권장합니다.\n· 주말/공휴일 활동 여부 : 휴일없이 24시간 진행됩니다.\n. 팔로잉 증가 여부 : 맞팔이 아닌 유저는 모두 언팔됩니다.\n* 이것도 원치 않으신 경우 '팔로잉' 기능을 제외 후 진행 가능합니다.\n\n[주의사항]\n· 비공개 시 진행이 불가능합니다.\n· 타업체와 중복사용이 불가능합니다.\n· 일평균 10회 이상 활동을 자제해주세요.\n· 2단계 보안인증을 설정했다면 해제해주세요.\n[ 주의사항 미숙지 시 발생하는 불이익에 대해선 당사는 책임을 지지 않습니다 ]\n\n[환불규정]\n· 계정육성관리 셋팅 후 환불은 불가능합니다.\n· 진행 기간동안 양도, 타계정 전환은 불가능합니다.	300000.00	1	10000	\N	t	2025-06-18 12:37:48.924803	2025-06-18 12:37:48.924803	\N	2
178	73	플레이스 상위노출 월보장✨	https://pf.kakao.com/_aIRrn\n\n📌신청 전 카카오톡으로 문의 주세요.	0.00	0	0	\N	t	2025-06-18 13:13:20.430979	2025-06-18 13:13:20.430979	\N	1
180	74	[실계정] 블로그 리뷰-일반 지수💬		1500.00	30	1000000	\N	t	2025-06-18 13:14:11.323983	2025-06-18 13:14:11.323983	\N	2
77	46	[가성비] 고품질 외국인 팔로워👱👱🏻‍♀️	📣[ 서비스 ]\n고품질 외국인 팔로워 입니다.\n이탈 거의 없음\n24시간 기준 20만건 진행 가능\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n📣착수시간\n⏰ 1분~24시간이내\n※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	4.00	10	100000	3783	t	2025-06-18 12:23:04.242067	2025-06-18 12:43:37.881425	\N	2
84	47	실제 한국인 게시물 좋아요💛	📣[ 서비스 ]\n[빠름]🇰🇷실제한국인 좋아요❤\n100% 실제 활동하는 한국인 좋아요 서비스 입니다.\n- 노출+도달[기타]가 증가합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 500개~1,000개 속도\n\n[ 링크 입력 예시 ]\nhttps://www.instagram.com/p/------\n게시물의 링크를 넣어주세요.\n\n[ 효과 ]\n📋 서비스 설명\n실제 한국인들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.\n노출+도달 상승은 인기게시물에 효과적 입니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	10.00	1	10000	3997	t	2025-06-18 12:26:45.673893	2025-06-18 12:26:45.673893	\N	3
76	46	[추천] 실제 외국인 팔로워👱👱🏻‍♀️	📣[ 서비스 ]\n[빠름]🇰🇷실제외국인 팔로워🇰🇷\n· 실제 사람들로 구성되어 있습니다.\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n[ A/S 정책 및 이탈율 안내 ]\n이탈율은 0~5% 미만입니다.\nA/S는 자동 진행되며, 90일간 지원됩니다.\nID 변경, 비공개 시 A/S 불가능합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 1일 평균 1,000명~2,000명의 속도\n\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.\n\n[ 효과 ]\n인기게시물 유지 및 상승에 도움이 됩니다.\n높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	5.00	10	1000000	4107	t	2025-06-18 12:22:29.992522	2025-06-18 12:22:29.992522	\N	1
78	46	[추천] 실제 한국인 팔로워🧑🏻👩🏻	📣[ 서비스 ]\n[빠름]🇰🇷실제한국인 팔로워🇰🇷\n· 실제 사람들로 구성되어 있습니다.\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n[ A/S 정책 및 이탈율 안내 ]\n이탈율은 0~5% 미만입니다.\nA/S는 자동 진행되며, 90일간 지원됩니다.\nID 변경, 비공개 시 A/S 불가능합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 1일 평균 1,000명~2,000명의 속도\n\n[ 링크 입력 예시 ]\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.\n\n[ 예약작업 안내 ]\n원치않는 경우 별도 체크하지 않으셔도 됩니다.\n예약작업은 원하시는 경우 체크 후 이용이 가능합니다.\n\n[ 효과 ]\n인기게시물 유지 및 상승에 도움이 됩니다.\n높은 팔로워는 컨텐츠의 신뢰도를 높여줍니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	80.00	1	15000	3996	t	2025-06-18 12:23:46.57197	2025-06-18 12:25:40.864859	\N	3
80	46	[가성비] 고품질 남자 한국인🧑🏻	📣[ 서비스 ]\n[남성]으로 구성된 한국인 이름 , 프로필, 피드10개 구성\n한국인 처럼 보이도록 꾸민 계정입니다\n가성비 최고 상품\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식 (자동주문 방법은 고객센터 문의)\n인스타 아이디만 입력해주세요\n[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]\n\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.	100.00	10	10000	4053	t	2025-06-18 12:24:54.419857	2025-06-18 12:24:54.419857	\N	5
81	46	[가성비] 고품질 여자 한국인👩🏻	📣[ 서비스 ]\n[여성]으로 구성된 한국인 이름 , 프로필, 피드10개 구성\n한국인 처럼 보이도록 꾸민 계정입니다\n가성비 최고 상품\n\n❗확인해주세요❗\n최근 인스타그램에 본인 계정과 교류가 없는 계정이 팔로우를 하는 경우 검토를 위해 플래그로 분류되는 기능이 추가되었습니다. 원활한 작업을 위해 해당 기능을 해제 해주시는 것을 권장드립니다.\n\n인스타그램 > 설정 > 친구 팔로우 및 초대 > 검토를 위해 플래그 지정설정 해제\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식 (자동주문 방법은 고객센터 문의)\n인스타 아이디만 입력해주세요\n[아이디 보는법: 인스타 앱 프로필수정(설정) > 사용자이름]\n\n📣주문방법\n예시 : gramii\n- 게시물 링크 입력하시면 안됩니다.\n- 본인 인스타그램 아이디만 입력해주세요.	100.00	10	20000	4054	t	2025-06-18 12:25:22.61671	2025-06-18 12:25:22.61671	\N	6
82	47	[파워] 실제 외국인 좋아요🧡	📣[ 서비스 ]\n실제 외국인 좋아요 입니다.\n서버 상태에 따라 주문 시작 및 처리 속도가 매번 다릅니다.\n\n[ 효과 ]\n높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.\n단순 좋아요 수치 증가를 원하면 권장드립니다.\n\n📣착수시간\n⏰ 1분~1시간 이내\n※동시 주문량이 많은경우 24시간까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.50	10	500000	3351	t	2025-06-18 12:26:08.632178	2025-06-18 12:26:08.632178	\N	1
83	47	[파워] 고품질 한국인 게시물 좋아요❤️	📣[ 서비스 ]\n파워 고품질 한국인 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n노출+도달+탐색 증가\n\n🌟 주문 후 작업시간\n평균 1~60분내 시작됩니다.\n서버 상태에 따라 작업 완료까지 최대 24시간 소요 될 수 있습니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n고품질 한국인들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.\n\n🚫 주의사항\n비공개 계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	3.00	1	10000	3997	t	2025-06-18 12:26:25.960333	2025-06-18 12:26:25.960333	\N	2
85	47	실제 한국인 남성 게시물 좋아요💚	📣[ 서비스 ]\n[빠름]🇰🇷실제 남성 한국인 좋아요❤\n100% 실제 활동하는 [남성] 한국인 좋아요 서비스 입니다.\n- 노출+도달[기타]가 증가합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 500개~1,000개 속도\n\n[ 링크 입력 예시 ]\nhttps://www.instagram.com/p/------\n게시물의 링크를 넣어주세요.\n\n[ 효과 ]\n📋 서비스 설명\n실제 남성 한국인들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.\n노출+도달 상승은 인기게시물에 효과적 입니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	20.00	5	5000	3989	t	2025-06-18 12:27:12.20751	2025-06-18 12:27:12.20751	\N	4
86	47	실제 한국인 여성 게시물 좋아요💙	📣[ 서비스 ]\n[빠름]🇰🇷실제 여자 한국인 좋아요❤\n100% 실제 활동하는 [여성] 한국인 좋아요 서비스 입니다.\n- 노출+도달[기타]가 증가합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 500개~1,000개 속도\n\n[ 링크 입력 예시 ]\nhttps://www.instagram.com/p/------\n게시물의 링크를 넣어주세요.\n\n[ 효과 ]\n📋 서비스 설명\n실제 여성 한국인들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움됩니다.\n노출+도달 상승은 인기게시물에 효과적 입니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	20.00	5	5000	3988	t	2025-06-18 12:27:48.424129	2025-06-18 12:27:48.424129	\N	5
88	47	실제 한국인 20대 연령 남성 게시물 좋아요💜	📣[ 서비스 ]\n100% 실제 활동하는 한국인 20대 [남성] 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 20대 연령의 남성들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	25.00	5	2500	3171	t	2025-06-18 12:28:36.597969	2025-06-18 12:30:22.598927	\N	7
89	47	실제 한국인 20대 연령 여성 게시물 좋아요💜	📣[ 서비스 ]\n100% 실제 활동하는 한국인 20대 [여성] 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 20대 연령의 여성들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	25.00	5	2500	3170	t	2025-06-18 12:29:04.68556	2025-06-18 12:29:04.68556	\N	8
90	47	실제 한국인 30대 연령 게시물 좋아요🤎	📣[ 서비스 ]\n100% 실제 활동하는 한국인 30대 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 30대 연령의 유저들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	20.00	5	5000	3172	t	2025-06-18 12:29:22.847262	2025-06-18 12:29:22.847262	\N	9
91	47	실제 한국인 30대 연령 남성 게시물 좋아요🤎	📣[ 서비스 ]\n100% 실제 활동하는 한국인 30대 [남성] 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 30대 연령의 남성들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	25.00	5	2500	3174	t	2025-06-18 12:29:36.7122	2025-06-18 12:29:36.7122	\N	10
92	47	실제 한국인 30대 연령 여성 게시물 좋아요🤎	📣[ 서비스 ]\n100% 실제 활동하는 한국인 30대 [여성] 좋아요 서비스입니다.\nIGTV, 릴스에 주문 가능합니다.\n\n🌟 주문 후 작업시간\n평균 1~5분내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n📋 서비스 설명\n실제 활동하는 한국인 30대 연령의 여성들이 좋아요를 늘려드리는 서비스 입니다.\n인스타그램 공식앱에서 핸드폰으로 직접 좋아요를 눌러드리는 방식으로 인기게시물에 굉장히 도움되며, 도달 및 노출도가 함께 증가됩니다.\n\n🚫 주의사항\n비공개계정은 작업이 불가능합니다.\n라이브로 올린 영상은 작업이 불가합니다.\n주문실수의 경우 취소 및 수정이 불가능합니다.\n\n⌨ 링크형식\n인스타 게시물 링크(URL)을 입력해주세요	25.00	5	2500	3173	t	2025-06-18 12:29:51.672672	2025-06-18 12:29:51.672672	\N	11
93	48	 인스타 실제 한국인 지정 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 지정 댓글\n· 실제 한국인들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 유저들이 '댓글 입력창'에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~1시간\n- 효과 :\n* 인기게시물 노출에 효과적입니다.\n- 1줄 당 1개 댓글이며, 엔터로 구분	180.00	3	10000	3941	t	2025-06-18 12:31:18.435734	2025-06-18 12:31:18.435734	\N	1
95	48	실제 한국인 남성 지정 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 [남성] 지정 댓글\n· 실제 한국인 남성들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 남성 유저들이 '댓글 입력창'에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~1시간\n- 효과 :\n* 인기게시물 노출에 효과적입니다.\n- 1줄 당 1개 댓글이며, 엔터로 구분	250.00	1	100	3877	t	2025-06-18 12:32:23.215607	2025-06-18 12:32:23.215607	\N	3
96	48	실제 한국인 여성 지정 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 [여성] 지정 댓글\n· 실제 한국인 여성들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 여성 유저들이 '댓글 입력창'에 적어주신 내용 그대로 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~1시간\n- 효과 :\n* 인기게시물 노출에 효과적입니다.\n- 1줄 당 1개 댓글이며, 엔터로 구분	250.00	1	100	3878	t	2025-06-18 12:32:42.057275	2025-06-18 12:32:42.057275	\N	4
98	48	실제 한국인 여성 랜덤 댓글💬	📣[ 서비스 ]\n인스타 실제 한국인 [여성] 랜덤 댓글\n· 실제 한국인 여성들로 구성되어 있습니다.\n\n▶서비스 특징\n100% 실제 활동하는 한국인 여성유저들이 랜덤으로 배정되어 댓글을 달아드리는 서비스입니다. \n\n▶ 주문 전 주의사항\n- 주문 실수의 경우 별도 조치 처리해드리지 않습니다.\n- 동일 게시물(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n\n▶ 서비스 상세설명\n- 시작 시간 : 평균 1분~30분\n- 효과 :\n* 인기게시물 노출에 효과적입니다.	250.00	2	100	3881	t	2025-06-18 12:33:12.463686	2025-06-18 12:40:53.029353	\N	6
99	49	실제 한국인 게시물 저장🎁	📣[ 서비스 ]\n실제 한국인 파워 저장하기 입니다.\n※원하는 게시물에 신청하신 갯수 만큼 저장갯수가 증가 됩니다.\n\n📣착수시간\n⏰ 1분~20분 이내\n※동시 주문량이 많은경우 120분까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣혜택\n인기게시물 상승 및 유지에 도움이 됩니다.\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.40	50	4000	3610	t	2025-06-18 12:33:33.772994	2025-06-18 12:33:33.772994	\N	1
100	49	실제 한국인 게시물 공유🎀	📣[ 서비스 ]\n실제 한국인 공유입니다.\n※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.\n\n📣착수시간\n⏰ 10분~30분 이내\n※동시 주문량이 많은경우 60분까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣혜택\n인기게시물 상승 및 유지에 도움이 됩니다.\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.80	100	5000000	4030	t	2025-06-18 12:34:44.373316	2025-06-18 12:34:44.373316	\N	2
101	49	실제 한국인 프로필 방문📌	📣[ 서비스 ]\n\\\\\\\\\\\\\\"실제 한국인 프로필 방문\\\\\\\\\\\\\\" 입니다.\n※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.\n\n📣착수시간\n⏰ 10분~30분 이내\n※동시 주문량이 많은경우 60분까지 소요될수 있습니다.\n※유입완료는 신청주신 수량에따라 차이가납니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣혜택\n인기게시물 상승 및 유지에 도움이 됩니다.\n\n📣주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.30	10	1000000	4087	t	2025-06-18 12:34:58.989973	2025-06-18 12:34:58.989973	\N	3
102	49	실제 한국인 노출 + 도달💡	📣[ 서비스 ]\n실제 한국인 게시물 노출/도달입니다.\n※원하는 게시물에 신청하신 갯수 만큼 유입이 됩니다.\n\n📣착수시간\n현재 테스트 결과 주문 후 30분에 5000회 까지 유입 됩니다.\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣혜택\n인기게시물 상승 및 유지에 도움이 됩니다.\n\n📣\n주의사항\n※비공개 계정에는 작업이 안됩니다.\n※주문 실수로인한 취소및 환불은 어렵습니다.\n※주문 접수 후 취소및 게시물삭제, 변경,환불 불가능 합니다.\n※추가 주문시 이전 주문 수량이 모두 유입된후 주문하시기 바랍니다.\n※주문실수, 중복(동시)주문, 상품설명 미준수, 최대수량 초과주문으로 발생되는 피해는 절대 환불/취소 처리가 불가하오니 정독하시고 신중하게 주문해주시기 바랍니다.	0.30	10	1000000	2746	t	2025-06-18 12:35:21.337048	2025-06-18 12:35:21.337048	\N	4
103	49	[릴스] 인스타그램 동영상 조회수⏰	📣[ 서비스 ]\n· 릴스/IGTV/동영상 모두 적용됩니다.\n\n📣착수시간\n🕣 0-60분\n· 평균 200,000회~300,000회 속도\n\n📣주문방법\n※ 해당 서비스는 주문링크란에 게시물링크를 넣으셔야 합니다.(아이디X)\nhttps://www.instagram.com/p/------\n\n📣효과\n· 높은 조회수는 컨텐츠의 신뢰도를 높여줍니다.\n\n 📣주의사항\n· 주문 후 링크 수정은 불가능합니다.\n· 조회수 중복주문 시 지원불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복 신청 시 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.\n	0.10	100	2147483647	2349	t	2025-06-18 12:35:38.850405	2025-06-18 12:35:45.591792	\N	5
104	50	실제 한국인 리그램➰	📣[ 서비스 ]\n🇰🇷실제한국인 리그램\n\n*발행 이후 삭제되는 경우 as 불가능합니다.\n\n[ 리그램이란? ]\n내가 원하는 홍보 게시물을 제3자가 올려줍니다.\n제3자는 게시물 이미지, 내용 그대로 포스팅합니다.\n해시태그, 계정태그까지 완벽히 포스팅합니다.\n최적화 계정이 없어도 인기게시물 노출이 가능합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n\n[ 링크입력 예시 ]\nhttps://www.instagram.com/p/------\n\n[ 혜택 ]\n최적화 계정 포스팅\n*인기게시물 작업시 원활한 상위노출\n게시물의 해시태그는 최신게시물 도배 가능\n리그램 한 계정의 팔로워들에게 게시물 노출\n\n*리그램으로 올라온 게시물에 인기게시물 셀프 작업시 상단 노출 가능성 UP!\n\n[ 게시물 조회 ]\n작성하신 해시태그를 조회하여 최근게시물 클릭\n최근게시물에서 포스팅 된 게시물을 확인 할 수 있습니다.\n* 신청량이 많은 경우 채팅방으로 문의주시면 링크를 정리해서 전달드립니다.\n\n[ 추가설명 ]\n리그램 서비스는 홍보하기 저렴하고 효율적입니다.\n1일 100만명에게 게시물을 노출시킬 수 있습니다.\n리그램 결과는 카카오톡 오픈톡으로 문의주세요.\nhttps://open.kakao.com/me/gramii\n\n[ 주의사항 ]\n\n리그램 서비스는 게시물 삭제가 불가능합니다.\n해시태그는 본문(상세내용)에 필히 기재해주세요.\n\n*아래 내용 관련 적발 시 형사처벌 대상이됩니다.\n정치적, 종교적, 핫이슈, 불법적 관련 게시물 이용 시 관·공·서에 관련 자료를 제공합니다.\n\n[유입/변경/취소/환불불가 : 주의사항]\n주문신청 후 링크수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복주문이 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	400.00	1	1000	3694	t	2025-06-18 12:36:07.834147	2025-06-18 12:36:07.834147	\N	1
105	50	✅릴스(Reels) 인게 최상위노출📤	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[ 서비스 ]\n✅릴스(Reels) 인게 최상위노출📤\n노출보장X\n\n[ 진행사항 ]\n자사 계정으로만 진행 가능\n\n[ 링크입력 예 ]\nhttps://www.instagram.com/reel/------\n\n[ 시작시간 ]\n🕣 0-20분\n- 서비스 신청 후 카톡 오픈톡으로 연락 부탁드립니다. 주문번호 기재\nhttps://open.kakao.com/me/gramii\n\n[ 혜택 ]\n1위자리 2개의 칸을 차지(릴스)\n최상위 노출로 인한 홍보(광고) 효과 발생.\n릴스는 영상이기에 화면이 움직이며 전환합니다.\n*이목을 더 확실히 끌 수 있습니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	15000.00	1	10000	\N	t	2025-06-18 12:37:09.548579	2025-06-18 12:37:09.548579	\N	2
106	51	추천탭 최적화 계정 30일💥	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[ 서비스 ]\n\n📌추천탭 최적화 계정(업데이트) 30일📊\n· 본인소유(개인계정) 직접 추천탭 노출[최초공개]\n\n[수량]\n· 계정 1개 당 수량 1\n\n[상세내용]\n· 100% 최적화 계정 보장\n· 추천탭에 노출이 안되는 계정 권장\n· 팔로워 약 5,000명 확보 및 계정지수 Max 증가\n· 추천탭에 노출이 가능한 최적화 계정으로 업데이트\n* 30일간 인친, 지인에게 품앗이 활동, 외 제3자의 게시물 컨택(게시물 클릭)\n\n* 메뉴 - 추천탭 상위노출[TIP] 클릭 후 참조\n\n[변경/취소/환불 불가 : 주의사항]\n· 본 서비스는 서비스 진행 후 취소, 변경, 중지가 불가능합니다.	300000.00	1	10000	\N	t	2025-06-18 12:37:36.188086	2025-06-18 12:37:36.188086	\N	1
108	52	실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻❤️	📣[ 서비스 ]\n💙🇰🇷실제한국인 좋아요💟+팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/----------\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	250.00	5	10000	3132	t	2025-06-18 12:39:35.657293	2025-06-18 12:39:35.657293	\N	1
109	52	[여성] 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻🧡	📣[ 서비스 ]\n💙🇰🇷실제 한국인 [여성] 좋아요💟+팔로워🙇🏻‍♀\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3133	t	2025-06-18 12:39:55.386693	2025-06-18 12:41:33.452364	\N	2
110	52	[남성] 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💛	📣[ 서비스 ]\n💙🇰🇷실제 한국인 [남성] 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3134	t	2025-06-18 12:40:10.043236	2025-06-18 12:41:36.783656	\N	3
111	52	20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💚	📣[ 서비스 ]\n💙🇰🇷실제 20대 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3135	t	2025-06-18 12:40:31.545146	2025-06-18 12:40:46.05279	\N	4
112	52	[여성] 20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워👧🏻💚	📣[ 서비스 ]\n💙🇰🇷실제 20대 [여성] 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3136	t	2025-06-18 12:42:00.428526	2025-06-18 12:42:00.428526	\N	5
113	52	[남성] 20대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻💚	📣[ 서비스 ]\n💙🇰🇷실제 20대 [남성] 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3137	t	2025-06-18 12:42:23.20082	2025-06-18 12:42:23.20082	\N	6
114	52	30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻👧🏻💙	📣[ 서비스 ]\n💙🇰🇷실제 30대 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3138	t	2025-06-18 12:42:50.401545	2025-06-18 12:42:50.401545	\N	7
115	52	[여성] 30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워👧🏻💙	📣[ 서비스 ]\n💙🇰🇷실제 30대 [여성] 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3139	t	2025-06-18 12:43:13.989062	2025-06-18 12:43:13.989062	\N	8
116	52	[남성] 30대 실제 한국인 페이스북 페이지 좋아요 + 팔로워🧑🏻💙	📣[ 서비스 ]\n💙🇰🇷실제 30대 [남성] 한국인 좋아요💟+팔로워🙇🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 100~500 속도\n\n[ 링크입력 예시 ]\nhttps://www.facebook.com/~~~~~~~~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3140	t	2025-06-18 12:44:05.247973	2025-06-18 12:44:05.247973	\N	9
117	53	실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	250.00	5	10000	3141	t	2025-06-18 12:44:27.350435	2025-06-18 12:44:27.350435	\N	1
118	53	[여성] 실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 [여성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3142	t	2025-06-18 12:44:44.229605	2025-06-18 12:44:44.229605	\N	2
119	53	[남성] 실제 한국인 프로필 / 개인 계정 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 [남성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3143	t	2025-06-18 12:45:03.808331	2025-06-18 12:45:03.808331	\N	3
120	53	실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 20대 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3144	t	2025-06-18 12:45:18.726754	2025-06-18 12:45:18.726754	\N	4
121	53	[여성] 실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 20대 [여성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3145	t	2025-06-18 12:46:10.229187	2025-06-18 12:46:10.229187	\N	5
122	53	[남성] 실제 한국인 프로필 / 개인 계정 20대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 20대 [남성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3146	t	2025-06-18 12:46:31.087449	2025-06-18 12:46:31.087449	\N	6
123	53	실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 30대 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	350.00	5	5000	3147	t	2025-06-18 12:46:58.351381	2025-06-18 12:46:58.351381	\N	7
124	53	[여성] 실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 30대 [여성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3148	t	2025-06-18 12:47:14.143251	2025-06-18 12:47:14.143251	\N	8
125	53	[남성] 실제 한국인 프로필 / 개인 계정 30대 팔로워🧑🏻👧🏻	📣[ 서비스 ]\n🟦🇰🇷실제 30대 [남성] 한국인 프로필 팔로워🙋🏻\n\n[ 시작시간 ]\n🕣 0-10분\n- 평균 500명~1,000명 속도\n\n[ 링크입력 예 ]\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	450.00	5	2500	3149	t	2025-06-18 12:47:29.057645	2025-06-18 12:47:29.057645	\N	9
126	54	실제 한국인 게시물 좋아요💖	📣[ 서비스 ]\n🟦🇰🇷실제 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	40.00	5	10000	3150	t	2025-06-18 12:47:58.913537	2025-06-18 12:47:58.913537	\N	1
127	54	[여성] 실제 한국인 게시물 좋아요❤️	📣[ 서비스 ]\n🟦🇰🇷실제 [여성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	50.00	5	5000	3151	t	2025-06-18 12:48:14.037152	2025-06-18 12:48:14.037152	\N	2
128	54	[남성] 실제 한국인 게시물 좋아요🧡	📣[ 서비스 ]\n🟦🇰🇷실제 [남성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	50.00	5	5000	3152	t	2025-06-18 12:48:42.476264	2025-06-18 13:37:46.626202	\N	3
129	54	실제 한국인 20대 게시물 좋아요💛	📣[ 서비스 ]\n🟦🇰🇷실제 20대 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	50.00	5	5000	3153	t	2025-06-18 12:49:00.870234	2025-06-18 12:49:00.870234	\N	4
130	54	[여성] 실제 한국인 20대 게시물 좋아요💚	📣[ 서비스 ]\n🟦🇰🇷실제 20대 [여성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	60.00	5	2500	3154	t	2025-06-18 12:49:40.814773	2025-06-18 12:49:40.814773	\N	5
131	54	[남성] 실제 한국인  20대 게시물 좋아요💙	📣[ 서비스 ]\n🟦🇰🇷실제 20대 [남성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	60.00	5	2500	3155	t	2025-06-18 12:49:59.74304	2025-06-18 12:49:59.74304	\N	6
132	54	실제 한국인 30대 게시물 좋아요💜	📣[ 서비스 ]\n🟦🇰🇷실제 30대 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	50.00	5	5000	3156	t	2025-06-18 12:50:18.071822	2025-06-18 12:50:18.071822	\N	7
133	54	[여성] 실제 한국인 30대 게시물 좋아요🤎	📣[ 서비스 ]\n🟦🇰🇷실제 30대 [여성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	60.00	5	2500	3157	t	2025-06-18 12:50:35.45204	2025-06-18 12:50:35.45204	\N	8
134	54	[남성] 실제 한국인  30대 게시물 좋아요🖤	📣[ 서비스 ]\n🟦🇰🇷실제 30대 [남성] 한국인 게시글 좋아요💟\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 1,000개~2,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~~~\nhttp://www.facebook.com/~~~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	60.00	5	2500	3158	t	2025-06-18 12:50:53.439752	2025-06-18 12:50:53.439752	\N	9
135	55	실제 한국인 게시물 댓글💬	📣[ 서비스 ]\n🟦🇰🇷실제 한국인 랜덤 댓글💬\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 100개~1,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~\nhttp://www.facebook.com/~\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	250.00	5	10000	3159	t	2025-06-18 12:51:10.682242	2025-06-18 12:51:10.682242	\N	1
136	55	[여성] 실제 한국인 댓글 작성💬	📣[ 서비스 ]\n🟦🇰🇷실제 한국인 [여성] 랜덤 댓글💬\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 100개~1,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~\nhttp://www.facebook.com/~\n\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	5	5000	3160	t	2025-06-18 12:51:29.740587	2025-06-18 12:51:29.740587	\N	2
137	55	[남성] 실제 한국인 댓글 작성💬	📣[ 서비스 ]\n🟦🇰🇷실제 한국인 [남성] 랜덤 댓글💬\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 100개~1,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~\nhttp://www.facebook.com/~\n\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	5	5000	3161	t	2025-06-18 12:51:56.598478	2025-06-18 12:51:56.598478	\N	3
138	55	20대 실제 한국인 게시물 댓글💬	📣[ 서비스 ]\n🟦🇰🇷실제 20대 한국인 랜덤 댓글💬\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 100개~1,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~\nhttp://www.facebook.com/~\n\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	5	5000	3162	t	2025-06-18 12:52:15.183484	2025-06-18 12:52:15.183484	\N	4
139	55	30대 실제 한국인 게시물 댓글💬	📣[ 서비스 ]\n🟦🇰🇷실제 30대 한국인 랜덤 댓글💬\n\n[ 시작시간 ]\n🕣 0-5분\n- 평균 100개~1,000개 속도\n\n[ 링크입력 예 ]\n[...] 클릭 후 링크복사\nhttp://m.facebook.com/~\nhttp://www.facebook.com/~\n\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	5	5000	3165	t	2025-06-18 12:52:30.433925	2025-06-18 12:52:30.433925	\N	5
140	56	한국인 유튜브 조회수👁‍🗨	📣[ 서비스 ]\n💙🇰🇷실제 한국인 유튜브 조회수🙋🏻\n\n[ 시작시간 ]\n🕣 0-6시간\n- 평균 1,000~ 속도\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/~~~~~\n\n🔊상세설명\n시작: 즉시 시작\n보장: 30일 무손실 보장\n출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.\n유지 시간: 10~60초.\n\n\n🔊 주문 전 주의사항\n1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n2⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.\n3⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.	20.00	100	5000	3815	t	2025-06-18 12:52:57.081688	2025-06-18 12:52:57.081688	\N	1
141	57	유튜브 한국인 좋아요💝	📣[ 서비스 ]\n💙🇰🇷실제 한국인 유튜브 조회수🙋🏻\n\n[ 시작시간 ]\n🕣 0-6시간\n- 평균 1,000~ 속도\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/~~~~~\n\n🔊상세설명\n시작: 즉시 시작\n보장: 30일내 이탈시 리필 가능 (담당자 문의)\n출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.\n유지 시간: 10~60초.\n\n🔊 주문 전 주의사항\n\n1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n2⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.\n3⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.\n4⃣ 좋아요수가 보이게 공개 상태여야 합니다.\n\n🔉 주문 후 평균 시작시간\n24시간 주문이 가능하며 주문 후 평균 1시간내 자동으로 작업이 시작됩니다.\n(서버 상황에 따라 지연될 수 있습니다.)\n	20.00	10	10000	3973	t	2025-06-18 12:53:15.30181	2025-06-18 12:53:15.30181	\N	1
142	57	유튜브 외국인 동영상 좋아요💕	📣[ 서비스 ]\n💙🇰🇷실제 외국인 유튜브 조회수🙋🏻\n\n[ 시작시간 ]\n🕣 0-6시간\n- 평균 1,000~ 속도\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/~~~~~\n\n🔊상세설명\n시작: 즉시 시작\n보장: 30일내 이탈시 리필 가능 (담당자 문의)\n출처: 외부, 직접 또는 미확인, 추천(추천 동영상) 및 기타 출처.\n유지 시간: 10~60초.\n\n\n🔊 주문 전 주의사항\n\n1⃣ 동일 동영상(URL)에 추가 주문시 이전 주문이 완료된 후 주문하시기 바랍니다.\n2⃣ 이전 작업이 완료되지 않은 상태에서 추가 주문시 누락이 발생될 수 있으며, 이 경우 환불 및 재가동이 불가합니다.\n3⃣ 링크 주문 실수의 경우 재가동 및 환불이 불가합니다.\n4⃣ 좋아요수가 보이게 공개 상태여야 합니다.\n\n🔉 주문 후 평균 시작시간\n24시간 주문이 가능하며 주문 후 평균 1시간내 자동으로 작업이 시작됩니다.\n(서버 상황에 따라 지연될 수 있습니다.)\n	8.00	10	10000	3973	t	2025-06-18 12:53:31.707877	2025-06-18 12:53:31.707877	\N	2
143	58	실제 한국인 유튜브 구독자🧑🏻👧🏻	📣[ 서비스 ]\n🟥🇰🇷실제한국인 구독자🙋🏻\n\n[ A/S 정책 및 이탈율 안내 ]\n- 이탈율은 0~5% 미만입니다.\n- A/S는 자동 진행되며, 90일간 지원됩니다.\n- ID 변경, 비공개 시 A/S 불가능합니다.\n\n[ 시작시간 ]\n🕣 0-6시간\n- 평균 100~500명 속도\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/channel/------\n- 유튜브 채널검색 \\'공유 → 카톡[나] → 링크복사\\'\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ QnA ]\nQ : 구독자 서비스는 영상도 시청하나요?\nA : 실제 유저에 해당되므로, 콘텐츠 취향이 확고한 경우 지속적인 시청도 발생할 수 있습니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	380.00	5	200	3105	t	2025-06-18 12:54:01.916429	2025-06-18 12:54:01.916429	\N	1
144	58	실제 외국인 구독자👱🏻‍♂️👱🏻‍♀️	📣[ 서비스 ]\n🟥🇰🇷실제외국인 구독자🙋🏻\n\n[ A/S 정책 및 이탈율 안내 ]\n- 이탈율은 0~5% 미만입니다.\n- A/S는 자동 진행되며, 90일간 지원됩니다.\n- ID 변경, 비공개 시 A/S 불가능합니다.\n\n[ 시작시간 ]\n🕣 0-6시간\n- 평균 100~500명 속도\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/channel/------\n- 유튜브 채널검색 \\'공유 → 카톡[나] → 링크복사\\'\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ QnA ]\nQ : 구독자 서비스는 영상도 시청하나요?\nA : 실제 유저에 해당되므로, 콘텐츠 취향이 확고한 경우 지속적인 시청도 발생할 수 있습니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.	60.00	100	500000	2878	t	2025-06-18 12:54:20.742553	2025-06-18 12:54:20.742553	\N	2
145	59	실제 한국인 유튜브 영상 댓글💬	📣[ 서비스 ]\n🟥실제 한국인 댓글💬\n- 평균 15초~5분 영상을 시청합니다.\n\n[ 시작시간 ]\n🕣 0-1시간\n- 1일 평균 100개 댓글이 유입됩니다.\n\n[ 링크입력 예시 ]\nhttps://youtu.be/------\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.\n	200.00	5	1000	3123	t	2025-06-18 12:54:38.345348	2025-06-18 12:54:38.345348	\N	1
146	59	실제 한국인 여성 유튜브 영상 댓글💬	📣[ 서비스 ]\n🟥[여성]실제한국인 댓글🙇🏻‍♀💬\n- 평균 15초~5분 영상을 시청합니다.\n\n[ 시작시간 ]\n🕣 0-1시간\n- 평균 100개 속도\n\n[ 링크입력 예시 ]\nhttps://youtu.be/------\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	5	1000	3124	t	2025-06-18 12:54:56.717788	2025-06-18 12:54:56.717788	\N	2
147	59	실제 한국인 남성 유튜브 영상 댓글💬	📣[ 서비스 ]\n🟥[남성]🇰🇷실제한국인 댓글🙇🏻💬\n- 평균 15초~5분 영상을 시청합니다.\n\n[ 시작시간 ]\n🕣 0-1시간\n- 평균 100개 속도\n\n[ 링크입력 예시 ]\nhttps://youtu.be/------\n\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.\n	300.00	5	1000	3125	t	2025-06-18 12:55:11.869214	2025-06-18 12:55:11.869214	\N	3
148	59	외국인 지정 유튜브 영상 댓글💬	📣[ 서비스 ]\n🟥[지정]🇺🇸실제외국인 댓글💬\n- 평균 15초~5분 영상을 시청합니다.\n-서버 내 참여자가 많아 동일한 댓글이 중복으로 달릴 수 있습니다.\n\n[ 시작시간 ]\n🕣 0-30분\n- 평균 10~100개 속도\n\n[ 링크입력 예시 ]\nhttps://youtu.be/------\n* 작성하신 내용 그대로 댓글이 작성됩니다.\n- 1줄 당 1개의 댓글로 작성하실 수 있습니다.\n\n[ 혜택 ]\n- 애드센스(수익창출) 가능합니다.\n- 인기동영상 상승 확률이 증가합니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	20.00	10	10000	1208	t	2025-06-18 12:55:29.455308	2025-06-18 12:55:29.455308	\N	4
149	60	실제 한국 유튜브 영상 공유➰	📣[🟥서비스]\n🇰🇷실제 한국인 공유♻\n\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-1시간\n· 평균 1,000-2,000회 속도\n\n[ 링크입력 예시 ]\nhttps://youtu.be/------\n- 동영상 '공유 → 카톡[나] → 링크복사'\n* 셋팅4 : [주문방법] 클릭 부탁드립니다.\n\n[ 효과 ]\n· 추천동영상으로 노출 될 가능성이 증가합니다.\n· 알고리즘 상, 영상 당 최소 1,000회 ~ 최대 100,000회 이상 권장\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n· 주문 후 링크 수정, 취소는 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복 신청 시 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	10.00	50	10000	2835	t	2025-06-18 12:55:48.459503	2025-06-18 12:55:48.459503	\N	1
150	61	유튜브 라이브 시청자 [30분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(30분 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	8.00	100	1000000	3567	t	2025-06-18 12:56:10.48488	2025-06-18 12:56:10.48488	\N	1
151	61	유튜브 라이브 시청자 [60분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(1시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	12.00	100	1000000	3094	t	2025-06-18 12:56:27.470948	2025-06-18 12:56:27.470948	\N	2
152	61	유튜브 라이브 시청자 [90분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(1시간30분 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	16.00	100	1000000	3568	t	2025-06-18 12:56:45.528939	2025-06-18 12:56:45.528939	\N	3
153	61	유튜브 라이브 시청자 [120분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(2시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	20.00	100	1000000	3095	t	2025-06-18 12:57:00.859758	2025-06-18 12:57:00.859758	\N	4
154	61	유튜브 라이브 시청자 [180분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(3시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	30.00	100	1000000	3570	t	2025-06-18 12:57:16.463614	2025-06-18 12:57:16.463614	\N	5
155	61	유튜브 라이브 시청자 [360분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(6시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	40.00	100	1000000	3417	t	2025-06-18 12:57:32.925571	2025-06-18 12:57:32.925571	\N	6
156	61	유튜브 라이브 시청자 [720분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(8시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	45.00	100	1000000	3470	t	2025-06-18 12:57:52.513429	2025-06-18 12:57:52.513429	\N	7
157	61	유튜브 라이브 시청자 [1440분]👁‍🗨	📣[ 서비스 ]\n[🟥순위상승🔝] 라이브 시청자(24시간 시청)\n라이브 중인 영상에 시청자들이 유입됩니다..\n\n▶[메뉴] - [📈유튜브 채널 성장 TIP]\n· 채널 성장을 위한 알고리즘을 무료로 제공합니다.\n\n[ 시작시간 ]\n🕣 0-5분\n예 : 수량 1000→시청자 평균 1,000명 1시간 유지\n예 : 수량 2000→시청자 평균 2,000명 1시간 유지\n* 대기 상태에서 신청하시면 안됩니다.\n* 라이브 시작과 동시에 신청해주세요.\n\n[ 링크입력 예시 ]\nhttps://www.youtube.com/watch?v=-------------\n\n[ 혜택 ]\n- 유튜브 애드센스 승인 가능\n- 추천동영상으로 노출 될 가능성이 높음\n- 즉시 진행되며 실시간으로 높은 시청자수 확보\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	50.00	100	1000000	3558	t	2025-06-18 12:58:11.884561	2025-06-18 12:58:11.884561	\N	8
162	63	라이브 조회수👁‍🗨	📣[서비스]\n(🎵) 실제 사람 라이브 시청자🤳\n\n▶시작시간\n· 🕣 0-5분\n\n▶링크입력 예\n· https://vt.tiktok.com/xxxxxx/ 공유 → 링크복사\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶변경/취소/환불 불가 : 주의사항\n· 주문 후 링크 수정, 취소는 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복 신청 시 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.\n	5.00	100	100000000	2291	t	2025-06-18 13:04:59.711388	2025-06-18 13:04:59.711388	\N	1
163	63	비디오 조회수👁‍🗨	📣[서비스]\n(🎵) 🇺🇸실제 사람 조회수🤳\n\n▶시작시간\n· 🕣 0-5분\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	3.00	100	100000000	3665	t	2025-06-18 13:05:19.100723	2025-06-18 13:05:19.100723	\N	2
164	64	좋아요❤️	📣[서비스]\n(🎵)실제 사람 좋아요💛\n· 영상을 시청하고 좋아요를 클릭합니다.\n\n▶시작시간\n· 🕣 0-5분\n· 시간 당 평균 : 1,000~2,000회 속도\n. 30일 리필 가능\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	5.00	10	2000000	3663	t	2025-06-18 13:05:38.465217	2025-06-18 13:05:38.465217	\N	1
165	64	좋아요 + 조회수❤️👁‍🗨	📣[서비스]\n(🎵)실제 사람 좋아요 + 조회수💛\n· 영상을 시청하고 좋아요를 클릭합니다.\n\n▶시작시간\n· 🕣 0-5분\n· 시간 당 평균 : 1,000~2,000회 속도\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	7.00	10	10000000	3952	t	2025-06-18 13:05:55.277183	2025-06-18 13:05:55.277183	\N	2
166	64	남성 좋아요 + 조회수🧑🏻❤️👁‍🗨	📣[서비스]\n(🎵)실제 [남성] 좋아요 + 조회수💛\n· 영상을 시청하고 좋아요를 클릭합니다.\n\n▶시작시간\n· 🕣 0-5분\n· 시간 당 평균 : 1,000~2,000회 속도\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	8.00	10	1000000	3950	t	2025-06-18 13:06:13.084349	2025-06-18 13:06:13.084349	\N	3
167	64	여성 좋아요 + 조회수👧🏻❤️👁‍🗨	📣[서비스]\n(🎵)실제 [여성] 좋아요 + 조회수💛\n· 영상을 시청하고 좋아요를 클릭합니다.\n\n▶시작시간\n· 🕣 0-5분\n· 시간 당 평균 : 1,000~2,000회 속도\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	8.00	10	1000000	3951	t	2025-06-18 13:06:29.113256	2025-06-18 13:06:29.113256	\N	4
168	65	실제 외국인 팔로워👱🏻‍♂️👱🏻‍♀️	📣[서비스]\n(🎵) 🇺🇸실제 외국인 빠른 팔로워🙋🏼\n· 이탈율 : 0~10%\n· A/S 지원 : 신청일 기준 30일\n\n▶시작시간\n· 🕣 0-5분\n· 하루 평균 : 5,000~25,000명 속도\n\n▶링크입력 예\n· https://vt.tiktok.com/------/\n· 영상 클릭 → [...] 클릭 후 '링크복사' 클릭\n\n▶유입/변경/취소/환불불가 : 주의사항\n· 주문신청 후 링크수정은 불가능합니다.\n· 비공개, 보관, 삭제의 경우가 해당됩니다.\n· 링크를 실수로 오입력한 경우가 해당됩니다.\n· 유입 미완료 상태로 중복주문이 해당됩니다.\n· 유입 미완료 상태로 아이디 변경 시 해당됩니다.	30.00	10	50000	2461	t	2025-06-18 13:06:48.499644	2025-06-18 13:06:48.499644	\N	1
171	67	외국인 좋아요💙	📣[서비스]\n실제외국인 좋아요💛 - 5원\n\n▶안내사항\n· 트위터 자체 업데이트 시 일부 좋아요, 팔로워 초기화 현상이 있습니다.\n· A/S 30일간 지원되며, 그 이후 발생하는 이탈건은 지원이 불가능합니다.\n\n▶시작시간\n· 🕣 0-15분\n· 평균 1,000개~3,000개 속도\n\n▶링크입력 예\n· https://x.com/xxxxx/status/1------\n· Share → CopyLink\n\n▶변경/취소/환불 불가 : 주의사항\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	7.00	10	50000	3754	t	2025-06-18 13:08:48.939327	2025-06-18 13:08:48.939327	\N	1
170	68	실제 한국인 스레드 좋아요💜	📣[서비스]\n🇰🇷실제한국인 좋아요❤\n\n[ 시작시간 ]\n🕣 0-30분\n- 평균 200개~500개 속도\n\n[ 링크 입력 예시 ]\nhttps://www.threads.net/t/--------/-------\n\n[ 효과 ]\n높은 좋아요는 컨텐츠의 신뢰도를 높여줍니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정은 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	18.00	5	10000	3722	t	2025-06-18 13:07:51.666235	2025-06-18 13:07:51.666235	\N	2
173	69	조회수👁‍🗨	조회수👁‍🗨	8.00	10	10000000	3237	t	2025-06-18 13:09:25.564263	2025-06-18 13:09:25.564263	\N	1
172	70	팔로워👱🏻‍♂️👱🏻‍♀️	📣[서비스]\n빠른 팔로워🙋🏻‍♀\n· 실제계정 처럼  꾸며진 프로필(가계정)\n\n▶안내사항\n· 트위터 자체 업데이트 시 일부 좋아요, 팔로워 초기화 현상이 있습니다.\n· A/S 30일간 지원되며, 그 이후 발생하는 이탈건은 지원이 불가능합니다.\n\n▶시작시간\n· 🕣 0-15분\n· 평균 2000~3,000명 유입 속도\n\n▶링크입력 예\n· https://x.com/-----\n· 프로필 링크복사\n\n▶변경/취소/환불 불가 : 주의사항\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	80.00	100	100000	3752	t	2025-06-18 13:09:07.303173	2025-06-18 13:09:07.303173	\N	1
174	71	실제 한국인 카톡 채널 친구추가🤩	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💛 🇰🇷실제한국인 카카오톡 채널 친구추가\n\n[ 시작시간 ]\n🕣 0-1시간\n- 평균 200명~1,000명 속도\n\n[ 링크입력 예시 ]\nhttps://pf.kakao.com/xxxxx/friend\n- 채널 링크를 확인 후 신청 부탁드립니다.\n- 신청 후 카카오톡 채널로 연락 부탁드립니다.\n\n[ 변경/취소/환불 불가 : 주의사항 ]\n주문 후 링크 수정, 취소는 불가능합니다.\n비공개, 보관, 삭제의 경우가 해당됩니다.\n링크를 실수로 오입력한 경우가 해당됩니다.\n유입 미완료 상태로 중복 신청 시 해당됩니다.\n유입 미완료 상태로 아이디 변경 시 해당됩니다.	300.00	100	1000000	\N	t	2025-06-18 13:10:18.549314	2025-06-18 13:10:18.549314	\N	1
175	72	실제 한국인 유입(체류)🏃🏻‍♂️🏃🏻‍♀️	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실제 한국인 리워드 트래픽🙋🏻\n· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되는 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.\n· 상위 노출 원하는 키워드를 꼭 입력 해주세요.\n· 주문 단위는 100단위로 가능 합니다.\n\n▶시작시간\n· 오후3시 이전 주문시 익일구동\n이후 주문시 2일 뒤 구동시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n7일단위로 주문 가능\nAS 및 환불 불가능	50.00	100	1000000	\N	t	2025-06-18 13:11:59.641735	2025-06-18 13:11:59.641735	\N	1
176	72	실제 한국인 저장하기💕	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실제 한국인 리워드+저장하기 🙋🏻\n· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되어 저장하기까지 클릭되는 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.\n· 상위 노출 원하는 키워드를 꼭 입력 해주세요.\n· 주문 단위는 100단위로 가능 합니다.\n\n▶시작시간\n· 오후3시 이전 주문시 익일구동\n이후 주문시 2일 뒤 구동시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n7일단위로 주문 가능\nAS 및 환불 불가능	100.00	100	1000000	\N	t	2025-06-18 13:12:18.256438	2025-06-18 13:12:18.256438	\N	2
177	72	실제 한국인 공유하기📌	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실제 한국인 리워드+공유하기 🙋🏻\n· 여러 매체사를 통해 실명인증 된 소비자가 플레이스에 유입되어 공유하기까지 클릭되는 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경 이 불가한 상품 입니다.\n· 상위 노출 원하는 키워드를 꼭 입력 해주세요.\n· 주문 단위는 100단위로 가능 합니다.\n\n▶시작시간\n· 오후3시 이전 주문시 익일구동\n이후 주문시 2일 뒤 구동시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n7일단위로 주문 가능\nAS 및 환불 불가능	100.00	100	1000000	\N	t	2025-06-18 13:12:33.051631	2025-06-18 13:12:33.051631	\N	3
179	74	[비실계] 블로그 리뷰-일반 지수💬	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실계정 블로그 리뷰 (준최4 이상) 🙋🏻\n· 실명인증이 완료 된 실제 리뷰어가 작성하는 준최적화4 이상등급의 블로그 리뷰 입니다.\n-원하는 키워드 상위노출에 최적화 된 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경 및 사진 추가,변경이 불가한 상품 입니다.\n· 대표 해시태그를 꼭 입력 해주세요.\n· 하루 발행량을 꼭 작성 해주세요.\n· 사진전달을 위해 꼭 별도 문의가 필요 합니다.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일이내 발행시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.\n	900.00	30	1000000	\N	t	2025-06-18 13:13:48.725612	2025-06-18 13:13:48.725612	\N	1
181	74	[실계정] 블로그 리뷰-준최2 이상 지수💬	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실계정 블로그 리뷰 (준최4 이상) 🙋🏻\n· 실명인증이 완료 된 실제 리뷰어가 작성하는 준최적화4 이상등급의 블로그 리뷰 입니다.\n-원하는 키워드 상위노출에 최적화 된 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경 및 사진 추가,변경이 불가한 상품 입니다.\n· 대표 해시태그를 꼭 입력 해주세요.\n· 하루 발행량을 꼭 작성 해주세요.\n· 사진전달을 위해 꼭 별도 문의가 필요 합니다.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일이내 발행시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.	2500.00	30	1000000	\N	t	2025-06-18 13:14:32.003786	2025-06-18 13:14:32.003786	\N	3
182	74	[자체제작] 영수증 리뷰💬	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷실제 자체제작 영수증 리뷰 🙋🏻\n· 실제 카드단말기를 통해 해당 업장의 영수증을 제작하여 영수증 리뷰(방문자리뷰)를 작성하는 상품 입니다.\n-방문자리뷰 갯수 쌓기 및 맛집,카페 업종에 강력 추천 드립니다.\n\n▶안내사항\n· 작업 구동중에는 상품 변경 및 사진 추가,변경이 불가한 상품 입니다.\n· 하루 발행량을 꼭 작성 해주세요.\n· 사진전달을 위해 꼭 별도 문의가 필요 합니다.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일이내 발행시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.	3500.00	50	1000000	\N	t	2025-06-18 13:14:54.963405	2025-06-18 13:14:54.963405	\N	4
183	75	일반 키워드 자동완성어💫	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷네이버 검색창 자동완성 🙋🏻\n· 검색창에 키워드를 검색시 하단에 자동으로 업장의 상호명이 노출되는 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경이 불가한 상품 입니다.\n· 노출 원하는 키워드와 상호명을 꼭 기재 해주세요.\n· 별도 문의는 아래 링크를 통해 문의 주세요.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일이내 작업 시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.\n	150000.00	1	1000000	\N	t	2025-06-18 13:15:38.3772	2025-06-18 13:15:38.3772	\N	1
184	75	맛집 키워드 자동완성어💫	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💙🇰🇷네이버 검색창 자동완성 🙋🏻\n· 검색창에 키워드를 검색시 하단에 자동으로 업장의 상호명이 노출되는 상품 입니다.\n\n▶안내사항\n· 작업 구동중에는 키워드 변경이 불가한 상품 입니다.\n· 노출 원하는 키워드와 상호명을 꼭 기재 해주세요.\n· 별도 문의는 아래 링크를 통해 문의 주세요.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일이내 작업 시작\n\n▶링크입력 예\nhttps://m.place.naver.com/----------\n모바일 버전의 네이버 플레이스 링크를 입력 해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n작업이 시작된 후 키워드 변경 및 환불 불가 상품 입니다.	200000.00	1	1000000	\N	t	2025-06-18 13:15:53.909507	2025-06-18 13:15:53.909507	\N	2
185	76	슬롯🏃🏻‍♂️🏃🏻‍♀️	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n🛒네이버 스마트스토어 슬롯 노출 🙋🏻\n· 네이버 쇼핑 검색 시 스마트스토어 상단 영역(슬롯)에 노출되어 타 매장보다 앞선 클릭 유도가 가능한 프리미엄 노출 상품입니다.\n\n▶안내사항\n· 1슬롯당 100유입, 10일 구동이 들어갑니다.\n· 슬롯 노출은 지정 키워드 기반으로 운영 됩니다.\n· 원하는 키워드와 스마트스토어 링크를 꼭 함께 전달해주세요.\n· 상품 특성과 키워드에 따라 슬롯 노출 성과는 달라질 수 있습니다.\n· 별도 문의는 아래 링크를 통해 문의 주세요.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일 이내 작업 시작\n\n▶링크입력 예\nhttps://smartstore.naver.com/----------\n스마트스토어 상품 링크를 입력해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n· 작업이 시작된 이후에는 키워드 변경 및 환불이 불가합니다.\n· 슬롯 특성상 시간 단위로 노출 결과가 달라질 수 있음을 유의해주세요.	50000.00	1	1000000	\N	t	2025-06-18 13:16:41.253357	2025-06-18 13:16:41.253357	\N	1
186	76	상품찜💕	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n💚🛍️네이버 스마트스토어 상품찜 🙋🏻\n· 스마트스토어 상품찜 수를 증가시켜 스토어 신뢰도 상승 및 알고리즘 노출 강화를 유도하는 상품입니다.\n· 상품찜 수가 많을수록 상위 노출 및 쇼핑탭 내 경쟁력 강화에 효과적인 상품 입니다.\n\n▶안내사항\n· 작업은 스마트스토어 메인 상품찜 기준으로 진행됩니다.\n· 상품찜 수는 자연스러운 속도로 분산되어 작업되며, 단기간 집중 작업을 지양합니다.\n· 원하는 스마트스토어 상품 링크를 꼭 함께 전달해주세요.\n· 별도 문의는 아래 링크를 통해 문의 주세요.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일 이내 작업 시작\n\n▶링크입력 예\nhttps://smartstore.naver.com/----------\n상품찜을 원하는 스마트스토어 상품 링크를 입력해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n· 작업이 시작된 이후에는 변경 및 환불이 불가합니다.\n· 상품찜 작업은 실제 노출 및 판매를 보장하는 상품은 아니며, 스토어 신뢰도 향상을 위한 서포트성 작업입니다.	200.00	1	1000000	\N	t	2025-06-18 13:17:00.843335	2025-06-18 13:17:00.843335	\N	2
187	76	알림받기📌	📌서비스 신청 후 카카오채널로 문의 부탁드립니다.\n\n📣[서비스]\n🔔🛒네이버 스마트스토어 알림받기 🙋🏻\n· 스마트스토어 ‘알림받기’를 통해 신상품 등록 시 고객에게 푸시 알림이 가는 구조로, 충성 고객 확보 및 재구매 유도에 효과적인 마케팅 상품입니다.\n\n▶안내사항\n· ‘알림받기’ 수가 많을수록 스토어의 인기 및 관심도 상승에 도움이 됩니다.\n· 작업은 자연 유입 기반으로 분산되어 진행되며, 비정상적인 급증을 방지하기 위해 단계별로 수행됩니다.\n· 원하는 스마트스토어 링크를 꼭 함께 전달해주세요.\n· 별도 문의는 아래 링크를 통해 문의 주세요.\nhttps://open.kakao.com/me/gramii\n\n▶시작시간\n· 주문 접수 후 3일 이내 작업 시작\n\n▶링크입력 예\nhttps://smartstore.naver.com/----------\n알림받기 작업을 원하는 스마트스토어 메인 링크를 입력해주세요.\n\n▶변경/취소/환불 불가 : 주의사항\n· 작업이 시작된 이후에는 변경 및 환불이 불가합니다.\n· 본 서비스는 스토어 팔로워 수를 증가시키는 마케팅 목적의 작업이며, 실시간 매출 증가와는 무관할 수 있습니다.	200.00	1	1000000	\N	t	2025-06-18 13:17:16.913452	2025-06-18 13:17:16.913452	\N	3
158	77	웹사이트 트래픽 from 구글🧡	📣[서비스]\n웹사이트 트래픽 구글 \n웹사이트의 트레픽을 늘려드리는 서비스입니다.\n\n[ 주문 후 작업시간]\n평균 1~12시간내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n[서비스 설명]\n100% 실제 유저 트래픽입니다.\n전 세계에서 유입되는 트래픽입니다.\n구글 애널리틱스 지원, 하루 평균 1만명 증가\n\n[주의사항]\n주문실수의 경우 취소 및 수정이 불가능합니다.\n동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.\n성인/도박/불법 사이트는 작업이 불가능합니다.\n\n[링크형식]\n전체 웹 사이트 URL을 입력해주세요	1.30	500	10000000	974	t	2025-06-18 12:58:35.129627	2025-06-18 12:58:35.129627	\N	1
159	78	웹사이트 트래픽 from 페이스북💙	📣[서비스]\n웹사이트 트래픽 페이스북 \n페이스북내에 트레픽을 늘려드리는 서비스입니다.\n\n[ 주문 후 작업시간]\n평균 1~12시간내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n[서비스 설명]\n100% 실제 유저 트래픽입니다.\n전 세계에서 유입되는 트래픽입니다.\n하루 최대 5만명 증가\n\n[주의사항]\n주문실수의 경우 취소 및 수정이 불가능합니다.\n동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.\n성인/도박/불법 사이트는 작업이 불가능합니다.\n\n[링크형식]\n전체 웹 사이트 URL을 입력해주세요	1.30	500	1000000	975	t	2025-06-18 12:58:51.628401	2025-06-18 12:58:51.628401	\N	1
160	79	웹사이트 트래픽 from 인스타그램💗	📣[서비스]\n웹사이트 트래픽 인스타그램 \n인스타그램의 트레픽을 늘려드리는 서비스입니다.\n\n[ 주문 후 작업시간]\n평균 1~12시간내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n[서비스 설명]\n100% 실제 유저 트래픽입니다.\n전 세계에서 유입되는 트래픽입니다.\n하루 최대 5만명 증가\n\n[주의사항]\n주문실수의 경우 취소 및 수정이 불가능합니다.\n동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.\n성인/도박/불법 사이트는 작업이 불가능합니다.\n\n[링크형식]\n전체 웹 사이트 URL을 입력해주세요	1.30	500	1000000	976	t	2025-06-18 12:59:16.851451	2025-06-18 12:59:16.851451	\N	1
161	80	웹사이트 트래픽 from 네이버💚	📣[서비스]\n웹사이트 트래픽 네이버 \n네이버 웹사이트의 트레픽을 늘려드리는 서비스입니다.\n\n[ 주문 후 작업시간]\n평균 1~12시간내 시작됩니다.\n365일 24시간 언제든지 자동으로 시작됩니다.\n\n[서비스 설명]\n100% 실제 유저 트래픽입니다.\n데스크탑 45~55%\n모바일 45~55%\n실제 한국에서 유입되는 트래픽입니다.\n하루 최대 10만명 증가\n이탈율 30~40%\n\n[주의사항]\n주문실수의 경우 취소 및 수정이 불가능합니다.\n동일한 링크(URL)에 추가 주문 시에는 꼭 이전 주문이 완료된 후 주문해 주세요.\n성인/도박/불법 사이트는 작업이 불가능합니다.\n\n[링크형식]\n전체 웹 사이트 URL을 입력해주세요	2.00	1000	1000000	1746	t	2025-06-18 12:59:49.25954	2025-06-18 12:59:49.25954	\N	1
\.


--
-- Data for Name: sms_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sms_logs (id, sender, body, received_at_app, created_at) FROM stdin;
\.


--
-- Data for Name: specials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.specials (id, name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_service_prices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_service_prices (id, user_id, service_id, custom_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, password, email, points, role, created_at, updated_at, name, phone_number, referrer_id, admin_referral_code, username) FROM stdin;
5	$2b$10$bv78CX3g7h..q6Uz8p7E9eMKz5VnRAThdkCSDnpw.6YzDxvk1N4zW	gtod80101@naver.com	0	user	2025-05-23 13:36:36.860207	2025-05-23 13:36:36.860207	강동현3	+821090083541	3	BSASZM	\N
3	$2b$10$R1x7QkJ54mBz1lgN5gcHX..tk9gL5IXaOrvDsqEmG4cwmT8poJOdW	gtod8010@naver.com	4108	admin	2025-05-13 21:23:42.457399	2025-05-13 21:23:42.457399	강동현	010-5788-9281	\N	123456	\N
4	$2b$10$xRdHqkTPVYJCuetbhicGTOAlpB7aQOaA6RJkP57kup4.I0PHcH1Fe	you@1.com	1000	user	2025-05-21 19:24:43.583228	2025-05-21 19:24:43.583228	홍길동	010-2222-2222	3	\N	\N
6	$2b$10$1vPqvFCNT5tRLlRYfOH6Du1pdFzUyOtpqZV2AF1HAr4GMf9XKkvHm	gtod80104@naver.com	19990	user	2025-05-23 13:43:04.58193	2025-05-23 13:43:04.58193	강동현4	+821090083542	\N	YHBP6M	\N
7	$2b$10$EpiBzFof1vWNrUetaSGnfe1rmjunM7hbESiKb8QiXKjAwrz.a7rz.	gtod80105@naver.com	50	user	2025-06-11 21:24:31.542253	2025-06-11 21:24:31.542253	강동현	010-1111-1112	\N	QEHUTX	abc
8	$2b$10$sRQ7eKUvfMmyfcuew9uo1u1TYruh1U2RlP9JfFV.1iO8YQkeaVCIu	admin@test.com	3418	admin	2025-06-12 18:17:48.524142	2025-06-16 17:27:40.257225	관리자	010-1111-1111	\N	BTW6OZ	admin
10	$2b$10$/bBQxZFFmwodjNZtgqM/E.V6cZm7hTN/uJfbhy2i/YlkPq5m.oYuS	1@w.com	0	user	2025-07-14 12:10:34.862527	2025-07-14 12:10:34.862527	김남국	010-2222-1212	\N	J3YW8K	0714
11	$2b$10$HPxx1SM.Y7/tEdvpNEqnde3yClR8gCl51PPa6xwuomQFrsi/7UHCC	gtod80109@naver.com	0	admin	2025-07-29 19:49:26.859346	2025-07-29 19:49:26.859346	ㅏ가	010-1111-1113	\N	JO0CBJ	admin2
\.


--
-- Name: deposit_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.deposit_requests_id_seq', 10, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- Name: point_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.point_transactions_id_seq', 1, true);


--
-- Name: realsite_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.realsite_services_id_seq', 849, true);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 26, true);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_types_id_seq', 80, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 187, true);


--
-- Name: sms_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sms_logs_id_seq', 1, false);


--
-- Name: specials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.specials_id_seq', 4, true);


--
-- Name: user_service_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_service_prices_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: deposit_requests deposit_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deposit_requests
    ADD CONSTRAINT deposit_requests_pkey PRIMARY KEY (id);


--
-- Name: main_page_metrics main_page_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.main_page_metrics
    ADD CONSTRAINT main_page_metrics_pkey PRIMARY KEY (metric_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: point_transactions point_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);


--
-- Name: realsite_services realsite_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realsite_services
    ADD CONSTRAINT realsite_services_pkey PRIMARY KEY (id);


--
-- Name: realsite_services realsite_services_realsite_service_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realsite_services
    ADD CONSTRAINT realsite_services_realsite_service_id_key UNIQUE (realsite_service_id);


--
-- Name: service_categories service_categories_display_order_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_display_order_key UNIQUE (display_order);


--
-- Name: service_categories service_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_name_key UNIQUE (name);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_types service_types_category_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_name_key UNIQUE (category_id, name);


--
-- Name: service_types service_types_category_order_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_order_unique UNIQUE (category_id, display_order);


--
-- Name: service_types service_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: services services_service_type_id_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_name_key UNIQUE (service_type_id, name);


--
-- Name: services services_type_order_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_type_order_unique UNIQUE (service_type_id, display_order);


--
-- Name: sms_logs sms_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_logs
    ADD CONSTRAINT sms_logs_pkey PRIMARY KEY (id);


--
-- Name: specials specials_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specials
    ADD CONSTRAINT specials_name_key UNIQUE (name);


--
-- Name: specials specials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specials
    ADD CONSTRAINT specials_pkey PRIMARY KEY (id);


--
-- Name: user_service_prices uq_user_service_price; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT uq_user_service_price UNIQUE (user_id, service_id);


--
-- Name: CONSTRAINT uq_user_service_price ON user_service_prices; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT uq_user_service_price ON public.user_service_prices IS '사용자 ID와 서비스 ID 조합은 유일해야 함 (한 사용자는 서비스당 하나의 특별 단가만 가짐)';


--
-- Name: user_service_prices user_service_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_pkey PRIMARY KEY (id);


--
-- Name: users users_admin_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_admin_referral_code_key UNIQUE (admin_referral_code);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_deposit_requests_requested_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deposit_requests_requested_at ON public.deposit_requests USING btree (requested_at);


--
-- Name: idx_deposit_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deposit_requests_status ON public.deposit_requests USING btree (status);


--
-- Name: idx_deposit_requests_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deposit_requests_user_id ON public.deposit_requests USING btree (user_id);


--
-- Name: idx_user_service_prices_service_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_service_prices_service_id ON public.user_service_prices USING btree (service_id);


--
-- Name: idx_user_service_prices_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_service_prices_user_id ON public.user_service_prices USING btree (user_id);


--
-- Name: user_service_prices set_timestamp_user_service_prices; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp_user_service_prices BEFORE UPDATE ON public.user_service_prices FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: deposit_requests deposit_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deposit_requests
    ADD CONSTRAINT deposit_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: services fk_services_specials; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk_services_specials FOREIGN KEY (special_id) REFERENCES public.specials(id) ON DELETE SET NULL;


--
-- Name: orders orders_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: point_transactions point_transactions_related_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.orders(id);


--
-- Name: point_transactions point_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_types service_types_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);


--
-- Name: services services_service_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_fkey FOREIGN KEY (service_type_id) REFERENCES public.service_types(id);


--
-- Name: user_service_prices user_service_prices_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: user_service_prices user_service_prices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

