App = Ember.Application.create();

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

App.Router.map(function() {
  // put your routes here
  this.resource('users');
  this.resource('user', { path: '/users/:user_id' });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return ['red', 'yellow', 'blue', 'green'];
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
