# Chat API — How the AI Chatbot Works

This is a plain-English guide to the `/api/chat` endpoint
(see `app/Http/Controllers/API/ChatController.php`).

The chatbot answers customer questions about the restaurant menu.
It does **not** run any AI itself — it sends the menu + the question to
**Google Gemini** and passes Gemini's answer back to the frontend.

---

## The big picture

```
Frontend (React)                 Our Laravel server                 Google Gemini
     |                                  |                                |
     |  POST /api/chat                  |                                |
     |  { message, history }  -------->  |                                |
     |                                  |  1. validate input             |
     |                                  |  2. read API key from .env     |
     |                                  |  3. load menu from database    |
     |                                  |  4. build the prompt           |
     |                                  |  5. send prompt  ------------->  |
     |                                  |                                |  (AI thinks)
     |                                  |  <-----------  JSON answer      |
     |                                  |  6. pull the text out          |
     |  <--------  { reply }            |                                |
```

---

## The 7 steps (matches the comments in the controller)

1. **Validate** — make sure the request actually contains a `message`
   (and that `history`, if sent, has the right shape). Bad data is rejected.
2. **Read the secret key** — the Gemini API key is stored in `.env` and read
   via `config()`. Secrets are never written directly in code.
3. **Load the menu** — fetch all products (with their categories) from the database.
4. **Build the prompt** — turn the menu into text, write the AI's instructions
   ("system prompt"), and stack up the conversation so the AI has context.
5. **Call Gemini** — send all of that to Google over HTTP and wait for a reply.
6. **Handle the response** — if Gemini errored, show why; otherwise dig the
   answer text out of its JSON.
7. **Return** — send `{ "reply": "..." }` back to the frontend.

---

## How the chatbot "remembers" the conversation

**Key idea: the AI has no memory.** Every request to Gemini is brand new.

The way a chat *feels* continuous is that we re-send the whole conversation
every time. That is what the `history` field is for.

- `role: "user"`  = something the customer said
- `role: "model"` = something the AI said back

Each new request = all the past turns **+** the new message.

---

## Request format

`POST /api/chat`

### First message of a chat (no history yet)
```json
{
  "message": "Do you have pizza?"
}
```

### Later messages (include everything said so far)
```json
{
  "message": "How much is it?",
  "history": [
    { "role": "user",  "text": "Do you have pizza?" },
    { "role": "model", "text": "Yes, we have Margherita pizza." }
  ]
}
```

## Response format
```json
{
  "reply": "The Margherita pizza is $8."
}
```

## Error response (example: out of free quota)
```json
{
  "error": "Gemini API request failed.",
  "status": 429,
  "details": { "error": { "message": "You exceeded your current quota..." } }
}
```

---

## Testing it in Postman

Because Postman sends each request on its own, **you** must supply the history
to test memory:

1. Send request #1 with just a `message`. Copy the `reply` you get back.
2. Send request #2 with a new `message` **and** a `history` array, pasting
   request #1's message and reply into it (see the "Later messages" example above).

In the real React app this is automatic — the frontend keeps the `history`
array in state and rebuilds it after every message, so a person never does this by hand.

---

## Configuration

In `.env`:
```
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.5-flash     # optional; this is the default
```

After changing `.env`, run:
```
php artisan config:clear
```

**Note on models:** the free tier had `limit: 0` for `gemini-2.0-flash`, which
caused 429 errors. We use `gemini-2.5-flash`, which the free tier allows.
The free tier still has rate limits (requests per minute/day), so heavy use
can still hit a 429.

---

## Where to learn each piece

| Step in the code        | Concept                  | Docs |
|-------------------------|--------------------------|------|
| Validate                | Input validation         | https://laravel.com/docs/validation |
| Read the key            | Config & .env            | https://laravel.com/docs/configuration |
| Load the menu           | Eloquent ORM / eager load| https://laravel.com/docs/eloquent-relationships |
| Build the prompt        | Prompt engineering       | https://ai.google.dev/gemini-api/docs/prompting-strategies |
| Call Gemini             | Laravel HTTP client      | https://laravel.com/docs/http-client |
| Gemini request shape    | Gemini text generation   | https://ai.google.dev/gemini-api/docs/text-generation |
| Handle the response     | Error handling           | https://laravel.com/docs/http-client#error-handling |

Best starting point if you're new to Laravel: the free **Laravel Bootcamp**
(https://bootcamp.laravel.com).
