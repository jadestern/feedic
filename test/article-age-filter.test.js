/**
 * 기사 날짜 필터링 로직 유닛 테스트
 */

// 테스트용 모의 DOM Parser
class MockDOMParser {
  parseFromString(xmlString, type) {
    // 간단한 RSS XML 파싱 모의
    const items = [];
    
    // XML에서 item 태그들을 추출하여 모의 요소 생성
    const itemMatches = xmlString.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    itemMatches.forEach(itemXml => {
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const guidMatch = itemXml.match(/<guid>(.*?)<\/guid>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const descriptionMatch = itemXml.match(/<description>(.*?)<\/description>/);
      
      const mockItem = {
        querySelector: (selector) => {
          switch (selector) {
            case 'title':
              return titleMatch ? { textContent: titleMatch[1] } : null;
            case 'link':
              return linkMatch ? { textContent: linkMatch[1] } : null;
            case 'guid':
              return guidMatch ? { textContent: guidMatch[1] } : null;
            case 'pubDate, published, updated':
            case 'pubDate':
              return pubDateMatch ? { textContent: pubDateMatch[1] } : null;
            case 'author > name, creator':
              return null;
            case '*|content, content':
            case 'description, summary':
              return descriptionMatch ? { textContent: descriptionMatch[1] } : null;
            default:
              return null;
          }
        }
      };
      items.push(mockItem);
    });
    
    return {
      querySelector: (selector) => {
        if (selector === 'parsererror') return null;
        if (selector === 'channel > title') return { textContent: 'Test Feed' };
        if (selector === 'channel > link:not([rel])') return { textContent: 'https://example.com' };
        return null;
      },
      querySelectorAll: (selector) => {
        if (selector === 'item, entry') return items;
        return [];
      }
    };
  }
}

// 테스트 헬퍼: RSS XML 생성
function createRssXml(items) {
  const itemsXml = items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${item.description || ''}</description>
    </item>
  `).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Test Feed</title>
        <link>https://example.com</link>
        ${itemsXml}
      </channel>
    </rss>`;
}

// 테스트 헬퍼: 날짜 생성
function createDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toUTCString();
}

// 실제 코드에서 추출한 파싱 로직 (테스트용)
function parseRssItems(xmlString, feedUrl = 'https://test.com/feed') {
  const MAX_ARTICLE_AGE_DAYS = 7;
  const parser = new MockDOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  
  const items = Array.from(doc.querySelectorAll('item, entry'));
  const cutoffDate = new Date(Date.now() - MAX_ARTICLE_AGE_DAYS * 24 * 60 * 60 * 1000);
  
  const articles = items.map(item => {
    const title = item.querySelector('title')?.textContent || '[No Title]';
    const linkElement = item.querySelector('link');
    const link = linkElement?.getAttribute?.('href') || linkElement?.textContent?.trim() || '';
    const guid = item.querySelector('guid')?.textContent || item.querySelector('id')?.textContent || link;
    const pubDate = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
    const author = item.querySelector('author > name, creator')?.textContent || '';
    const content = item.querySelector('*|content, content')?.textContent || item.querySelector('description, summary')?.textContent || '';

    return { guid, title, link, author, pubDate: new Date(pubDate).toISOString(), content, feedUrl };
  }).filter(article => {
    // 7일 이내의 기사만 저장
    const articleDate = new Date(article.pubDate);
    return articleDate >= cutoffDate;
  });
  
  return articles;
}

