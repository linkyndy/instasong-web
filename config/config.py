import os

class Config(object):
	SECRET_KEY = os.environ['SECRET_KEY']
	SESSION_COOKIE_NAME = os.environ['SESSION_COOKIE_NAME']
	FACEBOOK_APP_ID = os.environ['FACEBOOK_APP_ID']
	FACEBOOK_APP_SECRET = os.environ['FACEBOOK_APP_SECRET']
	URL_SUGGEST = os.environ['URL_SUGGEST'] + '?api_secret=%s&access_token=%s'
	API_SECRET = os.environ['API_SECRET']
	DEBUG = os.environ['DEBUG']