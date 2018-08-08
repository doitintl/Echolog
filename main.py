import json
import webapp2
import logging
import httplib2
from oauth2client.client import GoogleCredentials
from google.appengine.api import app_identity

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


def firebase_put(path, value=None):
	response, content = _get_http().request(path, method='PUT', body=value)
	return json.loads(content)


class Echolog(webapp2.RequestHandler):
	def get(self):
		self.post()

	def post(self):
		# Write to stackdriver
		logging.info(self.request.body)

		# Write to Firebase
		firebase_put(object_json_url, value=self.request.body)
		firebase_put(object_string_url, value=json.dumps(self.request.body))


app = webapp2.WSGIApplication([('/echolog', Echolog), ], debug=True)
