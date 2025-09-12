# 외부 API 연동 가이드

## 🔗 연동된 외부 서비스

### 1. RealSite API
**주요 서비스 제공업체**
- **목적**: 주요 소셜미디어 마케팅 서비스 제공
- **API 문서**: https://realsite.shop/docs
- **지원 플랫폼**: Instagram, YouTube, TikTok, Facebook 등

#### 설정 정보
```bash
REALSITE_API_KEY_GRAMII="API 키"
REALSITE_API_KEY_ORDA="API 키" 
REALSITE_API_URL="https://realsite.shop/api/v2"
```

#### API 호출 예시
```typescript
const response = await fetch(process.env.REALSITE_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    key: process.env.REALSITE_API_KEY_GRAMII,
    action: 'services' // 또는 'add', 'status' 등
  })
});
```

#### 주요 액션
- `services`: 서비스 목록 조회
- `add`: 주문 추가
- `status`: 주문 상태 조회

### 2. 2PM API
**보조 서비스 제공업체**
- **목적**: 추가 서비스 다양성 제공
- **특징**: 고급 서비스, 틈새 시장 대상

#### 설정 정보
```bash
TWOPM_API_KEY="API 키"
TWOPM_API_URL="https://2pm.co.kr/api/v2"
```

#### 서비스 ID 오프셋
- 2PM 서비스는 내부적으로 `external_id + 20000`으로 관리
- 충돌 방지를 위한 ID 체계

### 3. InstaMonster API  
**인스타그램 특화 서비스**
- **목적**: 인스타그램 전용 프리미엄 서비스
- **특화 서비스**: 추천탭 상위노출, 한국인 팔로워 등

#### 설정 정보
```bash
INSTAMONSTER_API_KEY="API 키"
INSTAMONSTER_API_URL="https://instamonster.co.kr/api/v2"
```

#### 특화 카테고리
```typescript
const targetCategoryNames = [
  '인스타그램 리그램 상위노출 패키지 📈',
  '인스타그램 추천탭 셀프 상위노출 ⭐',
  '인스타그램 추천탭 동영상 작업 🚀',
  '인스타그램 한국인 팔로워 👩‍🚀'
];
```

#### 서비스 ID 오프셋
- InstaMonster 서비스는 `external_id + 40000`으로 관리

## 🔄 동기화 프로세스

### 서비스 동기화 흐름
1. **외부 API 호출** → 서비스 목록 조회
2. **realsite_services 테이블** → 서비스 정보 저장/업데이트
3. **관리자 검토** → 필요한 서비스 선별
4. **services 테이블** → 실제 판매 서비스로 등록

### 동기화 API 엔드포인트
```typescript
// RealSite 서비스 동기화
POST /api/realsite/sync-services

// 2PM 서비스 동기화  
POST /api/2pm/sync-services

// InstaMonster 서비스 동기화
POST /api/instamonster/sync-services
```

### 자동 비활성화 로직
외부 벤더에서 사라진 서비스는 자동으로 `is_active = false`로 설정

## 💰 가격 체계 변환

### RealSite 가격 변환
- API 응답: `1000개당 가격`
- 내부 저장: `개당 가격`
```typescript
const unitPrice = apiRate / 1000;
```

### 2PM 가격 변환
- API 응답: `1000개당 가격`  
- 내부 저장: `개당 가격`
```typescript  
const unitPrice = apiRate / 1000;
```

### InstaMonster 가격 변환
- API 응답: `1000개당 가격`
- 내부 저장: `개당 가격`
```typescript
const unitPrice = apiRate / 1000;
```

## 🛒 주문 처리 플로우

### 주문 생성 프로세스
1. **사용자 주문** → 내부 orders 테이블 저장
2. **서비스 정보 조회** → services.external_id로 외부 벤더 식별
3. **외부 API 호출** → 실제 주문 전송
4. **응답 처리** → 주문 상태 업데이트

### 외부 벤더별 주문 페이로드
```typescript
interface ExternalApiPayload {
  key: string;
  action: 'add';
  service: string;  // external_id
  link: string;
  quantity: number;
  comments?: string;
}
```

## 🔍 상태 동기화

### 주문 상태 매핑
```typescript
const statusMapping = {
  'Pending': 'pending',
  'In progress': 'in_progress', 
  'Completed': 'completed',
  'Canceled': 'cancelled'
};
```

### 정기 상태 동기화
- **API**: `GET /api/orders/sync-status`
- **주기**: 필요에 따라 수동 또는 cron job 설정
- **처리**: 외부 벤더 상태를 내부 DB와 동기화

## 🚨 에러 처리

### API 호출 실패 처리
```typescript
try {
  const response = await fetch(apiUrl, options);
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API 통신 오류: ${response.status} ${errorBody}`);
  }
  
  const data = await response.json();
  return data;
  
} catch (error) {
  console.error('External API Error:', error);
  // 에러 로깅 및 알림 처리
}
```

### 재시도 로직
- 네트워크 오류 시 자동 재시도 (최대 3회)
- 지수 백오프 적용
- 실패 시 관리자 알림

## 📊 모니터링

### API 호출 로그
- 모든 외부 API 호출은 콘솔 로그 기록
- 응답 시간 및 상태 코드 추적
- 에러 발생 시 상세 로그

### 서비스 동기화 결과
```json
{
  "message": "동기화 완료",
  "total_services_from_api": 150,
  "filtered_services_to_sync": 25,
  "processed_services": 25,
  "deactivated_missing_on_vendor": 3,
  "synced_services": [...]
}
```

## 🔐 보안 고려사항

### API 키 관리
- 환경변수로 관리
- 정기적인 키 로테이션
- 키 노출 모니터링

### 요청 제한
- Rate limiting 적용
- API 사용량 모니터링
- 비정상적 호출 패턴 감지

## 🧪 테스트 환경

### API 테스트
```bash
# RealSite 서비스 목록 조회 테스트
curl -X POST https://realsite.shop/api/v2 \
  -H "Content-Type: application/json" \
  -d '{"key":"YOUR_API_KEY","action":"services"}'

# 주문 테스트
curl -X POST https://realsite.shop/api/v2 \
  -H "Content-Type: application/json" \
  -d '{"key":"YOUR_API_KEY","action":"add","service":"123","link":"https://instagram.com/post","quantity":1000}'
```

### Mock API 서버
개발 환경에서는 Mock API 서버를 구축하여 외부 의존성 없이 테스트 가능

## 📈 성능 최적화

### 캐싱 전략
- 서비스 목록은 일정 시간 캐싱
- 자주 변경되지 않는 데이터는 Redis 활용

### 배치 처리
- 대량 주문 시 배치 처리로 API 호출 최적화
- 큐 시스템 도입 고려
