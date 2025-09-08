module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // Allow any case for Korean text
    'body-max-line-length': [0], // Allow longer lines for Korean text
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore', 
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  }
};
