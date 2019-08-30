# kanban-board-backend

<https://bs-kanban-board-backend.herokuapp.com>

Kanban board backend REST API built with node + express.

## Build

```sh
npm install
```

## Run

In dev (debug log and monitor file changes):

```sh
DEBUG=kanban-board-backend:* npm run devstart | bunyan
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
docker build -t koldraj/kanban-board-backend:0.2.0-heroku .
```

## Run with docker (for fun)

```sh
docker run --name kanban-board-backend -p 3000:3000 -d koldraj/kanban-board-backend:0.2.0-heroku
```
