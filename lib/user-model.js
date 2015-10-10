/**
 * Represents a User
 * @class User
 * @param {Object} document An object representing a conversation ususally a Mongo document
 */
User = BaseModel.extend();

//Assign a reference from Meteor.users to User.prototype._collection so BaseModel knows how to access it
User.prototype._collection = Meteor.users;

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Meteor.users._transform = function (document) {
  return new User(document);
};

/**
 * The personal name of the user account, You if the the user represents the
 * currently logged in user, or this.username otherwise
 * @method name
 * @returns {S} A name representation of the user account
 */
User.prototype.displayName = function () {
  return this.isSelf() ? "You" : this.username;
};


User.prototype.isTrue = function () {
  return true;
};


User.prototype.isAlive = function () {
  return true;
};

/**
 * Check if the this user is the current logged in user or the specified user
 * @method isSelf
 * @param   {Object}  user The user to check against
 * @returns {Boolean} Whether or not this user is the same as the specified user
 */
User.prototype.isSelf = function (user) {
  var userId = user && user._id || Meteor.userId();

  if (this._id === userId) {
    return true;
  }
};

/**
 * Get the default email address for the user
 * @method defaultEmail
 * @returns {String} The users default email address
 */
User.prototype.defaultEmail = function () {
  return this.emails && this.emails[0].address;
};

User.prototype.getCollaborations = function () {


  var collaborationLookupQueue = [];
  this.emails.forEach(function (email) {
    collaborationLookupQueue.push(email.address);
  });


  var collaborationSet = {};

  // transitive closure queue method
  for (var i = 0; i < collaborationLookupQueue.length; i++) {
    Collaborations.find({
      collaborators: collaborationLookupQueue[i]
    }, {
      fields: {
        name: 1
      }
    }).forEach(function (col) {
      if (!(col.name in collaborationSet)) {
        collaborationSet[col.name] = col._id;
        collaborationLookupQueue.push(col.name);
      }
    });
  };

  var collaborations = Object.keys(collaborationSet).sort();
  Meteor.users.update(user._id, {
    $set: {
      "profile.collaborations": collaborations
    }
  });
  return collaborations;
};



// getCollaboration
User.prototype.getCollaborations = function () {
  var user = null;

  if (Meteor.isClient) {
    user = Meteor.user();
  }
  if (Meteor.isServer) {
    if (this.userId) {
      user = Meteor.users.findOne({
        _id: this.userId
      });
    }
  }

  var result;

  if (user) {
    if (user.profile) {
      if (user.profile.collaborations) {
        var collaboratorsIncludeSelf = false;
        user.profile.collaborations.forEach(function(collaborator){
          result.push(collaborator);
          if((collaborator === user.username) || (collaborator === user.getPrimaryEmail())){
            collaboratorsIncludeSelf = true;
          }
        });
        if(!collaboratorsIncludeSelf){
          result.push(user.username);
        }
        // user.profile.collaborations.push(user.username);
        // _.map(getEmailsFor(user), function (em) {
        //   user.profile.collaborations.push(em);
        // });
      } else {
        return [];
        // user.profile.collaborations = [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

  return result;
};


// User.prototype.getEmails = function (user) {
//   var response = [];
//
//   if (!user) {
//     user = Meteor.user();
//   }
//
//   if (user) {
//     if (user.emails) {
//       _.map(user.emails, function (a) {
//         response.push(a.address);
//       });
//     }
//     if (user.services && user.services.google && user.services.google.email) {
//       response.push(user.services.google.email);
//     }
//     if (response.length === 0) {
//       return null;
//     }
//
//   } else {
//     return response;
//   }
// };
User.prototype.getEmails = function () {

  var result = [];

  if (this && this.emails) {
    this.emails.forEach(function (email) {
      result.push(email.address);
    });
  }

  if (this.services && this.services.google && this.services.google.email) {
    result.push(this.services.google.email);
  }

  if (result.length > 0){
    return result;
  } else {
    return [];
  }
};


User.prototype.getPrimaryEmail = function () {
  if (this.emails) {
    return this.emails[0].address;
  } else {
    return "---";
  }
};



if (Meteor.isServer) {
  Meteor.methods({
    testGetCollaborations:function (user){
       console.log('testGetCollaborations');
       var user = Meteor.users.findOne({_id: user._id});
      //  console.log('isAlive', user.isAlive());
       console.log('getAllCollaborations', user.getAllCollaborations(user));
       //user.getAllCollaborations(user);
    }
  });

  // refreshUserProfileCollaborations
  User.prototype.getAllCollaborations = function (user) {
    process.env.DEBUG && console.log('getAllCollaborations', JSON.stringify(user));
    if (user === null) {
      return;
    }
    // TRANSITIVE CLOSURE QUEUE METHOD

    // put each email in our search queue
    var collaborationSet = {};

    var collaborationLookupQueue = user.getEmails();
    process.env.DEBUG && console.log('collaborationLookupQueue', collaborationLookupQueue);

    // for each email in our queue
    for (var i = 0; i < collaborationLookupQueue.length; i++) {
      var parent = collaborationLookupQueue[i];

      // look across the collaborations collection for records that contain that email
      Collaborations.find({
        collaborators: parent
      }, {
        fields: {
          name: 1
        }
      }).forEach(function (col) {
        console.log('found a matching record!', col);
        // for each resulting collaboration containing one of the user's email addresses
        // add the collaboration to our resulting list
        if (!(col.name in collaborationSet)) {
          collaborationSet[col.name] = col._id;
          collaborationLookupQueue.push(col.name);
        }
      });
    }
    process.env.DEBUG && console.log('collaborationSet', collaborationSet);


    var sortedCollaborations = Object.keys(collaborationSet).sort();


    //process.env.DEBUG && console.log('sortedCollaborations', sortedCollaborations);

    var ret = Meteor.users.update(user._id, {
      $set: {
        "profile.collaborations": sortedCollaborations
      }
    });
    return sortedCollaborations;
  };

}
