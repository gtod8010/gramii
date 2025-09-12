# 개발 가이드 & 규칙

## 🚀 개발 환경 설정

### 필수 요구사항
- **Node.js**: 20.x 이상
- **PostgreSQL**: 14.x 이상
- **npm**: 최신 버전

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev:gramii    # 그래미 (포트 3000)
npm run dev:orda      # 오르다 (포트 3001)

# 프로덕션 빌드
npm run build:gramii
npm run build:orda
```

## 📁 디렉토리 구조 규칙

### 코드 구조
```
src/
├── app/
│   ├── (admin)/          # 관리자 페이지
│   ├── (full-width-pages)/ # 풀 너비 페이지
│   ├── api/              # API 라우트
│   └── services/         # 일반 사용자 페이지
├── components/           # 재사용 가능한 컴포넌트
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 함수
└── layout/              # 레이아웃 컴포넌트
```

### 파일 네이밍
- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **API 라우트**: kebab-case (예: `sync-services/route.ts`)
- **페이지**: lowercase (예: `page.tsx`)
- **유틸리티**: camelCase (예: `getUserInfo.ts`)

## 🎯 코딩 스타일

### TypeScript 규칙
- 모든 컴포넌트와 함수에 타입 정의 필수
- `interface`를 활용한 명확한 데이터 구조 정의
- `any` 사용 금지 (불가피한 경우 주석으로 이유 명시)

### React 컴포넌트 규칙
- 함수형 컴포넌트 사용
- Server Component를 기본으로, 클라이언트 상호작용이 필요한 경우만 "use client"
- 프롭스 destructuring 사용

### API 설계 규칙
- REST 방식 준수
- HTTP 상태 코드 적절히 사용
- 에러 응답 형태 통일:
  ```json
  { "error": "에러 메시지" }
  ```
- 성공 응답은 데이터 직접 반환

## 🔒 보안 규칙

### 인증 및 권한
- JWT 토큰 기반 인증
- API 라우트에서 권한 검사 필수
- 민감한 정보는 환경변수로 관리

### 데이터베이스 접근
- SQL 인젝션 방지를 위한 파라미터화된 쿼리 사용
- 트랜잭션 적극 활용
- 커넥션 풀 사용으로 리소스 관리

## 🎨 UI/UX 가이드라인

### Tailwind CSS 사용법
- 유틸리티 클래스 우선 사용
- 커스텀 컴포넌트는 `@apply` 활용
- 반응형 디자인 고려 (모바일 퍼스트)

### 컴포넌트 설계
- 재사용 가능하도록 설계
- 단일 책임 원칙 준수
- 프롭스 인터페이스 명확히 정의

## 🧪 테스팅 규칙

### API 테스트
- Postman/Insomnia로 API 엔드포인트 테스트
- 각 API의 성공/실패 시나리오 확인

### 코드 품질
- ESLint 규칙 준수
- Prettier를 통한 코드 포맷팅
- 의미있는 변수명과 함수명 사용

## 🔄 Git 워크플로우

### 브랜치 전략
- `main`: 프로덕션 배포용
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치

### 커밋 메시지 규칙
- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 스타일 변경
- `refactor:` 코드 리팩토링
- `test:` 테스트 코드 추가/수정

## 📊 성능 최적화

### Next.js 최적화
- 이미지 최적화 (`next/image` 사용)
- 코드 분할 (Dynamic Imports)
- 서버 사이드 렌더링 활용

### 데이터베이스 최적화
- 적절한 인덱스 설정
- 쿼리 최적화
- 커넥션 풀 관리
