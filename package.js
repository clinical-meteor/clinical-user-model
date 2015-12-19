Package.describe({
  name: "clinical:user-model",
  summary: "A social user package",
  version: "1.4.2",
  git: "https://github.com/clinical-meteor/clinical-user-model.git"
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.2');

  api.use('templating');

  api.use([
        "clinical:base-model@1.3.0",
        "accounts-base"
        // "clinical:collaborations@2.1.2"
    ]);

  api.imply([
    "clinical:base-model",
    "accounts-base"
  ]);

  api.addFiles("client/template.helpers.js", 'client');
  api.addFiles("lib/user-model.js");

  api.export("User");
});




Package.onTest(function (api) {
  api.versionsFrom('1.2.0.2');
  api.use('meteor-platform@1.2.2');
  api.use('accounts-base@1.2.0');
  api.use('accounts-password@1.1.1');
  api.use('autopublish@1.0.3');
  api.use('insecure@1.0.3');
  api.use('tinytest@1.0.5');
  api.use('clinical:verification');
  api.use('clinical:user-model');

  api.addFiles('tests/user.js');
});
