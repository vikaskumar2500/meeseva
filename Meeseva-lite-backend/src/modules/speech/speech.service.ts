import { SpeechClient } from '@google-cloud/speech';
import { AppError } from '../../common/errors/app-error.js';
import { env } from '../../config/env.js';

const client = new SpeechClient();

const encodingByMime: Record<string, string> = {
  'audio/wav': 'LINEAR16',
  'audio/x-wav': 'LINEAR16',
  'audio/wave': 'LINEAR16',
};

const AUTO_DETECT_LANGUAGES = [
  'en-US','en-GB','hi-IN','ta-IN','te-IN','bn-IN','ml-IN','kn-IN','mr-IN','gu-IN','pa-IN','ur-PK','es-ES','fr-FR','de-DE','ar-SA','zh-CN',
];

export class SpeechService {
  async transcribeAudio(input: { buffer: Buffer; mimeType: string; sampleRate?: number; languageCode?: string; autoDetect?: boolean }) {
    if (!env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new AppError(500, 'Speech service is not configured on the server.');
    }

    const encoding = encodingByMime[input.mimeType] || 'LINEAR16';
    const config: Record<string, unknown> = {
      encoding,
      languageCode: input.languageCode || env.GOOGLE_SPEECH_LANGUAGE || 'en-US',
      enableAutomaticPunctuation: true,
    };

    if (input.autoDetect) {
      // provide a broad list of alternative languages for the recognizer to decide from
      (config as any).alternativeLanguageCodes = AUTO_DETECT_LANGUAGES;
    }

    if (input.sampleRate) {
      config.sampleRateHertz = input.sampleRate;
    }

    const [response] = await client.recognize({
      config,
      audio: { content: input.buffer.toString('base64') },
    });

    const transcript = (response.results || [])
      .map(result => result.alternatives?.[0]?.transcript || '')
      .join(' ')
      .trim();

    return transcript;
  }
}