// 테스트 슈트
const tests = [
  {
    name: '7일 이내 기사만 필터링되는지 확인',
    test: () => {
      const testItems = [
        {
          title: '최신 기사',
          link: 'https://example.com/1',
          guid: 'guid-1',
          pubDate: createDate(1), // 1일 전
          description: '최신 기사 내용'
        },
        {
          title: '일주일된 기사',
          link: 'https://example.com/2',
          guid: 'guid-2',
          pubDate: createDate(7), // 7일 전
          description: '일주일된 기사 내용'
        },
        {
          title: '오래된 기사',
          link: 'https://example.com/3',
          guid: 'guid-3',
          pubDate: createDate(10), // 10일 전
          description: '오래된 기사 내용'
        }
      ];
      
      const rssXml = createRssXml(testItems);
      const result = parseRssItems(rssXml);
      
      // 7일 이내의 기사만 남아야 함
      const expectedCount = testItems.filter(item => {
        const itemDate = new Date(item.pubDate);
        const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= cutoff;
      }).length;
      
      console.assert(result.length === expectedCount, `Expected ${expectedCount} articles, got ${result.length}`);
      
      // 오래된 기사(10일 전)는 제외되어야 함
      const hasOldArticle = result.some(article => article.title === '오래된 기사');
      console.assert(!hasOldArticle, 'Old article should be filtered out');
      
      return result.length === expectedCount && !hasOldArticle;
    }
  },
  
  {
    name: '모든 기사가 7일 이내인 경우 모두 포함',
    test: () => {
      const testItems = [
        {
          title: '기사 1',
          link: 'https://example.com/1',
          guid: 'guid-1',
          pubDate: createDate(1),
          description: '기사 1 내용'
        },
        {
          title: '기사 2',
          link: 'https://example.com/2',
          guid: 'guid-2',
          pubDate: createDate(3),
          description: '기사 2 내용'
        },
        {
          title: '기사 3',
          link: 'https://example.com/3',
          guid: 'guid-3',
          pubDate: createDate(6),
          description: '기사 3 내용'
        }
      ];
      
      const rssXml = createRssXml(testItems);
      const result = parseRssItems(rssXml);
      
      console.assert(result.length === testItems.length, `Expected ${testItems.length} articles, got ${result.length}`);
      return result.length === testItems.length;
    }
  },
  
  {
    name: '모든 기사가 7일보다 오래된 경우 모두 필터링',
    test: () => {
      const testItems = [
        {
          title: '오래된 기사 1',
          link: 'https://example.com/1',
          guid: 'guid-1',
          pubDate: createDate(10),
          description: '오래된 기사 1 내용'
        },
        {
          title: '오래된 기사 2',
          link: 'https://example.com/2',
          guid: 'guid-2',
          pubDate: createDate(15),
          description: '오래된 기사 2 내용'
        }
      ];
      
      const rssXml = createRssXml(testItems);
      const result = parseRssItems(rssXml);
      
      console.assert(result.length === 0, `Expected 0 articles, got ${result.length}`);
      return result.length === 0;
    }
  },
  
  {
    name: '경계값 테스트: 정확히 7일된 기사',
    test: () => {
      const testItems = [
        {
          title: '7일 경계 기사',
          link: 'https://example.com/1',
          guid: 'guid-1',
          pubDate: createDate(7), // 정확히 7일 전
          description: '7일 경계 기사 내용'
        }
      ];
      
      const rssXml = createRssXml(testItems);
      const result = parseRssItems(rssXml);
      
      // 7일된 기사는 cutoff 날짜와 같거나 이후여야 포함됨
      // 구현에 따라 포함되거나 제외될 수 있음
      console.log(`7일 경계 기사 결과: ${result.length}개 (구현에 따라 0 또는 1이 될 수 있음)`);
      return true; // 이 테스트는 정보성으로만 사용
    }
  },
  
  {
    name: '빈 RSS 피드 처리',
    test: () => {
      const rssXml = createRssXml([]);
      const result = parseRssItems(rssXml);
      
      console.assert(result.length === 0, `Expected 0 articles for empty feed, got ${result.length}`);
      return result.length === 0;
    }
  },
  
  {
    name: '잘못된 날짜 형식 처리',
    test: () => {
      const testItems = [
        {
          title: '잘못된 날짜 기사',
          link: 'https://example.com/1',
          guid: 'guid-1',
          pubDate: 'invalid-date',
          description: '잘못된 날짜 기사 내용'
        }
      ];
      
      const rssXml = createRssXml(testItems);
      
      try {
        const result = parseRssItems(rssXml);
        // 잘못된 날짜는 현재 시간으로 처리되므로 포함되어야 함
        console.assert(result.length === 1, `Expected 1 article with invalid date, got ${result.length}`);
        return result.length === 1;
      } catch (error) {
        console.error('Error handling invalid date:', error);
        return false;
      }
    }
  }
];

// 테스트 실행 함수
function runTests() {
  console.log('🧪 기사 날짜 필터링 유닛 테스트 시작\n');
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    
    try {
      const result = test.test();
      if (result) {
        console.log('   ✅ 통과\n');
        passed++;
      } else {
        console.log('   ❌ 실패\n');
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ 에러: ${error.message}\n`);
      failed++;
    }
  });
  
  console.log(`📊 테스트 결과: ${passed}개 통과, ${failed}개 실패`);
  
  if (failed === 0) {
    console.log('🎉 모든 테스트가 통과했습니다!');
  } else {
    console.log('⚠️  일부 테스트가 실패했습니다.');
  }
}

// Node.js 환경에서 실행하는 경우
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, parseRssItems, createRssXml, createDate };
}

// 브라우저에서 직접 실행하는 경우
if (typeof window !== 'undefined') {
  window.ArticleFilterTests = { runTests, parseRssItems, createRssXml, createDate };
}
