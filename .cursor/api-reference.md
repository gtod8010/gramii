# API 레퍼런스

## 🔗 Base URL
- **개발환경**: `http://localhost:3000` (gramii), `http://localhost:3001` (orda)
- **인증방식**: JWT Bearer Token

## 🔐 인증 API

### POST `/api/auth`
사용자 로그인
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "사용자명",
    "role": "user"
  }
}
```

### POST `/api/register`
사용자 회원가입
```json
// Request
{
  "email": "user@example.com", 
  "password": "password123",
  "name": "사용자명",
  "phone_number": "010-1234-5678"
}
```

## 👤 사용자 API

### GET `/api/users`
사용자 목록 조회 (관리자 전용)

### GET `/api/users/[id]`
특정 사용자 정보 조회
- **인증**: 본인 또는 관리자만 접근 가능

### PUT `/api/users/[id]/change-password`
비밀번호 변경

### GET `/api/users/[id]/point-transactions`
포인트 거래 내역 조회

### POST `/api/users/[id]/points`
포인트 충전/차감 (관리자 전용)

## 📦 서비스 관리 API

### GET `/api/services`
서비스 목록 조회
**Query Parameters:**
- `serviceTypeId`: 서비스 타입 ID로 필터링
- `limit`: 결과 개수 제한

```json
// Response
[
  {
    "id": 1,
    "name": "인스타그램 팔로워",
    "description": "고품질 팔로워 제공",
    "price_per_unit": 1.5,
    "min_order_quantity": 100,
    "max_order_quantity": 10000,
    "service_type_name": "팔로워",
    "category_name": "인스타그램",
    "custom_price": null,
    "realsite_rate": 1.2
  }
]
```

### POST `/api/services`
서비스 등록 (관리자 전용)
```json
// Request
{
  "category_id": 1,
  "service_type_id": 1,
  "name": "인스타그램 팔로워",
  "min_order_quantity": 100,
  "max_order_quantity": 10000,
  "price_per_unit": 1.5,
  "description": "설명",
  "external_id": "123"
}
```

### GET `/api/services/[id]`
특정 서비스 상세 조회

### PUT `/api/services/[id]`
서비스 정보 수정 (관리자 전용)

## 📋 카테고리 & 서비스 타입 API

### GET `/api/categories`
서비스 카테고리 목록 조회
```json
// Response
[
  {
    "id": 1,
    "name": "인스타그램",
    "display_order": 1
  }
]
```

### POST `/api/categories`
카테고리 등록 (관리자 전용)

### GET `/api/service-types`
서비스 타입 목록 조회
**Query Parameters:**
- `categoryId`: 특정 카테고리의 서비스 타입만 조회

### POST `/api/service-types`
서비스 타입 등록 (관리자 전용)

## 🛒 주문 API

### POST `/api/orders`
주문 생성
```json
// Request
{
  "userId": 1,
  "serviceId": 123,
  "quantity": 1000,
  "requestDetails": "https://instagram.com/profile",
  "comments": "빠른 처리 부탁합니다"
}

// Response
{
  "orderId": 456,
  "message": "주문이 성공적으로 처리되었습니다."
}
```

### GET `/api/orders/sync-status`
주문 상태 동기화 (외부 벤더와)

## 💰 포인트 & 결제 API

### POST `/api/recharge-requests`
포인트 충전 요청
```json
// Request
{
  "userId": 1,
  "amount": 10000,
  "depositorName": "예금주명",
  "receiptType": "business"
}
```

### GET `/api/recharge-management`
충전 요청 관리 (관리자 전용)

### PUT `/api/recharge-management/[id]/manual-complete`
충전 요청 수동 승인 (관리자 전용)

## 🔄 외부 벤더 동기화 API

### POST `/api/realsite/sync-services`
RealSite 서비스 동기화
- **용도**: RealSite API에서 서비스 목록을 가져와 `realsite_services` 테이블 업데이트

### POST `/api/2pm/sync-services`
2PM 서비스 동기화

### POST `/api/instamonster/sync-services`
InstaMonster 서비스 동기화

### GET `/api/realsite-services`
동기화된 외부 서비스 목록 조회
```json
// Response
[
  {
    "id": 1,
    "realsite_service_id": 123,
    "name": "Instagram Followers",
    "rate": 1.5,
    "min_order": 100,
    "max_order": 10000,
    "last_synced_at": "2025-01-15T10:30:00Z"
  }
]
```

## 📊 관리자 대시보드 API

### GET `/api/dashboard-summary`
대시보드 요약 정보
```json
// Response
{
  "totalUsers": 1250,
  "totalOrders": 8450,
  "totalRevenue": 15000000,
  "pendingOrders": 25
}
```

### GET `/api/settlement/summary`
정산 요약

### GET `/api/settlement/monthly-breakdown`
월별 정산 내역

### GET `/api/settlement/vendor-breakdown`
벤더별 정산 내역

## 📱 SMS 관련 API

### POST `/api/sms-incoming`
SMS 수신 처리 (Android 앱에서 호출)

### GET `/api/sms-logs`
SMS 로그 조회 (관리자 전용)

### GET `/api/sms-events`
SMS 이벤트 조회

## 📈 통계 API

### GET `/api/main-metrics`
메인 페이지 지표 조회

### POST `/api/track-visit`
방문자 추적
```json
// Request
{
  "fingerprint": "unique_visitor_id"
}
```

## ❌ 에러 응답 형식
```json
{
  "error": "에러 메시지"
}
```

## 📝 공통 HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `500`: 서버 오류
