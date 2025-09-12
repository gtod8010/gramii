# 환경 설정 가이드

## 🔧 환경변수 설정

### `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 설정하세요:

```bash
# --- 공통 설정 ---
APP_ENV="development"

# --- 데이터베이스 설정 ---
# gramii 서비스 전용 DB
POSTGRES_URL_GRAMII="postgresql://사용자명:비밀번호@localhost:5432/gramii_db"

# orda 서비스 전용 DB  
POSTGRES_URL_ORDA="postgresql://사용자명:비밀번호@localhost:5432/orda_db"

# --- 인증 설정 ---
JWT_SECRET="your-jwt-secret-key-here"

# --- 외부 API 설정 ---
# RealSite API
REALSITE_API_KEY_GRAMII="your-realsite-gramii-key"
REALSITE_API_KEY_ORDA="your-realsite-orda-key"
REALSITE_API_URL="https://realsite.shop/api/v2"

# 2PM API
TWOPM_API_KEY="your-2pm-api-key"
TWOPM_API_URL="https://2pm.co.kr/api/v2"

# InstaMonster API
INSTAMONSTER_API_KEY="your-instamonster-api-key"
INSTAMONSTER_API_URL="https://instamonster.co.kr/api/v2"
```

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 (macOS)
```bash
# Homebrew로 설치
brew install postgresql@14
brew services start postgresql@14

# 데이터베이스 생성
createdb gramii_db
createdb orda_db
```

### PostgreSQL 설치 (Windows)
1. PostgreSQL 공식 사이트에서 설치 파일 다운로드
2. 설치 후 pgAdmin으로 데이터베이스 생성

### 초기 데이터 Import
```bash
# gramii 데이터베이스 초기화
psql -d gramii_db -f dump_gramii_latest.sql

# orda 데이터베이스 초기화  
psql -d orda_db -f orda_dump.sql
```

## 🚀 개발 환경 실행

### 1. 의존성 설치
```bash
npm install

# peer dependency 에러 발생시
npm install --legacy-peer-deps
```

### 2. 개발 서버 실행
```bash
# gramii 서비스 (포트 3000)
npm run dev:gramii

# orda 서비스 (포트 3001) 
npm run dev:orda
```

### 3. 접속 확인
- gramii: http://localhost:3000
- orda: http://localhost:3001

## 🏗️ 프로덕션 배포

### PM2를 이용한 배포
```bash
# 빌드
npm run build:gramii
npm run build:orda

# PM2로 실행
pm2 start ecosystem.config.js

# 상태 확인
pm2 status
pm2 logs
```

### Docker를 이용한 배포 (옵션)
```dockerfile
# Dockerfile 예시
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build:gramii
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 보안 설정

### JWT Secret 생성
```bash
# 강력한 JWT secret 생성
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 환경변수 보안
- `.env.local` 파일은 절대 Git에 커밋하지 않기
- 프로덕션에서는 환경변수를 별도 관리

## 🧪 테스트 환경 설정

### API 테스트용 도구
- **Postman** 또는 **Insomnia** 설치
- API 컬렉션 import하여 테스트

### 데이터베이스 GUI 도구
- **Beekeeper Studio** (추천)
- **pgAdmin**
- **DBeaver**

## 📱 Android 앱 설정 (SMS Forwarder)

### 개발 환경
```bash
cd android-sms-forwarder
# 또는
cd orda-sms-forwarder

# 빌드
./gradlew assembleDebug
```

### 앱 설정
1. 앱 설치 후 권한 허용 (SMS 읽기, 인터넷)
2. 서버 URL 설정
3. 포워딩 룰 설정

## 🔧 IDE 설정 (VS Code 권장)

### 필수 확장 프로그램
- **TypeScript** 지원
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier**
- **ESLint**

### VS Code 설정 (`.vscode/settings.json`)
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 🐛 트러블슈팅

### 자주 발생하는 문제들

1. **포트 충돌**
   ```bash
   # 포트 사용 중인 프로세스 확인
   lsof -i :3000
   lsof -i :3001
   ```

2. **데이터베이스 연결 오류**
   - PostgreSQL 서비스 실행 상태 확인
   - 환경변수 설정 재확인
   - 방화벽 설정 확인

3. **빌드 오류**
   ```bash
   # node_modules 삭제 후 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **API 호출 오류**
   - CORS 설정 확인
   - API 키 유효성 확인
   - 네트워크 연결 상태 확인

### 로그 확인 방법
```bash
# 개발 서버 로그
npm run dev:gramii  # 콘솔에서 실시간 확인

# PM2 로그
pm2 logs gramii
pm2 logs orda

# 데이터베이스 로그
tail -f /usr/local/var/log/postgresql@14/postgres.log
```
