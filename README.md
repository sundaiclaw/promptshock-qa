# PromptShock QA

AI tool that stress-tests launch pitches and returns attack questions, risky assumptions, and tighter rewrites.

## What it does

Paste launch copy into the app and it uses an OpenRouter free model to return:
- Top attack questions users/investors will ask
- Hidden assumptions and risky claims
- A tighter rewritten version

## How to Run (from zero)

1. Prerequisites
   - Node.js 20+
   - OpenRouter API key
2. `git clone https://github.com/sundaiclaw/promptshock-qa.git`
3. `cd promptshock-qa`
4. `npm install`
5. `OPENROUTER_API_KEY=your_key OPENROUTER_MODEL=google/gemma-3-27b-it:free npm start`
6. Open `http://localhost:8080`

## Limitations / known gaps

- No auth/rate limiting yet
- Single prompt mode (no history)
- Basic UI styling

Build on Sundai Club on March 24, 2026  
Sundai Project: https://www.sundai.club/projects/be7c4bde-adc1-43d5-a7e1-190c34da57ac
