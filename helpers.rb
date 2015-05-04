helpers do
  def logged_in?
    !!session['access_token']
  end
end
