PGDMP     )            	        }         	   gramii_db    14.17 (Homebrew)    14.17 (Homebrew) h    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    29433 	   gramii_db    DATABASE     T   CREATE DATABASE gramii_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE gramii_db;
                dwight.k    false            �            1255    29576    trigger_set_timestamp()    FUNCTION     �   CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
 .   DROP FUNCTION public.trigger_set_timestamp();
       public          postgres    false            �            1259    29579    deposit_requests    TABLE     -  CREATE TABLE public.deposit_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    depositor_name character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    receipt_type character varying(50) DEFAULT 'none'::character varying,
    requested_at timestamp with time zone DEFAULT now() NOT NULL,
    confirmed_at timestamp with time zone,
    matched_tran_info jsonb,
    admin_memo text,
    CONSTRAINT deposit_requests_amount_check CHECK ((amount > 0))
);
 $   DROP TABLE public.deposit_requests;
       public         heap    postgres    false            �            1259    29578    deposit_requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.deposit_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.deposit_requests_id_seq;
       public          postgres    false    224            �           0    0    deposit_requests_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.deposit_requests_id_seq OWNED BY public.deposit_requests.id;
          public          postgres    false    223            �            1259    29619    main_page_metrics    TABLE     �  CREATE TABLE public.main_page_metrics (
    metric_id character varying(50) NOT NULL,
    metric_name character varying(100) NOT NULL,
    current_value bigint DEFAULT 0 NOT NULL,
    base_value_for_daily bigint DEFAULT 0,
    last_calculated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    increment_per_hour integer DEFAULT 0,
    increment_per_day_fixed integer DEFAULT 0,
    last_daily_increment_date date
);
 %   DROP TABLE public.main_page_metrics;
       public         heap    postgres    false            �            1259    29434    orders    TABLE     �  CREATE TABLE public.orders (
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
    DROP TABLE public.orders;
       public         heap    dwight.k    false            �            1259    29442    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          dwight.k    false    209            �           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          dwight.k    false    210            �            1259    29443    point_transactions    TABLE     ?  CREATE TABLE public.point_transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount integer NOT NULL,
    transaction_type character varying(50) NOT NULL,
    related_order_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    balance_after_transaction integer
);
 &   DROP TABLE public.point_transactions;
       public         heap    dwight.k    false            �            1259    29447    point_transactions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.point_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.point_transactions_id_seq;
       public          dwight.k    false    211            �           0    0    point_transactions_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.point_transactions_id_seq OWNED BY public.point_transactions.id;
          public          dwight.k    false    212            �            1259    29448    service_categories    TABLE     4  CREATE TABLE public.service_categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 &   DROP TABLE public.service_categories;
       public         heap    dwight.k    false            �            1259    29456    service_categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.service_categories_id_seq;
       public          dwight.k    false    213            �           0    0    service_categories_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;
          public          dwight.k    false    214            �            1259    29457    service_types    TABLE     Q  CREATE TABLE public.service_types (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.service_types;
       public         heap    dwight.k    false            �            1259    29465    service_types_id_seq    SEQUENCE     �   CREATE SEQUENCE public.service_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.service_types_id_seq;
       public          dwight.k    false    215            �           0    0    service_types_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.service_types_id_seq OWNED BY public.service_types.id;
          public          dwight.k    false    216            �            1259    29466    services    TABLE       CREATE TABLE public.services (
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
    special_id integer
);
    DROP TABLE public.services;
       public         heap    dwight.k    false            �            1259    29474    services_id_seq    SEQUENCE     �   CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.services_id_seq;
       public          dwight.k    false    217            �           0    0    services_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;
          public          dwight.k    false    218            �            1259    29600    specials    TABLE     *  CREATE TABLE public.specials (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.specials;
       public         heap    postgres    false            �            1259    29599    specials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.specials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.specials_id_seq;
       public          postgres    false    226            �           0    0    specials_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.specials_id_seq OWNED BY public.specials.id;
          public          postgres    false    225            �            1259    29554    user_service_prices    TABLE     E  CREATE TABLE public.user_service_prices (
    id integer NOT NULL,
    user_id integer NOT NULL,
    service_id integer NOT NULL,
    custom_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 '   DROP TABLE public.user_service_prices;
       public         heap    postgres    false            �           0    0    TABLE user_service_prices    COMMENT     y   COMMENT ON TABLE public.user_service_prices IS '사용자별 특정 서비스에 대한 특별 단가 설정 테이블';
          public          postgres    false    222            �           0    0    COLUMN user_service_prices.id    COMMENT     G   COMMENT ON COLUMN public.user_service_prices.id IS '고유 식별자';
          public          postgres    false    222            �           0    0 "   COLUMN user_service_prices.user_id    COMMENT     a   COMMENT ON COLUMN public.user_service_prices.user_id IS '사용자 ID (users 테이블 참조)';
          public          postgres    false    222            �           0    0 %   COLUMN user_service_prices.service_id    COMMENT     g   COMMENT ON COLUMN public.user_service_prices.service_id IS '서비스 ID (services 테이블 참조)';
          public          postgres    false    222            �           0    0 '   COLUMN user_service_prices.custom_price    COMMENT     _   COMMENT ON COLUMN public.user_service_prices.custom_price IS '사용자 지정 특별 단가';
          public          postgres    false    222            �           0    0 %   COLUMN user_service_prices.created_at    COMMENT     L   COMMENT ON COLUMN public.user_service_prices.created_at IS '생성 일시';
          public          postgres    false    222            �           0    0 %   COLUMN user_service_prices.updated_at    COMMENT     L   COMMENT ON COLUMN public.user_service_prices.updated_at IS '수정 일시';
          public          postgres    false    222            �            1259    29553    user_service_prices_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_service_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.user_service_prices_id_seq;
       public          postgres    false    222            �           0    0    user_service_prices_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.user_service_prices_id_seq OWNED BY public.user_service_prices.id;
          public          postgres    false    221            �            1259    29475    users    TABLE       CREATE TABLE public.users (
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
    admin_referral_code character varying(6)
);
    DROP TABLE public.users;
       public         heap    dwight.k    false            �            1259    29484    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          dwight.k    false    219            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          dwight.k    false    220            �           2604    29582    deposit_requests id    DEFAULT     z   ALTER TABLE ONLY public.deposit_requests ALTER COLUMN id SET DEFAULT nextval('public.deposit_requests_id_seq'::regclass);
 B   ALTER TABLE public.deposit_requests ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    29485 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    210    209            �           2604    29486    point_transactions id    DEFAULT     ~   ALTER TABLE ONLY public.point_transactions ALTER COLUMN id SET DEFAULT nextval('public.point_transactions_id_seq'::regclass);
 D   ALTER TABLE public.point_transactions ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    212    211            �           2604    29487    service_categories id    DEFAULT     ~   ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);
 D   ALTER TABLE public.service_categories ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    214    213            �           2604    29488    service_types id    DEFAULT     t   ALTER TABLE ONLY public.service_types ALTER COLUMN id SET DEFAULT nextval('public.service_types_id_seq'::regclass);
 ?   ALTER TABLE public.service_types ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    216    215            �           2604    29489    services id    DEFAULT     j   ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);
 :   ALTER TABLE public.services ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    218    217            �           2604    29603    specials id    DEFAULT     j   ALTER TABLE ONLY public.specials ALTER COLUMN id SET DEFAULT nextval('public.specials_id_seq'::regclass);
 :   ALTER TABLE public.specials ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    29557    user_service_prices id    DEFAULT     �   ALTER TABLE ONLY public.user_service_prices ALTER COLUMN id SET DEFAULT nextval('public.user_service_prices_id_seq'::regclass);
 E   ALTER TABLE public.user_service_prices ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    29490    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          dwight.k    false    220    219            �          0    29579    deposit_requests 
   TABLE DATA           �   COPY public.deposit_requests (id, user_id, amount, depositor_name, status, receipt_type, requested_at, confirmed_at, matched_tran_info, admin_memo) FROM stdin;
    public          postgres    false    224   N�       �          0    29619    main_page_metrics 
   TABLE DATA           �   COPY public.main_page_metrics (metric_id, metric_name, current_value, base_value_for_daily, last_calculated_at, increment_per_hour, increment_per_day_fixed, last_daily_increment_date) FROM stdin;
    public          postgres    false    227   ��       �          0    29434    orders 
   TABLE DATA           �   COPY public.orders (id, user_id, service_id, quantity, link, total_price, order_status, created_at, updated_at, processed_quantity) FROM stdin;
    public          dwight.k    false    209   ��       �          0    29443    point_transactions 
   TABLE DATA           �   COPY public.point_transactions (id, user_id, amount, transaction_type, related_order_id, created_at, balance_after_transaction) FROM stdin;
    public          dwight.k    false    211   D�       �          0    29448    service_categories 
   TABLE DATA           f   COPY public.service_categories (id, name, description, is_active, created_at, updated_at) FROM stdin;
    public          dwight.k    false    213   <�       �          0    29457    service_types 
   TABLE DATA           n   COPY public.service_types (id, category_id, name, description, is_active, created_at, updated_at) FROM stdin;
    public          dwight.k    false    215   �       �          0    29466    services 
   TABLE DATA           �   COPY public.services (id, service_type_id, name, description, price_per_unit, min_order_quantity, max_order_quantity, external_id, is_active, created_at, updated_at, special_id) FROM stdin;
    public          dwight.k    false    217   ��       �          0    29600    specials 
   TABLE DATA           \   COPY public.specials (id, name, description, is_active, created_at, updated_at) FROM stdin;
    public          postgres    false    226   ^�       �          0    29554    user_service_prices 
   TABLE DATA           l   COPY public.user_service_prices (id, user_id, service_id, custom_price, created_at, updated_at) FROM stdin;
    public          postgres    false    222   ɔ       �          0    29475    users 
   TABLE DATA           �   COPY public.users (id, password, email, points, role, created_at, updated_at, name, phone_number, referrer_id, admin_referral_code) FROM stdin;
    public          dwight.k    false    219   9�       �           0    0    deposit_requests_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.deposit_requests_id_seq', 1, true);
          public          postgres    false    223            �           0    0    orders_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.orders_id_seq', 10, true);
          public          dwight.k    false    210            �           0    0    point_transactions_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.point_transactions_id_seq', 10, true);
          public          dwight.k    false    212            �           0    0    service_categories_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.service_categories_id_seq', 8, true);
          public          dwight.k    false    214            �           0    0    service_types_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.service_types_id_seq', 10, true);
          public          dwight.k    false    216            �           0    0    services_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.services_id_seq', 39, true);
          public          dwight.k    false    218            �           0    0    specials_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.specials_id_seq', 3, true);
          public          postgres    false    225            �           0    0    user_service_prices_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.user_service_prices_id_seq', 5, true);
          public          postgres    false    221            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          dwight.k    false    220                       2606    29590 &   deposit_requests deposit_requests_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.deposit_requests
    ADD CONSTRAINT deposit_requests_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.deposit_requests DROP CONSTRAINT deposit_requests_pkey;
       public            postgres    false    224            (           2606    29628 (   main_page_metrics main_page_metrics_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.main_page_metrics
    ADD CONSTRAINT main_page_metrics_pkey PRIMARY KEY (metric_id);
 R   ALTER TABLE ONLY public.main_page_metrics DROP CONSTRAINT main_page_metrics_pkey;
       public            postgres    false    227                       2606    29492    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            dwight.k    false    209                       2606    29494 *   point_transactions point_transactions_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.point_transactions DROP CONSTRAINT point_transactions_pkey;
       public            dwight.k    false    211                       2606    29496 .   service_categories service_categories_name_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_name_key UNIQUE (name);
 X   ALTER TABLE ONLY public.service_categories DROP CONSTRAINT service_categories_name_key;
       public            dwight.k    false    213                       2606    29498 *   service_categories service_categories_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.service_categories DROP CONSTRAINT service_categories_pkey;
       public            dwight.k    false    213            	           2606    29500 0   service_types service_types_category_id_name_key 
   CONSTRAINT     x   ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_name_key UNIQUE (category_id, name);
 Z   ALTER TABLE ONLY public.service_types DROP CONSTRAINT service_types_category_id_name_key;
       public            dwight.k    false    215    215                       2606    29502     service_types service_types_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.service_types DROP CONSTRAINT service_types_pkey;
       public            dwight.k    false    215                       2606    29504    services services_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.services DROP CONSTRAINT services_pkey;
       public            dwight.k    false    217                       2606    29506 *   services services_service_type_id_name_key 
   CONSTRAINT     v   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_name_key UNIQUE (service_type_id, name);
 T   ALTER TABLE ONLY public.services DROP CONSTRAINT services_service_type_id_name_key;
       public            dwight.k    false    217    217            $           2606    29612    specials specials_name_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.specials
    ADD CONSTRAINT specials_name_key UNIQUE (name);
 D   ALTER TABLE ONLY public.specials DROP CONSTRAINT specials_name_key;
       public            postgres    false    226            &           2606    29610    specials specials_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.specials
    ADD CONSTRAINT specials_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.specials DROP CONSTRAINT specials_pkey;
       public            postgres    false    226                       2606    29563 )   user_service_prices uq_user_service_price 
   CONSTRAINT     s   ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT uq_user_service_price UNIQUE (user_id, service_id);
 S   ALTER TABLE ONLY public.user_service_prices DROP CONSTRAINT uq_user_service_price;
       public            postgres    false    222    222            �           0    0 7   CONSTRAINT uq_user_service_price ON user_service_prices    COMMENT     �   COMMENT ON CONSTRAINT uq_user_service_price ON public.user_service_prices IS '사용자 ID와 서비스 ID 조합은 유일해야 함 (한 사용자는 서비스당 하나의 특별 단가만 가짐)';
          public          postgres    false    3611                       2606    29561 ,   user_service_prices user_service_prices_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.user_service_prices DROP CONSTRAINT user_service_prices_pkey;
       public            postgres    false    222                       2606    29552 #   users users_admin_referral_code_key 
   CONSTRAINT     m   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_admin_referral_code_key UNIQUE (admin_referral_code);
 M   ALTER TABLE ONLY public.users DROP CONSTRAINT users_admin_referral_code_key;
       public            dwight.k    false    219                       2606    29508    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            dwight.k    false    219                       2606    29510    users users_phone_number_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_number_key UNIQUE (phone_number);
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_phone_number_key;
       public            dwight.k    false    219                       2606    29512    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            dwight.k    false    219                        1259    29598 !   idx_deposit_requests_requested_at    INDEX     f   CREATE INDEX idx_deposit_requests_requested_at ON public.deposit_requests USING btree (requested_at);
 5   DROP INDEX public.idx_deposit_requests_requested_at;
       public            postgres    false    224            !           1259    29597    idx_deposit_requests_status    INDEX     Z   CREATE INDEX idx_deposit_requests_status ON public.deposit_requests USING btree (status);
 /   DROP INDEX public.idx_deposit_requests_status;
       public            postgres    false    224            "           1259    29596    idx_deposit_requests_user_id    INDEX     \   CREATE INDEX idx_deposit_requests_user_id ON public.deposit_requests USING btree (user_id);
 0   DROP INDEX public.idx_deposit_requests_user_id;
       public            postgres    false    224                       1259    29575 "   idx_user_service_prices_service_id    INDEX     h   CREATE INDEX idx_user_service_prices_service_id ON public.user_service_prices USING btree (service_id);
 6   DROP INDEX public.idx_user_service_prices_service_id;
       public            postgres    false    222                       1259    29574    idx_user_service_prices_user_id    INDEX     b   CREATE INDEX idx_user_service_prices_user_id ON public.user_service_prices USING btree (user_id);
 3   DROP INDEX public.idx_user_service_prices_user_id;
       public            postgres    false    222            4           2620    29577 5   user_service_prices set_timestamp_user_service_prices    TRIGGER     �   CREATE TRIGGER set_timestamp_user_service_prices BEFORE UPDATE ON public.user_service_prices FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
 N   DROP TRIGGER set_timestamp_user_service_prices ON public.user_service_prices;
       public          postgres    false    228    222            3           2606    29591 .   deposit_requests deposit_requests_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.deposit_requests
    ADD CONSTRAINT deposit_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 X   ALTER TABLE ONLY public.deposit_requests DROP CONSTRAINT deposit_requests_user_id_fkey;
       public          postgres    false    3607    219    224            /           2606    29613    services fk_services_specials    FK CONSTRAINT     �   ALTER TABLE ONLY public.services
    ADD CONSTRAINT fk_services_specials FOREIGN KEY (special_id) REFERENCES public.specials(id) ON DELETE SET NULL;
 G   ALTER TABLE ONLY public.services DROP CONSTRAINT fk_services_specials;
       public          dwight.k    false    3622    226    217            )           2606    29513    orders orders_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);
 G   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_service_id_fkey;
       public          dwight.k    false    209    3597    217            *           2606    29518    orders orders_user_id_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public          dwight.k    false    219    3607    209            +           2606    29523 ;   point_transactions point_transactions_related_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_related_order_id_fkey FOREIGN KEY (related_order_id) REFERENCES public.orders(id);
 e   ALTER TABLE ONLY public.point_transactions DROP CONSTRAINT point_transactions_related_order_id_fkey;
       public          dwight.k    false    211    3585    209            ,           2606    29528 2   point_transactions point_transactions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.point_transactions
    ADD CONSTRAINT point_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 \   ALTER TABLE ONLY public.point_transactions DROP CONSTRAINT point_transactions_user_id_fkey;
       public          dwight.k    false    211    3607    219            -           2606    29533 ,   service_types service_types_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id);
 V   ALTER TABLE ONLY public.service_types DROP CONSTRAINT service_types_category_id_fkey;
       public          dwight.k    false    213    3591    215            .           2606    29538 &   services services_service_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_type_id_fkey FOREIGN KEY (service_type_id) REFERENCES public.service_types(id);
 P   ALTER TABLE ONLY public.services DROP CONSTRAINT services_service_type_id_fkey;
       public          dwight.k    false    3595    215    217            2           2606    29569 7   user_service_prices user_service_prices_service_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;
 a   ALTER TABLE ONLY public.user_service_prices DROP CONSTRAINT user_service_prices_service_id_fkey;
       public          postgres    false    3597    222    217            1           2606    29564 4   user_service_prices user_service_prices_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_service_prices
    ADD CONSTRAINT user_service_prices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.user_service_prices DROP CONSTRAINT user_service_prices_user_id_fkey;
       public          postgres    false    3607    222    219            0           2606    29543    users users_referrer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.users DROP CONSTRAINT users_referrer_id_fkey;
       public          dwight.k    false    219    219    3607            �   Y   x�3�4�44 �W;޶���Z�kǛy��vtp��d�s���r�����)ZZ�Y�X�YXZZjXr��AW� ��[      �   �   x���,K���O*�|ӽ�M��WZ�̛��ۙS���o��r��pp����X*X�Z��XjXr¥Mu��J�Ks�K�S��o��������f�7�V��516�o�1��)��9�����9�%�)�o��"�7���ٴV�ͦ���y=����� ӭ�V&Fz& �8�V#�b���� ;U<      �   �   x�����0@��,@���):@/UA��_���R���z�#�)�͚f^�yZ�d��ͺ�!�>�\�ex.`�Pc�I+fc5�>��j	���>�s!��H ?�L��9�騄��i���go(з�Z�BG��Tzk�om��5ƽ��!�%���s/��Of      �   �   x���Kj1�|���=,[�!r��00Y����颷�<���B^�O�o1̊��v�N����u>]nP��uF��&��֥�j&f��'����D�K,�B*��**����t�\���P
