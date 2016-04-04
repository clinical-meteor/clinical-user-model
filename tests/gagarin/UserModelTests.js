
describe('clinical:user-model', function () {
  var server = meteor();
  var client = browser(server);

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
  it('Confirm users are initialized', function () {
    return server.wait(1000, "until users are loaded", function () {
      Meteor.users.remove({});
      Meteor.users.insert({
        username: 'house',
        password: 'house',
        email: 'house@test.org',
        profile: {
          fullName: 'Gregory House',
          role: 'Physician',
          avatar: '/packages/clinical_accounts-housemd/housemd/gregory.house.jpg'
        }
      });
      return Meteor.users.find().fetch();
    }).then(function (users){
      expect(users.length).to.equal(1);
    });
  });


  it('Can return the full name.', function () {
    return server.wait(1000, "until users are loaded", function () {
      return Meteor.users.findOne({username: "house"}).fullName();
    }).then(function (username){
      expect(username).to.equal('Gregory House');
    });
  });
  it('Can return the family name.', function () {
    return server.wait(1000, "until users are loaded", function () {
      return Meteor.users.findOne({username: "house"}).familyName();
    }).then(function (username){
      expect(username).to.equal('House');
    });
  });
  it('Can return the given name.', function () {
    return server.wait(1000, "until users are loaded", function () {
      return Meteor.users.findOne({username: "house"}).givenName();
    }).then(function (username){
      expect(username).to.equal('Gregory');
      Meteor.users.remove({});
    });
  });

});
