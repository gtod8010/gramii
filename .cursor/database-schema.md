# 데이터베이스 스키마

## 📊 개요
PostgreSQL을 사용하며, gramii_db와 orda_db로 브랜드별 독립적인 데이터베이스를 운영합니다.

## 🏗️ 핵심 테이블

### 사용자 관리

#### `users` - 사용자 정보
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    username VARCHAR(255),
    points INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'user',
    referrer_id INTEGER,
    admin_referral_code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**주요 필드:**
- `role`: 'user' | 'admin'
- `points`: 사용자 포인트 잔액
- `referrer_id`: 추천인 ID
- `admin_referral_code`: 관리자 추천 코드

### 서비스 관리

#### `service_categories` - 서비스 카테고리
```sql
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0
);
```

#### `service_types` - 서비스 타입
```sql
CREATE TABLE service_types (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES service_categories(id),
    name VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0
);
```

#### `services` - 실제 판매 서비스
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_type_id INTEGER REFERENCES service_types(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_order_quantity INTEGER NOT NULL,
    max_order_quantity INTEGER NOT NULL,
    price_per_unit NUMERIC(10,2) NOT NULL,
    external_id VARCHAR(255),      -- 외부 벤더 서비스 ID
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

#### `realsite_services` - 외부 벤더 서비스 동기화
```sql
CREATE TABLE realsite_services (
    id SERIAL PRIMARY KEY,
    realsite_service_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(255),
    rate NUMERIC(20, 6) NOT NULL,
    min_order INTEGER NOT NULL,
    max_order INTEGER NOT NULL,
    dripfeed BOOLEAN DEFAULT FALSE,
    refill BOOLEAN DEFAULT FALSE,
    cancel BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 주문 관리

#### `orders` - 주문 정보
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    quantity INTEGER NOT NULL,
    link VARCHAR(2048),
    total_price NUMERIC(10,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    processed_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**주문 상태:**
- `pending`: 대기중
- `in_progress`: 처리중
- `completed`: 완료
- `cancelled`: 취소됨

#### `point_transactions` - 포인트 거래 내역
```sql
CREATE TABLE point_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    related_order_id INTEGER REFERENCES orders(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**거래 타입:**
- `charge`: 충전
- `purchase`: 구매 (차감)
- `refund`: 환불
- `bonus`: 보너스 지급

### 관리자 기능

#### `deposit_requests` - 충전 요청 (오르다 전용)
```sql
CREATE TABLE deposit_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount INTEGER NOT NULL,
    depositor_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    receipt_type VARCHAR(50) DEFAULT 'none',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    receipt_info JSONB,
    admin_memo TEXT,
    account_number VARCHAR(255),
    is_tax_invoice_processed BOOLEAN DEFAULT FALSE
);
```

#### `user_service_prices` - 사용자별 맞춤 가격
```sql
CREATE TABLE user_service_prices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    custom_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_id)
);
```

### 통계 및 로그

#### `visitor_daily_fingerprints` - 방문자 통계
```sql
CREATE TABLE visitor_daily_fingerprints (
    id SERIAL PRIMARY KEY,
    fingerprint VARCHAR(255) NOT NULL,
    visit_date DATE NOT NULL,
    first_visit_time TIMESTAMPTZ DEFAULT NOW(),
    last_visit_time TIMESTAMPTZ DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    UNIQUE(fingerprint, visit_date)
);
```

#### `main_page_metrics` - 메인 페이지 지표
```sql
CREATE TABLE main_page_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(255) NOT NULL,
    metric_value BIGINT NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

#### `sms_logs` - SMS 로그
```sql
CREATE TABLE sms_logs (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    message_body TEXT NOT NULL,
    sender VARCHAR(50),
    received_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'received'
);
```

## 🔗 외부 벤더 ID 매핑

### 서비스 ID 오프셋
- **RealSite**: `external_id` 그대로
- **2PM**: `external_id + 20000`
- **InstaMonster**: `external_id + 40000`

### 동기화 프로세스
1. 외부 API에서 서비스 목록 조회
2. `realsite_services` 테이블에 저장/업데이트
3. 관리자가 필요한 서비스를 `services` 테이블에 수동 등록
4. `services.external_id`로 외부 API 호출 시 사용

## 📈 인덱스 전략
- 자주 조회되는 컬럼에 인덱스 설정
- `users.email`, `orders.user_id`, `services.external_id` 등
- 외래키 제약조건으로 자동 생성되는 인덱스 활용
