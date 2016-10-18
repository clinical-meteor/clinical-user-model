## clinical:user-model

A model for a user which contains useful methods and can be extended by other packages by extending it's prototype to add methods that add functionality that are pertinent to their purpose. For example the socialize:friendships package extends the user model to provide helpers which return friend requests and friends for the user.

======================================
#### User() - Extends BaseModel ###

**User.prototype.displayName()** - A representation of the user. "You" if the instance is the same as the current user, instance.username otherwise.

**User.prototype.isSelf(user)** - Checks if one user is another user by comparing ``_id``s.

**User.prototype.defaultEmail** - Returns the first email address in the list of emails.

**Q: Is there any documentation on the User Profile?**  

The basic user profile is structured like the following JSON document:
````js
{
  username: 'jdoe',  
  emails: [{'address': 'somebody@somewhere.com', 'verified': true}],   
  profile: {
    'name': 'Jane Doe'
  }
}
````

The intention is that the first email address in the 'emails' list is the primary contact, where people want to be emailed, and the other addresses in the list are alternates that work for login but do not receive email.

**Q:  I'm having problems managing Meteor.users in my social app.  Help?**  

The pattern for social apps involves two publications.  One for yourself, and one for other people.  You'll want something like the following:  

````js
// Publish a person's own user profile to themselves
Meteor.publish('userProfile', function (userId) {
  return Meteor.users.find({_id: this.userId}, {fields: {
    '_id': true,
    'username': true,
    'profile': true,
    'profile.name': true,
    'profile.avatar': true,
    'profile.username': true,

    'profile.favoriteColor': true,
    'profile.selectedTheme': true,

    'profile.address': true,
    'profile.city': true,
    'profile.state': true,
    'profile.zip': true,

    'emails': true,
    'emails[0].address': true,
    'emails.address': true
  }});

});

// Publish the user directory which everbody can see
Meteor.publish("usersDirectory", function () {
  return Meteor.users.find({}, {fields: {
    '_id': true,
    'username': true,
    'profile': true,
    'profile.name': true,
    'profile.avatar': true,
    'profile.username': true,

    'emails': true,
    'emails[0].address': true,
    'emails.address': true
  }});
});
````
Note that the profile details, such as address and theme preferences will only be visible to an individual user, and won't be visible to people browsing the user directory.  


======================================
#### Licensing

MIT.  Use as you will.  
