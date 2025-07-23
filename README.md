# Question Generator - Edventure
## Setup
Add `OPENAI_API_KEY` to `./server/.env`. Make sure your key [has available credits](https://platform.openai.com/settings/organization/billing/overview).

Run `npm install`.

## Run application
### Frontend:
```
cd client && npm install
npm run dev
```
Will run on port `5173`. Exit with Ctrl+C.

### Backend:
```
cd server && npm install
npm run dev
```
Will run on port `3002`. If this port is occupied update the `.env` file in the client project to point to the correct port for the server.

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
  -d '{"prompt":"trees"}'
```

## Development Process
I used Cursor to bootstrap the basic application including server and client using React, Express, and Tailwind. I refactored the generated code and implemented the remaining features.

The core requirements were satisfied across two days of development. Bonus features were added the following two days.

I added some tests that weren't required but just felt right to do. All in all I really enjoyed the assignment.

## Notes
API docs for Open AI are [here](https://platform.openai.com/docs/overview).