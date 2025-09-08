# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Feedic**, a Korean RSS reader web application built as a single HTML file with vanilla JavaScript. It's a client-side application that uses IndexedDB for local data storage and CORS proxies to fetch RSS feeds.

## Architecture

### Single File Application
- **Core file**: `index.html` - Contains all HTML, CSS, and JavaScript
- **Static assets**: `public/` directory with favicons and web manifest

### Key Technologies
- **Frontend**: Vanilla JavaScript, no build system required
- **Styling**: Tailwind CSS (loaded via CDN)
- **Components**: Shoelace Web Components (loaded via CDN)
- **Database**: IndexedDB with custom wrapper functions
- **RSS Parsing**: Native DOMParser
- **Content Extraction**: Mozilla Readability.js
- **Syntax Highlighting**: highlight.js
- **CORS Proxy**: corsproxy.io for RSS feed fetching

### Database Schema
Two IndexedDB stores:
- `feeds` store: `{ url, title, faviconUrl }`
- `articles` store: `{ guid, title, link, author, pubDate, content, feedUrl, read }`

### Core Architecture Patterns

1. **Event-driven UI**: Uses event delegation and custom event handlers
2. **Promise-based database operations**: All DB functions return promises
3. **State management**: Global variables for current filter, articles, and UI state
4. **Keyboard navigation**: Full keyboard support for article browsing
5. **Single Page Application**: URL-based routing for article detail view
6. **Responsive design**: Mobile-first with collapsible sidebar

## Development

### Running the Application
```bash
# Serve the file with any static server, e.g.:
python -m http.server 8000
# or
npx serve .
```

### No Build Process
This application requires no build, compile, or bundle steps. Simply open `index.html` in a web browser or serve it statically.

### Key Functions and Structure

**Database Operations** (lines 287-350):
- `initDB()`: Initialize IndexedDB
- `getAllFeeds()`, `getArticles()`: Data retrieval
- `saveArticles()`, `setArticleReadStatus()`: Data persistence

**UI Rendering** (lines 357-416):
- `renderFeeds()`: Builds sidebar feed list
- `renderArticles()`: Renders article list with filtering

**Feed Management** (lines 420-491):
- `fetchAndSaveFeed()`: Parse RSS/Atom feeds
- `refreshAllFeeds()`: Bulk feed updates

**Article Detail View** (lines 516-597):
- `updateDetailView()`: Show full article content
- `fetchAndDisplayFullContent()`: Use Readability.js for content extraction

### Key Features
- **Multi-feed support**: Add multiple RSS/Atom feeds
- **Read/unread tracking**: Mark articles as read/unread
- **Content extraction**: Full article content via Readability
- **Keyboard shortcuts**: Navigation and interaction
- **Dark mode support**: System preference aware
- **Responsive layout**: Works on mobile and desktop
- **Resizable sidebar**: Persistent layout preferences
- **Offline capable**: All data stored locally in IndexedDB

### Localization
- Interface is in Korean
- Date formatting uses Korean locale
- All user-facing text is in Korean

### Testing
No automated tests are present. Test manually by:
1. Adding various RSS/Atom feeds
2. Testing article reading and marking functionality
3. Verifying keyboard navigation
4. Testing responsive behavior on different screen sizes

## Completed Issues

### ✅ CSS Text Wrapping Bug (Fixed)
**Issue:** 긴 제목과 URL이 모바일 화면에서 레이아웃을 깨뜨리는 문제  
**Fix:** CSS `word-break`, `word-wrap`, `overflow-wrap` 속성 추가로 텍스트 넘침 해결  
**Result:** 모든 화면 크기에서 수평 스크롤 없이 텍스트 정상 표시

## Current Tasks & Roadmap 🎯

## Completed Tasks ✅

