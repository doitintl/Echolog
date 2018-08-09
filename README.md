# Echolog

## General
There are cases in which you want to better understand which requests you are getting from 3rd party systems and what is the payload which comes with it..

While you can find some great tools out there which allow you to see the payload of a single request, getting heavy traffic to these tools might become challenging.

Echolog allows you to log all the request's payload to [Google's Stackdriver](https://cloud.google.com/stackdriver/) and see the content of the last payload in [Google's Firebase](https://cloud.google.com/stackdriver/).


## Setup
[![Open in Cloud Shell][shell_img]][shell_link]

[shell_img]: http://gstatic.com/cloudssh/images/open-btn.png
[shell_link]: https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/doitintl/Echolog&page=editor&open_in_editor=README.md

Make sure you have the [Google Cloud SDK](https://cloud.google.com/sdk/) installed. You'll need this to test and deploy your App Engine app.

### Authentication
* Create a project in the [Firebase console](https://firebase.google.com/console)
* For running the sample locally, you'll need to download a service account to provide credentials that would normally be provided automatically in the App Engine environment. Click the gear icon in the Firebase Console and select 'Permissions'; then go to the 'Service accounts' tab. Download a new or existing App Engine service account credentials file. Then set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to the path to this file:

		export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json

This allows the server to create unique secure tokens for each user for Firebase to validate.

### Install dependencies
Before running or deploying this application, install the dependencies using [pip](http://pip.readthedocs.io/en/stable/):
```
mkdir lib
pip install -t lib/ -r requirements.txt
```

## Running the app locally
```
dev_appserver.py .
```
    
### Deploy the app
To deploy your version into your project run:
```
gcloud app deploy app.yaml dispatch.yaml
```

### Viewing the logs
All the payload logs are under Global resources in the Echolog logs.

### Notes:
Due to [Google's Stackdriver pricing policy](https://cloud.google.com/stackdriver/pricing_v2) you might want to create a separate project for this tool and enable Stackdriver only on this project.