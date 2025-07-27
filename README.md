# AI Exercise Generator
## Setup
Add `OPENAI_API_KEY` to `./server/.env`. Make sure your key [has available credits](https://platform.openai.com/settings/organization/billing/overview). Although it is a security no-no, I've included my own API key in this bundle so that you can run the application without issues. I will disabled it after the interview process.

### From Zipfile
Nothing to do! Your dependencies are already bundled with the application.

### From Repo
Code available at http://github.com/yangningBU/edventure.

Add your `.env` file to `./client` with:
```
VITE_API_HOST=http://localhost:3002
```

Install dependencies:
```
cd server && npm install
cd ../client && npm install
cd ..
```

## Run application
### Frontend:
```
cd client
npm run dev
```
Will run in watch mode on port `5173`.

### Backend:
```
cd server
npm run dev
```
Will run on port `3002`.

## Testing
You can test the Open AI call without the frontend using:
```
curl -X POST http://localhost:3002/generate-questions \
  -H "Content-Type: application/json" \
  -d '{ "prompt":"trees" }'
```

## Design Decisions
As React, Express, and Tailwind were requirements of the project, the technology and stack were already decided - I built the frontend using Vite which is the current standard for React projects and the backend was a simple single-endpoint API server using Express. The Open AI API was also a requirement. There seemed to be some ambiuity around whether or not the responses vs chat completions endpoints were better suited for this task. After consideration of the Open AI API docs, it becamse apparent that chat completions were the recommended choice. I set up the project scaffolding using Cursor and then implemented the actual features myself. I'd never used Tailwind before but I started getting the hang of it as I went along. It certainly made changing the layout provided by Cursor much easier. My biggest unresolved challenge is that requests to the Open AI API take longer than expected (now around 15-20sec). I was able to shorten the time by reducing the prompt token count and using a structured schema for the output but I think this can still be optimized.
