# kanban-board-backend

<https://bs-kanban-board-backend.herokuapp.com> (requires authentication, so better go to the frontend URL, see below).

Kanban board backend REST API with mongoDB datastore, built with node + express. Features jwt token authentication.

See the frontend application at [kanban-board](https://github.com/cfriaszapater/kanban-board).

## Development

If you want to run it locally:

### Build

```sh
npm install
```

### Test

```sh
npm test
```

### Set MONGODB_URI

You can put the URI in a file named `.dev-mongodb-uri` in the root of the project and it will be automatically picked up by the run script in dev env (see below).

The URI looks like this, substituting `<user>`, `<pass>` and `cluster0-pmxkl.azure.mongodb.net` with your own (*):

`mongodb+srv://<user>:<pass>@cluster0-pmxkl.azure.mongodb.net/kanban_board?retryWrites=true&w=majority`

(*) You can create a cloud mongodb account in the free tier and use it.

### Run

In dev (debug log and monitor file changes):

```sh
DEBUG=kanban-board-backend:* npm run devstart | bunyan
```

### Deploy to production

This is what I used to deploy to production (having an heroku account and git heroku remote set to point to it):

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

### Build with docker (for fun)

Not used for current deploy to production, provided here in case you want to use it to deploy as a docker container somewhere:

Eg for "0.2.0-heroku" tag:

```sh
docker build -t koldraj/kanban-board-backend:0.2.0-heroku .
```

### Run with docker (for fun)

If you want to run it locally with docker:

```sh
docker run --name kanban-board-backend -p 8080:8080 -d koldraj/kanban-board-backend:0.2.0-heroku
```

## Authentication

POST a valid user and password to `/user/token` to get a bearer token.

## License

See [LICENSE](./LICENSE).
