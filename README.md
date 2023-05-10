# Party vote app

Create a game, add some items, ask people to vote!

## Developing

### Install dependencies
```bash
npm install
```

### Run app in dev mode
```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
docker build -t party-vote .
```

## Running

```bash
docker run -p 3000:3000 party-vote
```
