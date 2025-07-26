# AI Exercise Generator
## Setup
Add `OPENAI_API_KEY` to `./server/.env`. Make sure your key [has available credits](https://platform.openai.com/settings/organization/billing/overview). For security purposes I excluded the contents of my actual API key as I assume you all have a valid key yourselves.

### From Zipfile
Nothing to do! Your dependencies are already bundled with the application.

### From Repo
Add your `.env` file to `./client` with:
```
VITE_API_HOST=http://localhost:3002
```

Install dependencies:
```
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

## Run application
### Frontend:
```
cd client && npm run dev
```
Will run in watch mode on port `5173`.

### Backend:
```
cd server && npm run dev
```
Will run on port `3002`.

## Testing
You can test the Open AI call without the frontend using:
```
curl -X POST http://localhost:3002/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"trees"}'
```

## Notes
API docs for Open AI REST API are [here](https://platform.openai.com/docs/overview).
