# Pillow noise skill

A custom Alexa skill that plays brown noise on your Echo. You say a phrase, it plays brown noise, and it keeps playing until you tell it to stop. That is all it does.

It stays private to your own Amazon account. It is not published to the Alexa Skills Store, and there is no shared service behind it.

---

## Pick your path

- **Want help from an AI assistant?** This is the easy way, and it works even if you are not technical. Paste the link to this repository into a coding agent (Claude Code, Cursor, Codex) or any chat tool (ChatGPT, Claude.ai), and say something like: *"Look at this repository and help me deploy this Alexa skill step by step. Ask me for anything you need."* It will walk you through the rest. See [For an AI assistant](#for-an-ai-assistant).
- **Prefer to do it yourself?** Follow [Manual setup](#manual-setup) below. It assumes you are comfortable poking around a developer console and copying files into it.

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

### 2. Put the MP3 on a public link of your own

The skill needs to reach the file at a public link that returns the raw MP3, and that link has to be yours. Do not point the skill at someone else's file, including the example above. The example is for you to download and then host yourself.

The simplest way: create a public GitHub repository of your own, upload the MP3 through the website, open the file, and copy its "raw" link. Free file hosts work too.

### 2. Create the skill

1. Go to [developer.amazon.com/alexa/console/ask](https://developer.amazon.com/alexa/console/ask).
2. Click **Create Skill** and name it whatever you like, for example "Pillow Noise".
3. Choose: primary locale **English (US)**, model **Custom**, hosting **Alexa-hosted (Node.js)**.

### 3. Add the trigger phrases

1. In the left menu: **Build**, then **Interaction Model**, then **JSON Editor**.
2. Replace everything there with the contents of `skill-package/interactionModels/custom/en-US.json` from this repository.
3. Click **Save**, then **Build Model**, and wait for it to finish.

### 4. Add the code

1. Open the **Code** tab at the top.
2. Replace the contents of `index.js` with `lambda/index.js` from this repository.
3. Replace the contents of `package.json` with `lambda/package.json` from this repository.
4. In `index.js`, find this line:
   ```js
   const TRACK_URL = 'REPLACE_WITH_YOUR_MP3_URL';
   ```
   Put your MP3 link from step 1 between the quotes.
5. Click **Deploy** and wait for it to finish.

### 5. Turn on audio

1. Left menu: **Build**, then **Interfaces**.
2. Switch **Audio Player** on.
3. Click **Save Interfaces**, then **Build Model** again.

This step is easy to forget. Without it, the skill builds fine but plays no sound.

### 6. Test it in the console

1. Open the **Test** tab at the top.
2. Change the dropdown from "Off" to **Development**.
3. Type or say `open pillow noise`.
4. An audio-only skill shows no spoken reply, so seeing "No Content" is normal. In the **JSON Output** panel you should see a block mentioning `AudioPlayer.Play` with your MP3 link in it.

### 7. Test it on your Echo

Once the skill is in Development mode, it is automatically available on every Echo signed into the same Amazon account.

Say: *"Alexa, open pillow noise."* You should hear brown noise. Say *"Alexa, stop"* to stop it.

---

## For an AI assistant

> If you are an AI assistant and someone gave you the link to this repository, this part is for you.

**Goal:** deploy a working private Alexa skill that plays looping brown noise on the user's Echo. The user may not be technical, so explain plainly and do one step at a time.

**Start by reading the repository** at the link the user gave you, so you can see the actual code and trigger phrases.

**Hard rules:**
- Keep the skill in development mode. Do not submit it to the Alexa Skills Store.
- The user should host their own MP3, or use the ready-made link in step 1 of the manual setup. Do not point them at MP3 files in other people's projects.
- Never run `ask smapi update-skill-manifest` on an Alexa-hosted skill. It erases the connection between the skill and its code and is hard to undo.

**Ask the user first:**
1. Do they have an Amazon Developer account? If not, send them to [developer.amazon.com](https://developer.amazon.com) and wait.
2. Do they have an Echo on that same account?
3. Do they want the ready-made noise file, or to make their own?
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
