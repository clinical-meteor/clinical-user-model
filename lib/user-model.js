import SimpleSchema from 'simpl-schema';
import { get } from 'lodash';

/**
 * @summary Represents a User
 * @class User
 * @param {Object} document An object representing a conversation ususally a Mongo document
 */
User = BaseModel.extend();

//Assign a reference from Meteor.users to User.prototype._collection so BaseModel knows how to access it
User.prototype._collection = Meteor.users;

User.prototype.constructor = function(document){
  if (document) {
    Object.assign(this, document);
  }
}

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
    // if we're using Auth0
  if (get(this, 'services.auth0')) {
    return get(this, 'services.auth0');

    // if we're using an HL7 FHIR HumanName resource
  } else if (get(this, 'profile.name.text')){
    // the following assumes a Person, RelatedPerson, or Practitioner resource
    // which only has a single name specified
    return get(this, 'profile.name.text');

  } else if (get(this, 'profile.name[0].text')){
    // the following assumes a Patient resource
    // where multiple names and aliases may be specified
    return get(this, 'profile.name[0].text')

    // if we're using traditional Meteor naming convention
  } else if (get(this, 'profile.fullName')){
    return get(this, 'profile.fullName');
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
  if(get(this, 'profile.name[0].given')){
    // if we're using an HL7 FHIR HumanName resource
    return get(this, 'profile.name[0].given');
  } else if (get(this, 'profile.fullName')){
    // if we're using traditional Meteor naming convention
    var fullName = get(this, 'profile.fullName');
    var names = fullName.split(" ");
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
  if (get(this, 'profile.name[0].family')) {
    // if we're using an HL7 FHIR HumanName resource
    return get(this, 'profile.name[0].family');
  } else if (get(this, 'profile.fullName')){
    // if we're using traditional Meteor naming convention
    var fullName = get(this, 'profile.fullName');
    var names = fullName.split(" ");
    return names[names.length - 1];
  } else {
    return "";
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
  return get(this, 'emails[0].address');
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

  if (get(this, 'services.google.email')) {
    result.push(get(this, 'services.google.email'));
  }

  if (result.length > 0){
    return result;
  } else {
    return [];
  }
};


User.prototype.getPrimaryEmail = function () {
  if (this.emails) {
    return get(this, 'emails[0].address');
  } else {
    return "";
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
}



//==============================================================================
// This is a FHIR extension

UserIdExtension = new SimpleSchema({
  "userId": {
    optional: true,
    type: String
  }
});
