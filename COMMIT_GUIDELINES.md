# 📝 커밋 가이드라인

이 프로젝트는 [Conventional Commits](https://conventionalcommits.org/) 규칙을 따르며, 자동화된 버전 관리와 CHANGELOG 생성을 위해 표준화된 커밋 메시지 형식을 사용합니다.

## 🎯 기본 형식

```
<타입>[선택적 범위]: <설명>

[선택적 본문]

[선택적 푸터]
```

### 예시
```bash
feat(reader): RSS 피드 북마크 기능 추가
fix(ui): 모바일 화면에서 텍스트 넘침 문제 해결
docs: 커밋 가이드라인 문서 추가
```

## 🏷️ 커밋 타입

| 타입 | 설명 | 버전 영향 |
|------|------|-----------|
| `feat` | 새로운 기능 추가 | **Minor** (1.0.0 → 1.1.0) |
| `fix` | 버그 수정 | **Patch** (1.0.0 → 1.0.1) |
| `docs` | 문서 변경 | Patch |
| `style` | 코드 의미에 영향 없는 변경 (공백, 세미콜론 등) | Patch |
| `refactor` | 버그 수정이나 기능 추가가 아닌 코드 변경 | Patch |
| `perf` | 성능 개선 | Patch |
| `test` | 테스트 추가 또는 수정 | Patch |
| `build` | 빌드 시스템이나 외부 의존성에 영향을 주는 변경 | Patch |
| `ci` | CI 설정 파일 및 스크립트 변경 | Patch |
| `chore` | 기타 변경 사항 | Patch |
| `revert` | 이전 커밋 되돌리기 | Patch |

## 🎯 범위(Scope) 권장사항

프로젝트의 주요 영역에 따른 범위 지정:

- `reader` - RSS 리더 핵심 기능
- `parser` - RSS/Atom 파싱 관련
- `ui` - 사용자 인터페이스
- `search` - 검색 기능
- `bookmark` - 북마크 기능
- `mobile` - 모바일 UX
- `db` - IndexedDB 관련
- `perf` - 성능 최적화
- `release` - 릴리스 관련

## 🚀 주요(BREAKING CHANGE) 변경

주요 변경 사항(API 호환성을 깨는 변경)이 있을 때는 **Major** 버전이 증가합니다 (1.0.0 → 2.0.0).

```bash
feat(api)!: IndexedDB 스키마 변경으로 마이그레이션 필요

BREAKING CHANGE: articles 테이블에 새로운 필수 필드 추가
```

또는:

```bash
feat(api): 새로운 피드 파서 API 추가

BREAKING CHANGE: 기존 파서 인터페이스 변경됨
```

## ✅ 좋은 커밋 메시지 예시

### 새로운 기능
```bash
feat(search): 전체 화면 검색 페이지 구현
feat(bookmark): 기사 북마크 토글 기능 추가
feat(mobile): 반응형 레이아웃 시스템 구현
```

### 버그 수정
```bash
fix(ui): 긴 제목이 모바일에서 레이아웃 깨지는 문제 해결
fix(parser): RSS 파싱 시 한글 인코딩 오류 수정
fix(search): 검색어 하이라이트가 작동하지 않는 문제 해결
```

### 문서
```bash
docs: README에 설치 방법 추가
docs: API 문서 업데이트
docs(contributing): 기여 가이드라인 작성
```

### 스타일
```bash
style(ui): 일관된 들여쓰기 적용
style: 불필요한 공백 제거
```

## ❌ 피해야 할 커밋 메시지

```bash
# 너무 모호함
update stuff
fix bug
changes

# 타입 없음
버그 수정
새 기능 추가

# 설명 없음
feat:
fix(ui):
```

## 🔄 자동화 워크플로

이 프로젝트는 다음과 같은 자동화 시스템을 사용합니다:

1. **커밋 시**: commitlint가 메시지 형식 검증
2. **커밋 후**: post-commit hook이 자동으로 버전 증가 및 태그 생성
3. **푸시 시**: `pnpm run release` 명령으로 변경 사항과 태그를 원격 저장소에 전송

### 일반적인 워크플로

```bash
# 변경 사항 스테이징
git add .

# Conventional Commit 형식으로 커밋 (자동 버전 증가)
git commit -m "feat(reader): 새로운 피드 추가 기능"

# 원격 저장소에 푸시 (태그 포함)
git push --follow-tags
# 또는
pnpm run release  # 이미 버전이 올라간 후라면 push만 실행됨
```

## 🛠️ 설정

이 가이드라인은 다음 도구들로 자동화됩니다:

- **commitlint**: 커밋 메시지 형식 검증
- **standard-version**: 자동 버전 증가 및 CHANGELOG 생성  
- **husky**: Git hooks 관리

### 개발 환경 설정

```bash
# 의존성 설치 (husky hooks 자동 설정됨)
pnpm install

# 수동 릴리스 (필요한 경우)
pnpm run release
```

## 📚 참고 자료

- [Conventional Commits 공식 사이트](https://conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
