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

App.ApplicationAdapter = DS.ActiveModelAdapter.extend({
  host: 'http://104.131.68.183:5000',
  headers: {
    'X-API-Secret': 'i9UDy2WpmN90PoW28Eu1a4Rf'
  }
});

App.User = DS.Model.extend({
  facebookId: DS.attr('string'),
  accessToken: DS.attr('string')
});

App.UserSerializer = DS.RESTSerializer.extend({
  primaryKey: 'facebook_id'
});

App.Suggestion = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  artist: DS.belongsTo('artist', {async: true}),
  song: DS.belongsTo('song', {async: true})
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
  name: DS.attr('string'),
  stream_url: DS.attr('string')
});

App.Router.map(function() {
  // put your routes here
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
      controller = this.controller;
      // TODO: Remove the following variables with proper ones
      facebook_id = '100000521573239';
      tz = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
      this.store.find('suggestion', {facebook_id: facebook_id, tz: tz}).then(function(suggestions) {
          controller.set('suggestion', suggestions.get('firstObject'));
      });
    }
  }
});
