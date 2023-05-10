# Party vote app

Create a game, add some items, ask people to vote!

This is a quick hack written in a couple of afternoons. It was an opportunity to learn SvelteKit and try out Tailwindcss with some help from AI assistants.

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
