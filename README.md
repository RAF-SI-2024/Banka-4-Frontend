# RAFeisen backend
## Starting a backend configured for E2E tests
To start a backend configured for E2E tests, provide a `.env` file of the
following form:

```conf
# -*- conf -*-
EXCHANGERATE_API_KEY=776879617265796f7572656164696e6774686973
ALPHAVANTAGE_API_KEY=someexamplegoeshere

# Optional:
# MUCENJE_PORT=1234
```

Then you can run `docker compose up` to start the backend.  By passing `-d`,
the run will be detached, and stay in the background instead.

A full-ish deployment of the frontend will be set up on
`localhost:${MUCENJE_PORT:-8080}`.
