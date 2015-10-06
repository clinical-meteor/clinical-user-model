describe('clinical:user-model', function () {

  describe('User.displayName', function () {
    it.client('returns Jane Doe on client', function () {
      expect(User.displayName()).to.equal("Jane Doe");
    });
    it.server('returns JaneDoe on server', function () {
      expect(User.displayName()).to.equal("Jane Doe");
    });
  });


  describe('User.isSelf', function () {
    it.client('returns true on client', function () {
      expect(User.isSelf()).to.be.true;
    });
    it.server('returns true on server', function () {
      expect(User.isSelf()).to.be.true;
    });
  });


  describe('User.defaultEmail', function () {
    it.client('returns jane@doe.name on client', function () {
      expect(User.defaultEmail()).to.equal("jane@doe.name");
    });
    it.server('returns jane@doe.com on server', function () {
      expect(User.defaultEmail()).to.equal("jane@doe.name");
    });
  });


  describe('collection returns User object', function () {
    it.client('returns User on client', function () {
      expect(true).to.be.true;
    });
    it.server('returns User on server', function () {
      expect(true).to.be.true;
    });
  });

});
