/**
 * Pillow Noise — Alexa skill that plays brown noise on an infinite loop.
 *
 * How the loop works:
 *   LaunchRequest          -> AudioPlayer.Play REPLACE_ALL with TRACK_URL
 *   PlaybackNearlyFinished -> AudioPlayer.Play ENQUEUE with TRACK_URL again
 *   StopIntent / Cancel    -> AudioPlayer.Stop
 *
 * The PlaybackNearlyFinished event fires shortly before the current track
 * ends. We respond by enqueueing the same URL again, which Alexa plays
 * seamlessly after the current track. Repeat forever.
 */

const Alexa = require('ask-sdk-core');

// Public HTTPS URL of your brown noise MP3.
// Replace the placeholder below with your own hosted MP3 link (see the README).
const TRACK_URL = 'REPLACE_WITH_YOUR_MP3_URL';
const TRACK_TITLE = 'Brown Noise';
const TRACK_SUBTITLE = 'Pillow Noise';

function playDirective(handlerInput, playBehavior, offsetMs = 0, previousToken = null) {
  // Generate a fresh token each call. Alexa uses tokens to correlate playback events.
  const token = `pillow-noise-${Date.now()}`;
  const audioItem = {
    stream: {
      url: TRACK_URL,
      token,
      offsetInMilliseconds: offsetMs,
    },
    metadata: {
      title: TRACK_TITLE,
      subtitle: TRACK_SUBTITLE,
    },
  };
  if (playBehavior === 'ENQUEUE' && previousToken) {
    audioItem.stream.expectedPreviousToken = previousToken;
  }
  return handlerInput.responseBuilder
    .addAudioPlayerPlayDirective(
      playBehavior,
      audioItem.stream.url,
      audioItem.stream.token,
      audioItem.stream.offsetInMilliseconds,
      audioItem.stream.expectedPreviousToken,
      audioItem.metadata
    )
    .getResponse();
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return playDirective(handlerInput, 'REPLACE_ALL');
  },
};

const PlaybackNearlyFinishedHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackNearlyFinished';
  },
  handle(handlerInput) {
    const previousToken = handlerInput.requestEnvelope.request.token;
    return playDirective(handlerInput, 'ENQUEUE', 0, previousToken);
  },
};

// Stop / Cancel / Pause all map to stopping playback.
const StopIntentHandler = {
  canHandle(handlerInput) {
    const name = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (name === 'AMAZON.StopIntent' ||
        name === 'AMAZON.CancelIntent' ||
        name === 'AMAZON.PauseIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse();
  },
};

// Resume restarts from scratch (brown noise has no "position").
const ResumeIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent'
    );
  },
  handle(handlerInput) {
    return playDirective(handlerInput, 'REPLACE_ALL');
  },
};

// Help — spoken guidance.
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speak = 'Say open pillow noise to start brown noise. Say stop to end it.';
    return handlerInput.responseBuilder.speak(speak).reprompt(speak).getResponse();
  },
};

// AudioPlayer lifecycle events we don't act on — just 200 OK.
const AudioPlayerEventHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope).startsWith('AudioPlayer.');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

// Intents that Alexa requires us to register but that are no-ops for brown noise.
const UnsupportedAudioIntentHandler = {
  canHandle(handlerInput) {
    const name = Alexa.getIntentName(handlerInput.requestEnvelope);
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (name === 'AMAZON.LoopOnIntent' ||
        name === 'AMAZON.LoopOffIntent' ||
        name === 'AMAZON.NextIntent' ||
        name === 'AMAZON.PreviousIntent' ||
        name === 'AMAZON.RepeatIntent' ||
        name === 'AMAZON.ShuffleOnIntent' ||
        name === 'AMAZON.ShuffleOffIntent' ||
        name === 'AMAZON.StartOverIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Error handled:', error);
    return handlerInput.responseBuilder
      .speak('Sorry, something went wrong.')
      .getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PlaybackNearlyFinishedHandler,
    StopIntentHandler,
    ResumeIntentHandler,
    HelpIntentHandler,
    UnsupportedAudioIntentHandler,
    AudioPlayerEventHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
