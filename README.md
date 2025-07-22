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
  -d '{"prompt":"Algebra"}'
```

## Development Process
I used Cursor to bootstrap the basic application including server and client using React, Express, and Tailwind. I refactored the generated code and implemented many of the features.

This was the prompt I used to bootstrap:
>Build me a fullstack web app written in React, Tailwind, and Express that takes in a prompt from the user and calls the Open AI REST API. The server should return a payload of ten exercise questions that each contain a) the question, b) four answer choices as strings, and c) the correct answer given by a number or letter. The UI should include an input for the prompt, and display the corresponding questions returned from the Open AI REST API. The user should be able to select answers and submit the result to the server. The user should see their score after submitting responses.

Immediately there were problems. Tailwind's configuration with Vite was half-implemented with and without PostCSS. It was also implemented using syntax from both Tailwind 3 and 4. Once I corrected this I was able to load the application.

The content on the page was nearly invisible. Apparently Cursor decided to render white on white. Removing two tailwind classnames resolved the issue.

I had no credits with OpenAPI so the POST request kept failing until I added credits. Additionally, there were logical errors in the way answers were recorded and scored. Once I fixed these I had a working end-to-end application that returned a single exercise set.

I use Gen AI tools to handle code changes that require a lot of heavy lifting but don't by themselves represent any complex logic. For instance I used Cursor to add three tabs one for each level and make the exercise set a collection of three tabs. However I implemented the changes to the API that handles the prompt changes to support tiered exercises myself. When I tried to get Cursor to do it, it introduced messy, broken code that didn't even concern the requested feature. I removed the changes and implemented the desired changes myself. In my experience, small, targeted fixes are handled really well by the developer - it's quick and efficient while minimizing unnecessary changes to source files. Gen AI has a tendency to make many unnecessary changes to achieve a goal, often that have no bearing on the intended logic but introduce a plethora of bugs and compatibility issues. AI coding is better at "busy work" like adding a new endpoint or generating test files.

I noticed also that the data coming back from ChatGPT was sometimes erroneous. For mathematical subjects provided as prompts such as Algebra or Calculus, errors were sprinkled throughout the results. More qualitative subjects such as History and Geography seemed to do much better.

I played around with the prompt wording a fair amount to try and make it clear that one answer option had to be the correct answer to the question and that the other options were merely foils. I got mostly good results. It's not a surprise that ChatGPT makes mistakes (this is a known limitation of the technology) but it was interesting to see how this varied by subject.

The core requirements were satisfied across two days of development. Bonus features were added in the remaining week as permitted.

## Notes
API docs for Open AI are [here](https://platform.openai.com/docs/overview).