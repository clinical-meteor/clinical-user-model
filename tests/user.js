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
  describe('User - isTrue()', function () {
    it('should return a list of collaborators', function () {
      expect(User.isTrue()).to.be.true;
    });
  });
  describe('User - getCollaborations()', function () {

    it('should return a list of collaborators', function () {

      // var userCount = Meteor.users.find().count();
      // expect(userCount).to.equal(1);

      var user = Meteor.users.findOne({"username": "testAccount"});
      expect(user).to.exist;
      expect(user.username).to.equal("testAccount");
      // expect(user.profile).to.exist;

      //expect(user.profile.collaborations).to.exist;
      //expect(user.profile.collaborations[ 0 ]).to.equal("foo");
    });
  });
  describe('User - exists()', function () {
    it.client('test account should exist on client', function () {
      expect(Meteor.user()).to.not.exist;
      Meteor.loginWithPassword("testAccount@somewhere.net", "testAccount");
      Meteor.setTimeout(function () {
        expect(Meteor.user()).to.exist;
      }, 1000);
    });
    it.server('test account should exist on server', function () {
      // var user = Meteor.users.findOne({
      //   //username: "testAccount"
      //   _id: testAccountId
      // });
      // var user = Accounts.findUserWithUsername("testAccount");
      var user = Meteor.users.findOne({
        "username": "testAccount"
      });
      expect(user).to.exist;
    });
  });

});
