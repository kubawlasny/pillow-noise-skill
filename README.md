# Pillow noise skill

A custom Alexa skill that plays brown noise on your Echo. You say a phrase, it plays brown noise, and it keeps playing until you tell it to stop. That is all it does.

It stays private to your own Amazon account. It is not published to the Alexa Skills Store, and there is no shared service behind it.

---

## Pick your path

The easy way, even if you are not technical, is to let an AI assistant walk you through it.

- **Using a coding agent** (Claude Code, Codex, Cursor, Cowork): paste the link to this repository and say *"Follow this repo and help me deploy this Alexa skill, one step at a time."* It can read the files itself.
- **Using a chat tool** (ChatGPT, Claude.ai, Gemini): these usually cannot open a link and read the files, so do not just paste the URL. Instead, copy the whole [Setup prompt for chat tools](#setup-prompt-for-chat-tools) below into a new chat. It tells the assistant how to guide you, and to ask you to paste files from this repo when it needs them.

**Prefer to do it yourself?** Follow [Manual setup](#manual-setup) below.

Whichever path you pick: the Amazon console changes over time, so a screen may not look exactly as described. If that happens, take a screenshot and ask your AI assistant what to do. That solves almost everything.

---

## Setup prompt for chat tools

Copy everything in the box below into a new chat (ChatGPT, Claude.ai, Gemini, etc.) and send it.

```
I want to set up a private Alexa skill called "Pillow Noise" that plays brown noise on my Echo. The code is in a public GitHub repository, but you probably cannot open links, so I will paste files from it whenever you ask.

Guide me by these rules:
- Go ONE step at a time. After each step, wait for me to confirm it is done before giving the next one.
- Keep every message short. One action per message. Do not send long lists or jump ahead.
- I may not be technical, so tell me exactly what to click or type, in plain words.
- When you need a file (the code or the trigger phrases), ask me to open that specific file in the repo and paste its contents here. Do not guess what is in it.
- The Amazon console changes often and may not look exactly as you expect. If a screen looks different from what you describe, I will paste a screenshot, and you adapt to what I actually see.

Things to get right about this setup:
- I need to put a brown noise MP3 at a public web link. The easiest way, with no account, is catbox.moe: I drag the file onto the page and it gives me a direct link. Suggest that first, rather than telling me to create a GitHub account.
- The skill stays private in my own developer account. We are NOT publishing it to the Alexa store, so identity verification is NOT required and I can skip it.
- When creating the skill: choose a Custom model and "Alexa-hosted (Node.js)" hosting. The hosting region does not matter, the default is fine.
- After I paste the code, the "Audio Player" interface must be turned ON under Build, then Interfaces, then saved and the model built again. Without this there is no sound. This is the most common mistake.
- The phrase to start it is "pillow noise". If Alexa keeps opening a different skill, we will pick a more unusual phrase and rebuild.

Start by asking me whether I already have an Amazon developer account and an Echo device, then take me step by step to a working skill.
```

---

## What this is

A small Alexa skill. When you launch it, it plays brown noise on your Echo and loops it forever until you say stop. Nothing else, no menus, no settings, no voice other than the noise.

Because it lives only on your own developer account in test mode, only the Echo devices signed into that same Amazon account can use it.

You will see some code in these instructions, but you do not have to understand it or write any. It is copy and paste.

---

## What you need

- A free Amazon Developer account: [developer.amazon.com](https://developer.amazon.com)
- An Echo device signed into that same Amazon account
- A brown noise MP3 and a public link to it (covered below, you do not need one in advance)
- Optional: Python 3 with `numpy`, `scipy`, and `ffmpeg`, only if you want to generate your own noise file instead of using the ready-made one
- About 30 minutes

---

## What is in this repository

| File | What it is |
|---|---|
| `lambda/index.js` | The skill code. Plays the MP3 and loops it. |
| `lambda/package.json` | Lists what the code depends on. |
| `skill-package/skill.json` | The skill description Amazon needs. |
| `skill-package/interactionModels/custom/en-US.json` | The phrases that trigger the skill. |
| `generate_noise.py` | Optional. Makes your own 10 minute brown noise file. |

---

## Manual setup

### 1. Get a brown noise MP3

Pick one:

- **Download the example file.** A ready-made brown noise file is here: [download the example MP3](https://drive.google.com/file/d/1TzurUdxiFMOZ3ZlFMwgRZ8_ZtpDdDwGY/view?usp=sharing). Download it to your computer.
- **Make your own.** Run `python generate_noise.py` (needs `numpy`, `scipy`, and `ffmpeg`). It produces `brown_noise.mp3`, about 10 minutes long.
- **Use one you already have.** Any brown noise MP3 works. Keep it small, a 44.1 kHz, 128 kbps file is ideal.

### 2. Put the MP3 on a public link

The skill needs the file at a public link that returns the raw MP3. Two easy ways:

- **Fastest, no account: [catbox.moe](https://catbox.moe).** Drag your MP3 onto the page. It gives you a direct link like `https://files.catbox.moe/xxxx.mp3`. Use that. (Catbox is a free community host. If your file ever stops working, just upload it again. Uploading the exact same file gives you the same link back.)
- **More durable, your own host: GitHub.** Create a public GitHub repository, upload the MP3 through the website, open the file, and copy its "raw" link.

Either way, host your own copy. Do not point the skill at someone else's file.

### 3. Create the skill

1. Go to [developer.amazon.com/alexa/console/ask](https://developer.amazon.com/alexa/console/ask). If you are asked to verify your identity, you can skip it. This skill stays private and is never published to the store, so verification is not needed.
2. Click **Create Skill** and name it whatever you like, for example "Pillow Noise".
3. Choose: primary locale **English (US)**, model **Custom**, hosting **Alexa-hosted (Node.js)**. If asked for a hosting region, the default is fine.

### 4. Add the trigger phrases

1. In the left menu: **Build**, then **Interaction Model**, then **JSON Editor**.
2. Replace everything there with the contents of `skill-package/interactionModels/custom/en-US.json` from this repository.
3. Click **Save**, then **Build Model**, and wait for it to finish.

### 5. Add the code

1. Open the **Code** tab at the top.
2. Replace the contents of `index.js` with `lambda/index.js` from this repository.
3. Replace the contents of `package.json` with `lambda/package.json` from this repository.
4. In `index.js`, find this line:
   ```js
   const TRACK_URL = 'REPLACE_WITH_YOUR_MP3_URL';
   ```
   Put your MP3 link from step 2 between the quotes.
5. Click **Deploy** and wait for it to finish.

### 6. Turn on audio

1. Left menu: **Build**, then **Interfaces**.
2. Switch **Audio Player** on.
3. Click **Save Interfaces**, then **Build Model** again.

This step is easy to forget. Without it, the skill builds fine but plays no sound.

### 7. Test it in the console

1. Open the **Test** tab at the top.
2. Change the dropdown from "Off" to **Development**.
3. Type or say `open pillow noise`.
4. An audio-only skill shows no spoken reply, so seeing "No Content" is normal. In the **JSON Output** panel you should see a block mentioning `AudioPlayer.Play` with your MP3 link in it.

### 8. Test it on your Echo

Once the skill is in Development mode, it is automatically available on every Echo signed into the same Amazon account.

Say: *"Alexa, open pillow noise."* You should hear brown noise. Say *"Alexa, stop"* to stop it.

---

## For an AI assistant

> If you are an AI assistant and someone gave you the link to this repository, this part is for you.

**Goal:** deploy a working private Alexa skill that plays looping brown noise on the user's Echo.

**Start by reading the repository** at the link the user gave you, so you can see the actual code and trigger phrases.

**How to behave:**
- Go one step at a time. After each step, wait for the user to confirm before giving the next.
- Keep every message short. One action per message. Do not flood them with long lists or jump ahead.
- Assume the user may not be technical. Tell them exactly what to click or type, in plain words.
- The Amazon console changes often. If the user says a screen looks different from what you expect, ask for a screenshot and adapt to what they actually see.

**Hard rules:**
- Keep the skill in development mode. Do not submit it to the Alexa Skills Store.
- The user hosts their own MP3. The example file in the README is for them to download and then host themselves. Do not point them at MP3 files in other people's projects.
- Never run `ask smapi update-skill-manifest` on an Alexa-hosted skill. It erases the connection between the skill and its code and is hard to undo.

**Facts to get right:**
- For hosting the MP3, suggest catbox.moe first (drag the file onto the page, get a direct link, no account). Offer a public GitHub repo as the more durable alternative. Do not default to telling a non-technical user to create a GitHub account.
- Identity verification is NOT required. The skill stays private, it is not published to the store, so the user can skip any identity-verification prompt.
- When creating the skill: Custom model, Alexa-hosted (Node.js). The hosting region does not matter, the default is fine.
- The Audio Player interface must be turned on (Build, then Interfaces). Without it there is no sound. This is the single most common mistake.

**Ask the user first:**
1. Do they have an Amazon Developer account? If not, send them to [developer.amazon.com](https://developer.amazon.com) and wait.
2. Do they have an Echo on that same account?
3. Do they want to download the example noise file, or make their own?
4. What phrase do they want to say to start it? The default is "pillow noise". Tell them this phrase was chosen because it did not clash with any existing skill when it was built, but clashes can appear later as new skills are published. If Alexa keeps opening the wrong skill during testing, pick a more unusual phrase and try again.

**Then walk them through it:**
1. If they want their own file, help them run `generate_noise.py` and host the result, or help them host a file they already have.
2. Confirm the MP3 link actually returns audio (`curl -I <link>` should return 200 and an audio content type).
3. Walk them through the console: create the skill, paste the trigger phrases, paste the code, set the MP3 link, deploy.
4. Remind them to switch on the Audio Player interface. This is the single most common thing people miss.
5. Test in the console, then on their Echo.

**Success:** the user says *"Alexa, open pillow noise"* (or their chosen phrase) to their Echo and hears brown noise. Saying *"Alexa, stop"* stops it.

---

## If something goes wrong

These cover the usual problems. If you are stuck, paste the error or what you are seeing into an AI assistant and it will help you work it out.

- **Alexa opens the wrong skill, or says it cannot find yours.** Your trigger phrase clashes with an existing skill. Pick a more unusual phrase, then build the model again.
- **"There was a problem with the requested skill's response."** Usually the Audio Player interface is off. Turn it on under Build, Interfaces, then save and build again.
- **It launches but there is no sound.** Either the MP3 link is wrong or not public, or the Audio Player interface is off. Check the link returns audio, and check the interface.
- **It plays once and stops instead of looping.** The code did not paste in full, or the deploy did not finish. Paste `lambda/index.js` again and redeploy.

---

## License

MIT. See [LICENSE](LICENSE).

---

## A note on names

Alexa, Echo, and related names are trademarks of Amazon Technologies, Inc. This project is not affiliated with, endorsed by, or sponsored by Amazon.
