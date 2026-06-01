# Pillow noise skill

A custom Alexa skill that plays brown noise on your Echo. You say a phrase, it plays brown noise, and it keeps playing until you tell it to stop. That is all it does.

It stays private to your own Amazon account. It is not published to the Alexa Skills Store, and there is no shared service behind it.

---

## Pick your path

The easy way, even if you are not technical, is to let an AI assistant walk you through it.

- **Coding agent** (Claude Code, Codex, Cursor, Cowork): paste the link to this repository and say *"Follow this repo and guide me through deploying this Alexa skill, one step at a time."* It can read the files itself.
- **Chat tool** (ChatGPT, Claude.ai, Gemini): these usually cannot open a link, so do not just paste the URL. Either paste this whole README into a new chat, or copy just the [all-in-one prompt](#all-in-one-prompt-for-an-ai-assistant) at the bottom. Then send it.
- **Do it yourself:** follow [Manual setup](#manual-setup) below.

Whichever path you pick: the Amazon console changes over time, so a screen may not look exactly as described. If that happens, take a screenshot and ask your AI assistant what to do. That solves almost everything.

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

## All-in-one prompt for an AI assistant

If you are using a chat tool, copy everything in the box below into a new chat and send it. It is self-contained, so the assistant has all the steps and will guide you through to a working skill.

```
You are helping me set up a private Alexa skill called Pillow Noise that plays brown noise on my Echo, looping until I say stop. The code lives in a public GitHub repository. You probably cannot open links, so I will paste files from the repo whenever you ask.

How to guide me:
- Go ONE step at a time. After each step, wait for me to confirm it is done before giving the next.
- Keep every message short. One action per message. No long lists, no jumping ahead.
- I may not be technical. Tell me exactly what to click or type, in plain words.
- The Amazon console changes often and may not look exactly as you expect. If a screen looks different, I will paste a screenshot and you adapt to what I actually see.
- Do not submit the skill to the Alexa store. It stays private in my own account.

Facts to get right:
- Identity verification is NOT required, because the skill is never published. I can skip any identity-verification prompt.
- For hosting the MP3, the easiest way with no account is catbox.moe: I drag the file onto the page and get a direct link. Suggest that first, not creating a GitHub account.
- When creating the skill: Custom model, Alexa-hosted (Node.js). The hosting region does not matter, the default is fine.
- The phrase to start it is "pillow noise". If Alexa opens a different skill, we pick a more unusual phrase and rebuild.
- The Audio Player interface must be turned ON, or there is no sound. This is the most common mistake.

Walk me through these steps, one at a time:
1. Check that I have an Amazon developer account and an Echo on the same account. If I have no account, point me to developer.amazon.com and wait while I make one.
2. Get a brown noise MP3. Ask whether I want to download the example file from the repo, generate my own, or use one I already have.
3. Host the MP3 on a public link (suggest catbox.moe), then check the link actually returns audio.
4. Create the skill in the Amazon developer console: Custom model, Alexa-hosted (Node.js).
5. Add the trigger phrases: ask me to open the file skill-package/interactionModels/custom/en-US.json in the repo and paste its contents into the console JSON Editor, then Save and Build Model.
6. Add the code: ask me to open lambda/index.js and lambda/package.json in the repo and paste them into the Code tab. Help me put my MP3 link into the TRACK_URL line, then Deploy.
7. Turn on the Audio Player interface under Build, then Interfaces, then Save and Build Model again.
8. Test in the console (Test tab, Development mode), then on my Echo by saying "Alexa, open pillow noise". Saying "Alexa, stop" should stop it.

Start with step 1 now.
```

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
