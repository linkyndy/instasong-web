helpers do
  def current_user
    graph = Koala::Facebook::API.new(session['access_token'])
    user_id = graph.get_object('me')['id']
    User.find(user_id)
  end

  def logged_in?
    !!session['access_token']
  end
end
