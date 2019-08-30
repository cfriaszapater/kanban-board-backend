# express-locallibrary

<https://en-express-locallibrary.herokuapp.com/catalog>

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

## Build with docker (for fun)

Eg for "0.2.0-heroku" tag:

```sh
docker build -t koldraj/express-locallibrary:0.2.0-heroku .
```

## Run with docker (for fun)

```sh
docker run --name express-locallibrary -p 3000:3000 -d koldraj/express-locallibrary:0.2.0-heroku
```
