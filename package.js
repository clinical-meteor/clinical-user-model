Package.describe({
  name: "clinical:user-model",
  summary: "A social user package",
  version: "1.6.5",
  git: "https://github.com/clinical-meteor/user-model.git"
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('accounts-base@1.4.2');
  api.use("clinical:base-model@1.4.0");
  api.use('ecmascript@0.9.0');

  api.imply([
    "clinical:base-model@1.4.0",
    "accounts-base@1.4.2"
  ]);

  api.addFiles("lib/user-model.js");

  api.export("User");
  api.export("UserIdExtension");
});


Npm.depends({
  "lodash": "4.17.4",  
  "simpl-schema": "1.5.3"
});