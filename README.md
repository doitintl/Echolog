# echolog

Echolog is an Google App Engine applications which receives GET or POST request, logs the JSON payload to the Stackdriver Logging and displays the last received request in simplistic UI based on Firebase Realtime Database.

**Install dependencies**

```
mkdir lib
pip install -r requirements.txt
pip install -t lib/ -r requirements.txt
```

**Deploy the app**

```
gcloud app deploy app.yaml dispatch.yaml
```
