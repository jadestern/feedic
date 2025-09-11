#!/usr/bin/env node

/**
 * Node.js용 테스트 실행 스크립트
 * 사용법: node test/run-tests.js
 */

const { runTests } = require('./article-age-filter.test.js');

console.log('Node.js 환경에서 기사 날짜 필터링 테스트를 실행합니다...\n');

try {
    runTests();
} catch (error) {
    console.error('테스트 실행 중 에러가 발생했습니다:', error);
    process.exit(1);
}
