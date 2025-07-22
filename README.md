# Question Generator
## Setup
Add `OPENAI_API_KEY` to `./server/.env`. Make sure your key has available credits.

Run `npm install`.

## Run application
### Frontend:
```
cd client && npm install
npm run dev
```

Exit with Ctrl+C.

### Backend:
```
cd server && npm install
npm run dev
```

Shut backend server off with:
```
PORT=3002
lsof -n -i:$PORT | grep LISTEN | awk '{ print $2 }' | xargs -I pid kill pid
```

## Testing
You can run curl against our POST endpoint with:
```
curl -X POST http://localhost:3002/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Algebra"}'
```