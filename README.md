# express-locallibrary

Local library based on <https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs>

## Build

```sh
npm install
```

## Run

In dev (debug log and monitor file changes):

```sh
DEBUG=express-locallibrary:* npm run devstart | bunyan
```

Standard:

```sh
npm start
```

## Deploy to production

```sh
git push heroku master
heroku open
```

View logs:

```sh
heroku logs --tail
```

Config:

```sh
heroku config
```
