# Pillow noise skill

A custom Alexa skill that plays brown noise on your Echo. You say a phrase, it plays brown noise, and it keeps playing until you tell it to stop. That is all it does.

It stays private to your own Amazon account. It is not published to the Alexa Skills Store, and there is no shared service behind it.

---

## Pick your path

The easy way, even if you are not technical, is to let an AI assistant walk you through it.

- **Coding agent** (Claude Code, Codex, Cursor, Cowork): paste the link to this repository and say *"Follow this repo and guide me through deploying this Alexa skill, one step at a time."* It can read the files itself.
- **Chat tool** (ChatGPT, Claude.ai, Gemini): these usually cannot open a link, so do not just paste the URL. Paste this whole README into a new chat, then tell it: *"guide me through this one step at a time, starting now."* Keep the repository open in another tab so you can copy the files when a step asks for them. If the assistant ever writes out a file itself, ignore it and copy the real one from the repo.
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

You need your hosted MP3 link from step 2 ready before this step. If you have not hosted the MP3 yet, do step 2 first.

1. Open the **Code** tab at the top. You will see an editor with files, including `index.js` and `package.json`.
2. Open `lambda/index.js` from this repository, copy all of it, and paste it over the contents of `index.js` in the editor.
3. Do the same with `package.json`: paste `lambda/package.json` over the contents of `package.json` in the editor.
4. Now, still in the editor, in the `index.js` you just pasted, find this line:
   ```js
   const TRACK_URL = 'REPLACE_WITH_YOUR_MP3_URL';
   ```
   Replace `REPLACE_WITH_YOUR_MP3_URL` with your MP3 link from step 2, keeping the quotes. Do this here in the editor, after pasting, not before.
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

## Notes for an AI assistant guiding this setup

If you are an AI assistant helping someone through this README, follow these while you walk them through the steps above:

- Follow the steps in order and do not skip any. In particular, make sure they have hosted the MP3 and have its link (steps 1 and 2) before the code step. In the code step, they paste the code into the console editor first, and only then replace the `TRACK_URL` line inside that editor. Never replace the URL before pasting the code.
- Take them through it ONE step at a time. After each step, wait for them to confirm before moving to the next.
- Keep each message short and in plain words. They may not be technical, so tell them exactly what to click or type.
- When a step refers to a file (the code or the trigger phrases), never write, generate, or guess its contents yourself. You do not have the real files, so anything you produce will be wrong and the skill will fail. Always have the user open that file in the repository and paste its real contents.
- If a screen looks different from what the steps describe, ask for a screenshot and adapt to what they actually see. The Amazon console changes over time.
- For hosting the MP3, suggest catbox.moe first (no account needed). A public GitHub repo is the more durable alternative.
- Identity verification is NOT required, because this skill is never published. They can skip any identity-verification prompt.
- Do not submit the skill to the Alexa store. It stays private in their own account.

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
