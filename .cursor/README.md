# 그래미서비스 프로젝트 설정 가이드

이 폴더에는 그래미서비스 프로젝트와 관련된 모든 설정 정보와 가이드가 담겨 있습니다.  
LLM 모델과의 대화 시 이 문서들을 참조하여 프로젝트에 대한 빠른 이해가 가능합니다.

## 📁 문서 구조

### 1. [project-overview.md](./project-overview.md)
**프로젝트 전체 개요**
- 🎯 서비스 소개 및 목적
- 🏗️ 기술 스택 정보
- 🚀 멀티 사이트 지원 구조
- 📋 핵심 기능 요약

### 2. [development-guide.md](./development-guide.md)  
**개발 가이드 & 코딩 규칙**
- 🚀 개발 환경 설정 방법
- 📁 디렉토리 구조 및 네이밍 규칙
- 🎯 TypeScript/React 코딩 스타일
- 🔒 보안 규칙 및 베스트 프랙티스

### 3. [database-schema.md](./database-schema.md)
**데이터베이스 스키마 정보**
- 📊 전체 테이블 구조
- 🏗️ 테이블별 상세 스키마
- 🔗 외부 벤더 ID 매핑 규칙
- 📈 인덱스 전략

### 4. [api-reference.md](./api-reference.md)
**API 엔드포인트 레퍼런스**  
- 🔐 인증 API
- 👤 사용자 관리 API
- 📦 서비스 관리 API
- 🛒 주문 처리 API
- 🔄 외부 벤더 동기화 API

### 5. [environment-setup.md](./environment-setup.md)
**환경 설정 상세 가이드**
- 🔧 환경변수 설정 (.env.local)
- 🗄️ PostgreSQL 데이터베이스 설정
- 🚀 개발/프로덕션 환경 실행 방법
- 🐛 트러블슈팅 가이드

### 6. [external-integrations.md](./external-integrations.md)
**외부 API 연동 가이드**
- 🔗 RealSite/2PM/InstaMonster API 연동
- 🔄 서비스 동기화 프로세스  
- 💰 가격 체계 변환 로직
- 🛒 주문 처리 플로우

## 🚀 빠른 시작 가이드

### 새로운 개발자를 위한 체크리스트
1. **[environment-setup.md](./environment-setup.md)** → 개발 환경 구축
2. **[project-overview.md](./project-overview.md)** → 프로젝트 전체 이해  
3. **[development-guide.md](./development-guide.md)** → 개발 규칙 숙지
4. **[database-schema.md](./database-schema.md)** → DB 구조 파악
5. **[api-reference.md](./api-reference.md)** → API 사용법 학습

### 기존 개발자를 위한 참조 가이드
- 🔍 **기능 추가 시**: api-reference.md, database-schema.md
- 🐛 **버그 수정 시**: development-guide.md, external-integrations.md  
- 🔧 **환경 문제 시**: environment-setup.md
- 📊 **DB 변경 시**: database-schema.md

## 💡 문서 활용 팁

### LLM과 대화할 때
1. 특정 기능에 대해 질문하기 전에 해당 문서를 먼저 참조
2. 에러 발생 시 관련 문서의 트러블슈팅 섹션 확인
3. 새로운 기능 개발 시 기존 패턴과 규칙 준수

### 문서 업데이트
- 새로운 기능 추가 시 관련 문서도 함께 업데이트
- API 변경 시 api-reference.md 수정 필수
- 데이터베이스 스키마 변경 시 database-schema.md 업데이트

## 📞 문의 및 지원

프로젝트 관련 문의나 문서 개선 제안이 있으시면 언제든지 연락주세요.

---

**생성일**: 2025년 1월 15일  
**최종 업데이트**: 2025년 1월 15일  
**버전**: 1.0.0
