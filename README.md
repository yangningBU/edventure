# Exercise Generator - Edventure
## Setup
Add `OPENAI_API_KEY` to `./server/.env`. Make sure your key [has available credits](https://platform.openai.com/settings/organization/billing/overview).

### From Zipfile
Nothing! Your dependencies are already bundled with the application.

### From Repo
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
Will run on port `5173`. Exit with Ctrl+C.

### Backend:
```
cd server && npm run dev
```
Will run on port `3002`.
If this port is already occupied, update the VITE_API_HOST in the `.env` file in the `client` project to point to the correct port for the server.

Shutdown backend server off with:
```
PORT=3002
lsof -n -i:$PORT | grep LISTEN | awk '{ print $2 }' | xargs -I pid kill pid
```

## Testing
You can run curl against our POST endpoint with:
```
curl -X POST http://localhost:3002/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"trees"}'
```

## Notes
API docs for Open AI REST API are [here](https://platform.openai.com/docs/overview).