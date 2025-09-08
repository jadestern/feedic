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

> 📋 **기능 이력 및 완료된 작업**: 자세한 변경 로그와 릴리스 노트는 [CHANGELOG.md](./CHANGELOG.md)를 참조하세요.

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
- [ ] 검색 성능 테스트 (100+ articles)
- [ ] 크로스 브라우저 테스트 (Chrome, Firefox, Safari)
- [ ] 대량 기사 정리 테스트 (1000+ articles)
- [ ] 모바일 반응형 테스트 (320px, 375px, 768px+)
- [ ] 키보드 네비게이션 전체 테스트
