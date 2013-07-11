from flask import Flask, render_template, request, jsonify, session
from flask.ext.assets import Environment, Bundle
import facebook
import requests
import time

app = Flask(__name__)
app.config.from_object('config.config.Config')

assets = Environment(app)

css = Bundle(
	'bootstrap/css/bootstrap.css', 
	'css/flat-ui.css',
	'css/instasong.css',
	output='gen/cached.css'
)
assets.register('css', css)

js_upper = Bundle(
	'js/jquery-1.8.3.min.js',
	output='gen/jquery.js'
)
js_lower = Bundle(
	'js/jquery-ui-1.10.3.custom.min.js',
  'js/jquery.ui.touch-punch.min.js',
  'js/bootstrap.min.js',
  'js/bootstrap-select.js',
  'js/bootstrap-switch.js',
  'js/flatui-checkbox.js',
  'js/flatui-radio.js',
  'js/jquery.tagsinput.js',
  'js/jquery.placeholder.js',
  'js/jquery.stacktable.js',
  'http://vjs.zencdn.net/c/video.js',
  'js/application.js',
	'js/audiojs/audio.js',
	output='gen/cached.js'
)
assets.register('js_upper', js_upper)
assets.register('js_lower', js_lower)

@app.route('/')
def home():
	return render_template('index.html')
	
@app.route('/suggest')
def suggest():
	# Retrieve access_token from session, else try from cookie
	if 'access_token' in session and \
	   'expires' in session and \
	   session['expires'] > time.time():
			access_token = session['access_token']
	else:
		cookie = facebook.get_user_from_cookie(request.cookies, \
		         app.config['FACEBOOK_APP_ID'], app.config['FACEBOOK_APP_SECRET'])
		if cookie is not None:
			access_token = session['access_token'] = cookie['access_token']
			session['expires'] = time.time() + float(cookie['expires'])
		else:
			return jsonify({
				'type': 'error',
				'message': 'Could not retrieve access_token. Please refresh the page.'
			})
	
	return jsonify(requests.get(app.config['URL_SUGGEST'] % (app.config['API_SECRET'], access_token)).json())
	
if __name__ == "__main__":
    app.run()