### ⭐ Bookmark Functionality (DONE)
**Status:** 완전 구현 완료 🎉  
**Completed Features:**
- ✅ IndexedDB `bookmarked` 필드 추가 (line 614)
- ✅ Star 버튼 UI (line 812) 
- ✅ "북마크" 필터 탭 (line 533)
- ✅ `setArticleBookmarkStatus` 토글 함수 (line 670-679)
- ✅ 이벤트 핸들러 & 필터링 로직 (line 1642-1675)
- ✅ 북마크 카운터 표시 (line 778)
- ✅ 필터별 아이템 제거 애니메이션

### 🔍 Search Functionality (DONE)
**Status:** 전용 검색 페이지 구현 완룼 🎉  
**Completed Features:**
- ✅ 전체 화면 전용 검색 페이지 (line 610-655)
- ✅ 검색 버튼 + Enter 키 검색
- ✅ 제목과 내용 미리보기 카드
- ✅ 검색어 하이라이트 기능
- ✅ 스마트 내용 발취문 (240자, 검색어 주변)
- ✅ ESC 키로 검색 페이지 닫기
- ✅ 검색 결과 클릭으로 상세 보기 이동
- ✅ 테마 동기화 및 반응형 디자인

---

### ⚡ Quick Fixes - Next Up
**Status:** 구현 준비 완료  
**Estimated Time:** 2-3 hours  
**Next Steps:**
1. 헤더에 search input 추가
2. 실시간 검색 필터 함수 구현 (debounce 적용)
3. 검색어 하이라이트 기능 (선택사항)
4. 검색 상태 UI 피드백

**Implementation Ready:**
```javascript
// 검색 디바운스 함수
let searchTimeout;
function handleSearch(searchTerm) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearchTerm = searchTerm;
    renderArticles();
  }, 300);
}
```

### 📋 Medium Priority - Quick Fixes

#### 2. Remove "모두" Tab Cleanup ⚡
**Status:** 즉시 실행 가능  
**Estimated Time:** 5분  
**Current Issue:** HTML line 534에 여전히 존재  
**Action Items:**
- `<sl-tab slot="nav" panel="all">모두</sl-tab>` 라인 제거
- 필터 로직을 'unread'/'read'/'bookmarked' 만으로 단순화

#### 4. Enhanced Article Navigation
**Status:** UX 개선 필요성 검토 중  
**Consideration:** 현재 "이전/다음" 버튼이 잘 작동하는지 사용자 피드백 필요  
**Alternative:** 키보드 네비게이션(←/→)이 이미 구현되어 있어 우선순위 낮음

### 🔮 Future Considerations

#### 5. Automatic Article Cleanup
**Status:** 데이터베이스 크기 모니터링 후 결정  
**Trigger:** 1000개 이상 articles 축적 시 구현 검토
**Note:** 북마크 기능 구현 후 진행 (북마크된 글 보존 필요)

---

## 🚀 Next Action Items

### 🎯 이번 주 목표
1. ✅ **북마크 기능** - 완료됨!
2. ✅ **검색 기능 구현** - 완료됨!
3. ✅ **"모두" 탭 제거** - 완료됨!
4. 🧹 **코드 정리 및 최적화** (1일)

### 새로운 구현 순서
```
Today: "모두" 탭 제거 (5분)
Day 1-2: 검색 input + 기본 검색 로직
Day 3: 검색 UX 개선 + 성능 최적화  
Day 4: 전체 테스트 + 사용자 테스트
Day 5: 문서 정리 + 다음 단계 계획
```

### 테스트 체크리스트
- [x] 북마크 기능 동작 확인
- [x] 북마크 필터링 및 카운터  
- [x] 모바일 반응형 (320px, 375px, 768px)
- [x] 키보드 네비게이션
- [x] 검색 기능 및 결과 표시
- [x] 검색 버튼 및 Enter 키 동작
- [x] "모두" 탭 제거 확인
- [x] 검색 하이라이트 및 미리보기
- [ ] 검색 성능 테스트 (100+ articles)
- [ ] 크로스 브라우저 테스트
