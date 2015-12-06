/**
 * @summary Gets the full name of the user.
 * @memberOf User
 * @name {{fullName}}
 * @version 1.2.3
 * @returns {String}
 * @example
 * ```html
 * <div>{{fullName}}</div>
 * ```
 */
 Template.registerHelper("fullName", function (argument){
  return Meteor.user().fullName();
});
