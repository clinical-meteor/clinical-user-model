
describe('clinical:user-model', function () {
  var server = meteor();
  var client = browser(server);

  beforeEach(function () {
    server.execute(function () {

    }).then(function (value){

    });
  });
  afterEach(function () {
    server.execute(function () {

    });
  });

  it('User should exist on the client', function () {
    return client.execute(function () {
      expect(User).to.exist;
    });
  });

  it('User should exist on the server', function () {
    return server.execute(function () {
      expect(User).to.exist;
    });
  });
});
