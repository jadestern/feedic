# 📰 Feedic

> 한국어 RSS 리더 웹 애플리케이션

Feedic은 Vanilla JavaScript로 구축된 클라이언트 사이드 RSS 리더입니다. IndexedDB를 사용한 로컬 데이터 저장과 CORS 프록시를 통한 RSS 피드 가져오기를 지원합니다.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/jadestern/feedic/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ 주요 기능

- 📱 **완전한 반응형 디자인**: 모바일과 데스크톱 모두 최적화
- ⭐ **북마크 시스템**: 중요한 기사를 즐겨찾기로 저장
- 🔍 **전체 화면 검색**: 제목과 내용을 통한 스마트 검색
- 🕒 **상대적 시간 표시**: "3일 전", "1주 전" 등 직관적 시간 표시
- 🧹 **자동 정리**: 7일 이상 된 기사 자동 삭제 (북마크는 영구 보존)
- ⌨️ **키보드 단축키**: 완전한 키보드 네비게이션 지원
- 🌙 **다크 모드**: 시스템 설정 자동 감지
- 📱 **PWA 지원**: 오프라인에서도 사용 가능
- 🚀 **빌드 프로세스 불필요**: HTML 파일 하나로 완성

## 🚀 빠른 시작

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/jade-kim/feedic.git
cd feedic

# 의존성 설치 (개발용)
pnpm install

# 개발 서버 실행
pnpm run dev

# 또는 간단한 정적 서버
python -m http.server 8000
# 또는
npx serve .
```

브라우저에서 `http://localhost:8000`에서 애플리케이션에 접근할 수 있습니다.

### RSS 피드 추가

1. 사이드바의 "+" 버튼 클릭
2. RSS/Atom 피드 URL 입력
3. 피드가 자동으로 파싱되고 기사 목록에 표시됩니다

## 🏗️ 기술 스택

- **Frontend**: Vanilla JavaScript (ES6+)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/) (CDN)
- **컴포넌트**: [Shoelace](https://shoelace.style/) Web Components (CDN)
- **데이터베이스**: IndexedDB (커스텀 래퍼)
- **RSS 파싱**: 네이티브 DOMParser
- **콘텐츠 추출**: [Mozilla Readability.js](https://github.com/mozilla/readability)
- **구문 강조**: [highlight.js](https://highlightjs.org/)
- **CORS 프록시**: [corsproxy.io](https://corsproxy.io/)

## 📚 문서

- [📝 커밋 가이드라인](COMMIT_GUIDELINES.md) - 기여를 위한 커밋 메시지 규칙
- [📦 변경 로그](CHANGELOG.md) - 프로젝트 버전 히스토리
- [👩‍💻 개발 가이드](CLAUDE.md) - AI 어시스턴트를 위한 개발 가이드

## 🔧 개발자를 위한 정보

### 개발 환경 설정

```bash
# 의존성 설치 (husky hooks 자동 설정됨)
pnpm install

# 개발 서버 시작 (hot reload)
pnpm run dev

# 단순 개발 서버
pnpm run dev:simple
```

### 커밋 워크플로

이 프로젝트는 **자동화된 버전 관리** 시스템을 사용합니다:

1. **커밋**: [Conventional Commits](https://conventionalcommits.org/) 형식 사용
2. **자동 버전 증가**: 커밋 후 자동으로 `package.json` 버전 업데이트
3. **자동 태그 생성**: Semantic versioning 태그 자동 생성
4. **CHANGELOG 업데이트**: 커밋 메시지 기반 자동 변경 로그 생성

```bash
# 변경 사항 스테이징
git add .

# Conventional Commit 형식으로 커밋 (자동 버전 증가)
git commit -m "feat(reader): 새로운 피드 추가 기능"

# 원격 저장소에 푸시 (태그 포함)
git push --follow-tags

# 또는 릴리스 명령 사용
pnpm run release
```

### 중요 규칙

- ❌ `package.json`의 `version` 필드를 수동으로 편집하지 마세요
- ❌ `CHANGELOG.md`를 수동으로 편집하지 마세요
- ✅ [커밋 가이드라인](COMMIT_GUIDELINES.md)을 따라 커밋하세요
- ✅ `pnpm run release`로 릴리스하세요

### 사용 가능한 스크립트

```json
{
  "start": "node server.js",           // 프로덕션 서버 시작
  "dev": "nodemon server.js",          // 개발 서버 (hot reload)
  "dev:simple": "nodemon server.js",   // 단순 개발 서버  
  "version": "standard-version",       // 버전 증가 (자동 실행됨)
  "release": "standard-version && git push --follow-tags",
  "clean": "rm -rf node_modules pnpm-lock.yaml",
  "reinstall": "pnpm clean && pnpm install"
}
```

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. feature 브랜치를 만듭니다 (`git checkout -b feat/amazing-feature`)
3. [커밋 가이드라인](COMMIT_GUIDELINES.md)에 따라 변경사항을 커밋합니다
4. 브랜치에 푸시합니다 (`git push origin feat/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♀️ 지원

문제가 발생하거나 질문이 있으시면:

- [Issues](https://github.com/jade-kim/gemini-feedic/issues)에서 버그 리포트 또는 기능 요청
- [CLAUDE.md](CLAUDE.md)에서 개발 관련 정보 확인

---

<p align="center">
  ❤️ Made with <a href="https://claude.ai">Claude</a>
</p>
