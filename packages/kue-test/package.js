Package.describe({
  name: 'kue-test',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'just testing',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('kue-test.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('kue-test');
  api.use('wylio:mandrill'); // need to load mandrill before this package
  api.addFiles('kue-test-tests.js');
});
