# Gramii / Orda Service

소셜미디어 마케팅 서비스 플랫폼입니다. 하나의 코드베이스로 두 개의 브랜드(Gramii, Orda)를 운영합니다.

## 기술 스택

- **Framework**: Next.js 15.2 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Database**: PostgreSQL 14+
- **Authentication**: JWT + bcrypt
- **External APIs**: RealSite, 2PM, InstaMonster

## 프로젝트 구조

```
src/
├── app/
│   ├── (admin)/            # 관리자 페이지
│   ├── (full-width-pages)/ # 로그인, 회원가입
│   └── api/                # API 라우트
├── components/             # React 컴포넌트
├── context/                # React Context
├── hooks/                  # Custom Hooks
├── lib/                    # 유틸리티
└── icons/                  # SVG 아이콘

android-sms-forwarder/      # Gramii SMS 포워더 앱
orda-sms-forwarder/         # Orda SMS 포워더 앱
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 수정
```

### 3. 데이터베이스 설정

PostgreSQL에서 데이터베이스 생성:

```sql
CREATE DATABASE gramii_db;
CREATE DATABASE orda_db;
```

### 4. 개발 서버 실행

```bash
# Gramii (포트 3000)
npm run dev:gramii

# Orda (포트 3001)
npm run dev:orda
```

### 5. 프로덕션 빌드

```bash
# 빌드
npm run build:gramii
npm run build:orda

# PM2로 실행
pm2 start ecosystem.config.js
```

## 주요 API 엔드포인트

| 엔드포인트 | 설명 |
|------------|------|
| `POST /api/auth` | 로그인 |
| `POST /api/register` | 회원가입 |
| `GET /api/services` | 서비스 목록 |
| `POST /api/orders` | 주문 생성 |
| `GET /api/users` | 사용자 목록 (관리자) |

## 환경변수

`.env.example` 파일을 참고하세요. 실제 값은 Slack 채널 정보탭에서 확인할 수 있습니다.

## PM2 명령어

```bash
pm2 list                  # 프로세스 목록
pm2 logs gramii           # Gramii 로그
pm2 logs orda             # Orda 로그
pm2 restart all           # 전체 재시작
pm2 monit                 # 실시간 모니터링
```

## Android SMS Forwarder

SMS 자동 포워딩 앱입니다. Android Studio에서 빌드하세요.

```bash
cd android-sms-forwarder  # 또는 orda-sms-forwarder
./gradlew assembleDebug
```
