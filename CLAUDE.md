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

## Known Issues and Fixes

### CSS Text Wrapping Bug (Fixed)

**Issue Symptoms:**
- Long article titles, URLs, or comment text would overflow containers on narrow screens
- Horizontal scrolling appeared on mobile devices
- Text would break layout boundaries, especially in sidebar feed names and article titles

**Root Cause:**
The application lacked proper CSS `word-break` and `overflow-wrap` properties to handle long, unbreakable text strings (like URLs or very long words).

**Fix Applied:**
```css
/* Global text wrapping safety net */
body {
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* Specific element fixes */
#detail-content,
#detail-content p,
.article-item h3,
.comment-content,
#feed-list sl-menu-item span,
#current-feed-title {
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

/* Preserve code block formatting */
#detail-content pre,
#detail-content code,
.comment-content pre,
.comment-content code {
  word-break: normal;
  word-wrap: normal;
  overflow-wrap: normal;
  white-space: pre-wrap;
}
```

**Testing Steps:**
1. Test on mobile viewports (320px, 375px, 768px)
2. Add RSS feeds with very long titles or URLs
3. Verify no horizontal scrolling occurs
4. Confirm code blocks maintain proper formatting
5. Check that text remains readable across different screen sizes

**Browser Compatibility:**
- `word-break: break-word` - Modern browsers
- `word-wrap: break-word` - Legacy fallback
- `overflow-wrap: anywhere` - Latest CSS specification

## Planned Features & Improvements

### 1. Bookmark Functionality ⭐
**Status:** Planned  
**Priority:** High  
**Description:** Allow users to bookmark/favorite articles for later reading.

**Implementation Details:**
- Add `bookmarked` boolean field to article schema in IndexedDB
- Add star (⭐) icon button to each article item
- Create "북마크" (Bookmarks) tab in filter tabs
- Update UI to show bookmarked status with filled/unfilled star
- Bookmark state persists across app restarts

**UI Changes:**
```html
<!-- Article item with bookmark button -->
<div class="article-item">
  <!-- existing content -->
  <sl-icon-button 
    name="star" 
    label="북마크" 
    class="bookmark-btn" 
    data-guid="{article.guid}"
  ></sl-icon-button>
</div>
```

**Database Schema Update:**
```javascript
// articles store schema
{ 
  guid, title, link, author, pubDate, content, feedUrl, read,
  bookmarked: false  // NEW FIELD
}
```

### 2. Remove "모두" (All) Tab
**Status:** Planned  
**Priority:** Medium  
**Description:** Simplify UI by removing the "All" tab, keeping only "읽지 않음" (Unread) and "읽음" (Read) tabs.

**Changes:**
- Remove `<sl-tab slot="nav" panel="all">모두</sl-tab>` from HTML
- Update tab filtering logic to handle only 'unread' and 'read' states
- Default filter becomes 'unread' instead of potentially 'all'

### 3. Search Functionality 🔍
**Status:** Planned  
**Priority:** High  
**Description:** Add client-side search to filter articles by title and content.

**Implementation:**
- Add search input field in header
- Implement JavaScript-based filtering (no backend required)
- Search through article titles and content text
- Real-time filtering as user types (with debounce)
- Clear search button

**UI Addition:**
```html
<!-- In header, alongside filter tabs -->
<sl-input 
  id="search-input" 
  placeholder="기사 제목, 내용 검색..." 
  clearable
  size="small"
>
  <sl-icon name="search" slot="prefix"></sl-icon>
</sl-input>
```

**Search Logic:**
```javascript
function filterArticlesBySearch(articles, searchTerm) {
  if (!searchTerm) return articles;
  const term = searchTerm.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(term) ||
    article.content.toLowerCase().includes(term)
  );
}
```

### 4. Enhanced Article Navigation
**Status:** Planned  
**Priority:** Medium  
**Description:** Replace generic "이전/다음" buttons with article titles, potentially using vertical layout for better space utilization.

**Current State:**
```html
<sl-button id="detail-prev-btn">이전 (←)</sl-button>
<sl-button id="detail-next-btn">다음 (→)</sl-button>
```

**Proposed Enhancement:**
```html
<!-- Option 1: Enhanced horizontal layout -->
<div class="article-nav-enhanced">
  <sl-button id="detail-prev-btn" class="prev-article-btn">
    <sl-icon name="arrow-left" slot="prefix"></sl-icon>
    <span class="article-title-preview">이전: {truncated title...}</span>
  </sl-button>
  <sl-button id="detail-next-btn" class="next-article-btn">
    <span class="article-title-preview">다음: {truncated title...}</span>
    <sl-icon name="arrow-right" slot="suffix"></sl-icon>
  </sl-button>
</div>

<!-- Option 2: Vertical stacked layout -->
<div class="article-nav-vertical">
  <div class="nav-item prev-nav" data-guid="{prevGuid}">
    ↑ 이전: {truncated title with ellipsis}
  </div>
  <div class="nav-item next-nav" data-guid="{nextGuid}">
    ↓ 다음: {truncated title with ellipsis}
  </div>
</div>
```

**Styling Considerations:**
- `max-width` with `text-overflow: ellipsis`
- Responsive breakpoints for mobile
- Hover/focus states
- Accessible labels with full titles

### 5. Automatic Article Cleanup
**Status:** Planned  
**Priority:** Low  
**Description:** Automatically remove articles older than 7 days to keep database size manageable, but preserve bookmarked articles.

**Implementation:**
```javascript
async function cleanupOldArticles() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const store = db.transaction([ARTICLE_STORE], 'readwrite').objectStore(ARTICLE_STORE);
  
  store.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const article = cursor.value;
      const articleDate = new Date(article.pubDate);
      
      // Delete if older than 7 days AND not bookmarked
      if (articleDate < oneWeekAgo && !article.bookmarked) {
        cursor.delete();
      }
      cursor.continue();
    }
  };
}

// Run cleanup on app startup and periodically
setInterval(cleanupOldArticles, 24 * 60 * 60 * 1000); // Daily
```

### Development Priorities
1. **Bookmark functionality** - Core feature for user article management
2. **Search functionality** - Significantly improves article discoverability  
3. **Remove All tab** - Simple UI cleanup
4. **Enhanced navigation** - Better UX for article browsing
5. **Auto cleanup** - Maintenance feature, can be implemented last

### Testing Strategy
- **Manual testing** on various screen sizes (320px, 768px, 1024px+)
- **Keyboard navigation** testing for all new interactive elements
- **IndexedDB operations** testing for bookmark and cleanup functionality
- **Performance testing** with large datasets (1000+ articles) for search
- **Cross-browser testing** on Chrome, Firefox, Safari

### Migration Considerations
- Existing articles will need `bookmarked: false` default value
- No breaking changes to existing RSS feed or article data
- Feature additions are backwards compatible
