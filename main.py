import json
import webapp2
import httplib2
from oauth2client.client import GoogleCredentials
from google.appengine.api import app_identity
from google.cloud import logging

client = logging.Client()
logger = client.logger('echolog')

_FIREBASE_SCOPES = [
	'https://www.googleapis.com/auth/firebase.database',
	'https://www.googleapis.com/auth/userinfo.email']

object_json_url = "https://{0}.firebaseio.com/payload.json".format(app_identity.get_application_id())
object_string_url = "https://{0}.firebaseio.com/payload-string.json".format(app_identity.get_application_id())


def _get_http():
	http = httplib2.Http()
	creds = GoogleCredentials.get_application_default().create_scoped(_FIREBASE_SCOPES)
	creds.authorize(http)
	return http


def firebase_update(path, value=None):
	try:
		if value:
			response, content = _get_http().request(path, method='PUT', body=value)
		else:
			response, content = _get_http().request(path, method='DELETE')
	except Exception as e:
		logger.log_text(e)
		content = '{}'

	return json.loads(content)


class Echolog(webapp2.RequestHandler):
	def get(self):
		self.post()

	def post(self):
		try:
			# Write to stackdriver
			logger.log_text(self.request.body, severity="INFO")

			# Write to Firebase
			firebase_update(object_json_url, value=self.request.body)
			firebase_update(object_string_url, value=json.dumps(self.request.body))
		except Exception as e:
			logger.log_text(e)


app = webapp2.WSGIApplication([('/echolog', Echolog), ], debug=True)