a��/�㺽~~�v�~�LT�R'���A!�TG?z��ef�V��{jA���23���Ӓ�����1�N�C���j<���19����$mcG�ʹ
V�ݤ�_��3��B�%���7_rJ�AD|L      �   �   x�}�A�0D��)z iZ�R�^@��Ј�A]HBM\�p��D?�G�l�M�MfF"8�]����Ԧ�s�;S�@6��Ŕ�]�=_
_*�<�]=���~ey#�Wm��:&3Ҽf���@&.;HBȎ�>?�,�m:ڂp�+�g�Jǵ5����J ]A���g��Qʹ�|�b����Y�      �   �  x��S[N�0��W���v��
��TC��&��i*��0�Z)4C�XM?{�5�B[�B�
$�l��sϹ�W����q�pX`sl�ꋇF�:ì��g��)9:$�Dr��:>�<t��斔\��,K|������_�*�}���IR��x��
�[��)��8�mh��A��sh�#�Q�G�7 [[��`���r���j՛��H:��^�K0֐?�e{��a�0Ӌ�?���j��_Ҩ�kE�����I��S��l
y��ff	6z{�^���*��[��6B:�/I?9'��R��s��2fzV���6����U��>¬�L_���4^}x A�%�
��no�w�J:3ME�v�����C�ܶח��Q��O�O�J���g��f[��'�@�Ȣ�>��×      �   �  x��X�RG>/O1G� i�w��K���+�$WL�o)	�YZ�0��k#�p��F,���Q3[�ҽ�Z�,�����
���t�����$�cl�X!KL7iW�V+��e�����F��7eV��^�|��"��P�<�>d�-�S`��󲸼�4kh�H˭��*<��'�!o��
�U�6��i��M�H��IX�N�:�=ߠ����zܢ�"I�((r�8{��ِ�,���/Y#{��� �ǶS����uP`�76H�o����ֆ/��۬h��l ێ ����S�ӓ]���n���S �ˊ}����֗W?o�D�����F���`!��n�����,�����'�gY�F��e�4�b�|���J�n�L�f�:=4\��랂t������ʘs��Ю���p<�	��\�ĩ�hy@���Z�t��q��uh3��u�K;C�[dY?d���61cU�a �Z��a@-8��w��)�g����G�IFg:�j��X�H+'�(GR�}mB4:5`�C���rv����ɫ��oR�����bg_l��c말�����Hod��6`&�yQ��]7z�����A׿kӭ
�n��U�>A��з!9���1	�[�@Xk���?�����-��Lo�wB��Y+˟>7����!�<q��m&�7h���;�!�z�*�6��8g�KY7W]&s�H���,x6�Yn\���`�7���餍��DAMė����&Ȣ�-�ڢ�"��Q�E�ɲ����H	~�1MMh�4�S��вW��W�|_��ύ�?�MAPb"" d�H����H2 M�U)j	@h �+�W��z���A 墫�e`J݉0�X���d�nY�Hb;6��fA}�NQ~P=$��@�w�r�:;�@b� Q��+�� �	�+yE��D�%n�%4Q�΄��b۷�J�f�%���_�B�N�Z���-��3uZ�s�f�\�%��ZuBP�%8���<.��v�*v��<h��W��X�3�S58��%T�D��3���ry����c@�� �iէ\��,D9�_>��p�H�3���8��g:�,�̂�,t�ۣ~V a�n?L�Z�UӦI7Z��ꤐ$-U��p%O�y�טr3N�������ұ��N���%đ�W�>�i�L�fzK��w΅�'yqNH:#�ت%�D*!G-!�t�@ 1�([Y��y�ǼS�!(�����N̫K,��"8�[q:����)��8,���	��H��
����3�-Gzi�+�f�Z�Z���~ �V	� qk�����lpX��ѣ�8+���_L�)r��h�瞺<x�!�DY t Kp��q�H�f�,7���ɻ|ͤ��sP��[�|p��Nn�gJ�d¯'��D	F͔ڕ�e��RR�]c�L#0.�Wn�N�9h�{m;{+��t-<�>}�~p���z7AN���K}A7=���"I�hjFL������%�)2�j2�28��������N�ιC����8o�ǆ�z w"T���ME�.*��^�����Y[{�4�?{�,���ӵG?���q��ǟ����S7�||��í*pb���4�3i`�؅9����8����sr�yw�Q'�n�d4)�&EMKa�Z�����s�$      �   [   x�3�|�iśY;^/��f���=+�6-y����mkϛ�%o�vp�p����(Y[Z�뙛X�I����,,-,L�b���� 8�!g      �   `   x�}̱�0���"�a��$EI�x�9�tvb�>���pH� !�;r��Z��n�U��Ր.l�����n^9����<|?��	ʽ��sU=LUO� (�      �   �  x�}��n�@���)X��͝{ƫ8$��
������!^g[uU�y�.�L��u��iUq5��#�>]��tVR��l�Xh,0��7�L�st/1\y�`�G�~s�<b}\4wy/>�0]�� ���4�x��A�C�E�PQ#�FY����a�J�S�ۏo?���f蓤@!�	��z���v5v{�3����q��e�pn�0N#^������͇�y����x �u����?�9��~|�:ʀU(����b.�ԩ�F��5aHYST�8(�B����|{z�q���lq?o\k�ԍ�;�t���e	��g�mh�i����
���/T@����a!��T����������*�8�~PB��䭆3�w���w��73H�Vq����vH��֖��wjt�v|����R�=�L�K(v"96��:��ڱ]��]m�5M�*Z��     