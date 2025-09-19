# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Feedic**, a Korean RSS reader web application built as a single HTML file with vanilla JavaScript. It's a client-side application that uses IndexedDB for local data storage and CORS proxies to fetch RSS feeds.

## Architecture

### Single File Application
- **Core file**: `index.html` - Contains all HTML, CSS, and JavaScript
- **Server**: `server.js` - Simple Node.js server with API endpoints and static file serving
- **Static assets**: `public/` directory with favicons, web manifest, and PWA icons

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
# Development server with auto-reload
npm run dev

# Production server
npm start

# Alternative: serve with any static server
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
- **Bookmark system**: Star articles for later reading
- **Content extraction**: Full article content via Readability
- **Search functionality**: Full-text search across all articles
- **PWA support**: Install as app with optimized icons and splash screens
- **Dynamic version display**: Auto-sync version from package.json
- **Keyboard shortcuts**: Navigation and interaction
- **Theme toggle system**: One-click cycling between Light → Dark → System modes
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

> 📋 **기능 이력 및 완료된 작업**: 자세한 변경 로그와 릴리스 노트는 [CHANGELOG.md](./CHANGELOG.md)를 참조하세요.

## Recent Updates 🆕

### ✅ Dynamic Version Display (v1.7.0)
**Status:** 완료 (2024-09-19)  
**Changes:**
- Feedic 로고 옆 버전 정보가 package.json과 자동 동기화
- 서버에 `/package.json` 엔드포인트 추가
- 동적 버전 로딩 함수 구현
- 폴백 시스템으로 하드코딩된 버전 유지
- 서버 정적 파일 서비스 기능 개선

**Implementation Details:**
```javascript
// Dynamic version loading
async function loadAppVersion() {
  try {
    const response = await fetch('/package.json');
    const packageInfo = await response.json();
    document.getElementById('app-version').textContent = `v${packageInfo.version}`;
  } catch (error) {
    // Fallback to hardcoded version
  }
}
```

### ✅ PWA Icon & Splash Screen Optimization (v1.6.0-1.6.2)
**Status:** 완료 (2024-09-16~19)  
**Changes:**
- PWA 스플래시 스크린에서 로고 과도한 크기 문제 해결
- CSS 미디어 쿼리로 스플래시 스크린 로고 크기 제어
- 다양한 크기의 PWA 아이콘 생성 (48px~512px)
- PWA 메타데이터 개선 및 표준 준수
- 모바일 디바이스별 최적화

**Implementation Details:**
```css
/* PWA Splash Screen Optimization */
@media (display-mode: standalone) {
  body {
    --pwa-icon-size: min(25vw, 120px);
  }
  #global-loader sl-spinner {
    font-size: var(--pwa-icon-size, 3rem) !important;
    max-width: var(--pwa-icon-size, 120px);
    max-height: var(--pwa-icon-size, 120px);
  }
}
```

### ✅ Theme Toggle Enhancement (v1.1.2)
**Status:** 완료 (2024-09-16)  
**Changes:**
- 기존 드롭다운 선택 방식을 원클릭 토글로 변경
- 테마 순환: Light → Dark → System → Light
- 동적 아이콘 변경: ☀️ (light) / 🌙 (dark) / 💻 (system)
- 시스템 테마 자동 감지 및 반응 유지
- 향상된 UX: 더 직관적이고 빠른 테마 전환

**Implementation Details:**
```html
<!-- Old: Dropdown menu -->
<sl-dropdown>
  <sl-menu>...</sl-menu>
</sl-dropdown>

<!-- New: Toggle button -->
<button data-role="theme-toggle" class="theme-toggle-btn">
  <sl-icon name="sun"></sl-icon>
</button>
```

```javascript
// Theme cycling logic
const themes = ['light', 'dark', 'system'];
function cycleTheme() {
  const currentTheme = localStorage.getItem('rss-theme') || 'system';
  const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length];
  localStorage.setItem('rss-theme', nextTheme);
  applyTheme(nextTheme);
}
```

## Current Tasks & Roadmap 🎯

### 📋 Medium Priority - Quick Fixes

#### 4. Enhanced Article Navigation
**Status:** UX 개선 필요성 검토 중  
**Consideration:** 현재 "이전/다음" 버튼이 잘 작동하는지 사용자 피드백 필요  
**Alternative:** 키보드 네비게이션(←/→)이 이미 구현되어 있어 우선순위 낮음

### 🔮 Future Considerations

#### 성능 최적화
**Status:** 성능 테스트 필요  
**Action Items:**
- 대량 기사 처리 성능 테스트 (1000+ articles)
- 검색 성능 최적화
- 크로스 브라우저 테스트

---

## 테스트 체크리스트

### 기본 기능 테스트
- [x] 테마 토글 기능 테스트 (Light → Dark → System 순환)
- [x] 시스템 테마 자동 감지 테스트
- [x] 테마 설정 유지 테스트 (localStorage)
- [ ] 검색 성능 테스트 (100+ articles)
- [ ] 크로스 브라우저 테스트 (Chrome, Firefox, Safari)
- [ ] 대량 기사 정리 테스트 (1000+ articles)
- [ ] 모바일 반응형 테스트 (320px, 375px, 768px+)
- [ ] 키보드 네비게이션 전체 테스트
