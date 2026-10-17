import { env } from '../../config/env.js';
import type {
  ISpeechRecognitionProvider,
  SpeechRecognitionInput,
} from '../../domain/interfaces/speech.provider.interface.js';

const ENCODING_BY_MIME: Record<string, string> = {
  'audio/wav': 'LINEAR16',
  'audio/x-wav': 'LINEAR16',
  'audio/wave': 'LINEAR16',
};

const AUTO_DETECT_LANGUAGES = [
  'en-US',
  'en-GB',
  'hi-IN',
  'ta-IN',
  'te-IN',
  'bn-IN',
  'ml-IN',
  'kn-IN',
  'mr-IN',
  'gu-IN',
  'pa-IN',
  'ur-PK',
];

export class GoogleSpeechProvider implements ISpeechRecognitionProvider {
  readonly name = 'GoogleSpeechProvider';
  private clientInstance: any = null;

  isAvailable(): boolean {
    return Boolean(env.GOOGLE_APPLICATION_CREDENTIALS);
  }

  private async getClient() {
    if (!this.clientInstance) {
      const { SpeechClient } = await import('@google-cloud/speech');
      this.clientInstance = new SpeechClient();
    }
    return this.clientInstance;
  }

  async transcribe(input: SpeechRecognitionInput): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('Google Cloud Speech credentials not configured');
    }

    const client = await this.getClient();
    const encoding = ENCODING_BY_MIME[input.mimeType] || 'LINEAR16';
    const config: Record<string, unknown> = {
      encoding,
      languageCode: input.languageCode || env.GOOGLE_SPEECH_LANGUAGE || 'en-US',
      enableAutomaticPunctuation: true,
    };

    if (input.autoDetect) {
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
      .map((result: any) => result.alternatives?.[0]?.transcript || '')
      .join(' ')
      .trim();

    return transcript;
  }
}

export class MockSpeechProvider implements ISpeechRecognitionProvider {
  readonly name = 'MockSpeechProvider';

  isAvailable(): boolean {
    return true;
  }

  async transcribe(_input: SpeechRecognitionInput): Promise<string> {
    return 'income certificate application query';
  }
}
