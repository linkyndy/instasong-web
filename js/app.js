App = Ember.Application.create();

FB.init({ appId: '122948994571840' });

Ember.Application.initializer({
  name: 'authentication',
  before: 'simple-auth',
  initialize: function(container, application) {
    application.register('authenticator:facebook', App.FacebookAuthenticator);
  }
});

App.FacebookAuthenticator = SimpleAuth.Authenticators.Base.extend({
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.accessToken)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.getLoginStatus(function(fbResponse) {
        if (fbResponse.status === 'connected') {
          Ember.run(function() {
            resolve({ accessToken: fbResponse.authResponse.accessToken });
          });
        } else if (fbResponse.status === 'not_authorized') {
          reject();
        } else {
          FB.login(function(fbResponse) {
            if (fbResponse.authResponse) {
              Ember.run(function() {
                resolve({ accessToken: fbResponse.authResponse.accessToken });
              });
            } else {
              reject();
            }
          });
        }
      });
    });
  },
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      FB.logout(function(response) {
        Ember.run(resolve);
      });
    });
  }
});

App.ApplicationStore = DS.Store.extend({

});

App.ApplicationAdapter = DS.ActiveModelAdapter.extend({
});

App.User = DS.Model.extend({
  facebookId: DS.attr('string'),
  accessToken: DS.attr('string')
});

App.UserSerializer = DS.RESTSerializer.extend({
  primaryKey: 'facebook_id'
});

App.Suggestion = DS.Model.extend({
  user: DS.belongsTo('user'),
  artist: DS.belongsTo('artist'),
  song: DS.belongsTo('song')
});

App.Artist = DS.Model.extend({
  facebook_id: DS.attr('string'),
  echonest_id: DS.attr('string'),
  spotify_id: DS.attr('string'),
  name: DS.attr('string')
});

App.Song = DS.Model.extend({
  echonest_id: DS.attr('string'),
  spotify_id: DS.attr('string'),
  soundcloud_id: DS.attr('string'),
  name: DS.attr('string')
});

App.Router.map(function() {
  // put your routes here
  this.resource('users');
  this.resource('user', { path: '/users/:user_id' });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue'];
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('suggestion', null);
  },
  actions: {
    authenticateWithFacebook: function() {
      this.get('session').authenticate('authenticator:facebook', {});
    },
    invalidateSession: function() {
      this.get('session').invalidate();
    },
    getSuggestion: function() {
      this.controller.set('suggestion', this.store.find('suggestion'));
    }
  }
});

App.UsersRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('user');
  }
});

App.UserRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});
