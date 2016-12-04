Package.describe({
  name: "clinical:user-model",
  summary: "A social user package",
  version: "1.6.0",
  git: "https://github.com/clinical-meteor/user-model.git"
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('accounts-base@1.2.14');
  api.use("clinical:base-model@1.3.5");
  api.use('aldeed:simple-schema@1.3.3');

  api.imply([
    "clinical:base-model@1.3.5",
    "accounts-base@1.2.14"
  ]);

  api.addFiles("lib/user-model.js");

  api.export("User");
  api.export("UserIdExtension");
});
