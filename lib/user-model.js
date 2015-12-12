/**
 * @summary Represents a User
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
 * @summary The personal name of the user account.
 * @memberOf User
 * @name displayName
 * @version 1.2.3
 * @returns {String} A name representation of the user account
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * console.log(selectedUser.displayName());
 * ```
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

/**
 * @summary Check if the this user is the current logged in user or the specified user.
 * @memberOf User
 * @name isSelf
 * @version 1.2.3
 * @returns {String}
 */

User.prototype.isSelf = function (user) {
  var userId = user && user._id || Meteor.userId();

  if (this._id === userId) {
    return true;
  }
};



/**
 * @summary Whether the person is associated with a collaboration.  Helps in determining if an account is newly created, a patient, research subject, or member of a clinical collaboration.  An account that is a member of a collaboration will typically have more access, but will have regulatory oversite and auditing (i.e. subject to HIPAA tracking and auditing).
 * @memberOf User
 * @name isMemberOfAnyCollaboration
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.isMemberOfAnyCollaboration()){
 *   Hipaa.logEntry('A team collaborator did something that requires logging.')
 * } else {
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */
User.prototype.isMemberOfAnyCollaboration = function (){
  if (this.profile && this.profile.collaborations && this.profile.collaborations.length > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Whether the person is associated with a collaboration or a new user.
 * @memberOf User
 * @name hasNoCollaborations
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.hasNoCollaborations()){
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */
User.prototype.hasNoCollaborations = function (){
  if (this.profile && (this.profile.collaborations === undefined) || (this.profile.collaborations.length === 0)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Determines if a user is associated with a specific collaboration.
 * @memberOf User
 * @name isMemberOfCollaboration
 * @param collaborationId The MongoId of the collaboration.
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * if(selectedUser.hasNoCollaborations()){
 *   Router.go('/path/to/collaboration/signup');
 * };
 * ```
 */
User.prototype.isMemberOfCollaboration = function (collaborationId){
  var result = false;

  var specifiedCollaboration = Collaborations.findOne({_id: collaborationId});

  if (specifiedCollaboration.hasMember(this.defaultEmail())) {
    return true;
  } else {
    return false;
  }
};

/**
 * @summary Gets an array of all the collaborations that a user is associated with.
 * @memberOf User
 * @name getCollaborations
 * @version 1.2.3
 * @returns {Array}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * selectedUser.getCollaborations().forEach(function(collaboration){
 *   console.log(collaboration.name);
 * });
 * ```
 */
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
      } else {
        return [];
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

  return result;
};


/**
 * @summary Gets the full name of the user.
 * @memberOf User
 * @name fullName
 * @version 1.2.3
 * @returns {String}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * console.log(selectedUser.fullName());
 * ```
 */
User.prototype.fullName = function () {
  if (this.profile){
    return this.profile.fullName;
  } else {
    return "---";
  }
};


/**
 * @summary Gets the given (first) name of the user.
 * @memberOf User
 * @name givenName
 * @version 1.2.3
 * @returns {String}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * console.log(selectedUser.givenName());
 * ```
 */
User.prototype.givenName = function () {
  if (this.profile){
    var names = this.profile.fullName.split(" ");
    return names[0];
  } else {
    return "";
  }
};


/**
 * @summary Gets the family (last) name of the user.
 * @memberOf User
 * @name familyName
 * @version 1.2.3
 * @returns {String}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * console.log(selectedUser.familyName());
 * ```
 */
User.prototype.familyName = function () {
  if (this.profile){
    var names = this.profile.fullName.split(" ");
    return names[names.length - 1];
  } else {
    return "---";
  }
};

/**
 * @summary Gets the default email that an account is associated.  Defined as the first verified email in the emails array.
 * @memberOf User
 * @name defaultEmail
 * @version 1.2.3
 * @returns {String}
 * @example
 * ```js
 * var selectedUser = Meteor.users.findOne({username: "janedoe"});
 * console.log(selectedUser.defaultEmail());
 * ```
 */
User.prototype.defaultEmail = function () {
  return this.emails && this.emails[0].address;
};

/**
 * Get the default email address for the user
 * @method defaultEmail
 * @returns {String} The users default email address
 */
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
    /**
     * @summary Write all the User collaborations to the server console log.
     * @locus Server
     * @memberOf User
     * @name /testGetCollaborations
     * @version 1.2.3
     * @returns {Array}
     * @example
     * ```js
     * Meteor.call('testGetCollaborations');
     * ```
     */
    testGetCollaborations:function (user){
       console.log('testGetCollaborations');
       var user = Meteor.users.findOne({_id: user._id});
      //  console.log('isAlive', user.isAlive());
       console.log('getAllCollaborations', user.getAllCollaborations(user));
       //user.getAllCollaborations(user);
    }
  });

  // refreshUserProfileCollaborations = function (){
  //   User.getAllCollaborations().forEach(function(collaboration){
  //
  //   })
  // }

  /**
   * @summary Parses the collaborations graph, and returns a list of all collaborations that a user has reciprical access to.  Uses a transitive closure algorithm to walk the collaboration graph.
   * @locus Server
   * @memberOf User
   * @name getAllCollaborations
   * @version 1.2.3
   * @returns {Array}
   * @example
   * ```js
   * var selectedUser = Meteor.users.findOne({username: "janedoe"});
   * selectedUser.getAllCollaborations().forEach(function(collaborationName){
   *   console.log(collaborationName);
   * });
   * ```
   */
  User.prototype.getAllCollaborations = function () {
    process.env.DEBUG && console.log('getAllCollaborations', JSON.stringify(this));

    // TRANSITIVE CLOSURE QUEUE METHOD

    // put each email in our search queue
    var collaborationSet = {};

    var collaborationLookupQueue = this.getEmails();
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

    return Object.keys(collaborationSet).sort();
  };


  /**
   * @summary Makes sure the user account is synchronized with the current User model.  Basically a save() function for collaborations.
   * @locus Anywhere
   * @memberOf User
   * @name syncCollaborations
   * @version 1.2.3
   * @example
   * ```js
   * var selectedUser = Meteor.users.findOne({username: "janedoe"});
   * selectedUser.syncCollaborations();
   * ```
   */
  User.prototype.syncCollaborations = function () {
    Meteor.users.update(this._id, {
      $set: {
        "profile.collaborations": this.getAllCollaborations()
      }
    });
  };



}
