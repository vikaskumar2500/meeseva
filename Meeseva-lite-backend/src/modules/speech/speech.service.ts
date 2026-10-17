import { AppError } from '../../common/errors/app-error.js';
import type { ISpeechRecognitionProvider } from '../../domain/interfaces/speech.provider.interface.js';
import { GoogleSpeechProvider, MockSpeechProvider } from '../../infrastructure/speech/speech.providers.js';

export class SpeechService {
  constructor(
    private readonly speechProvider: ISpeechRecognitionProvider = new GoogleSpeechProvider(),
    private readonly fallbackProvider: ISpeechRecognitionProvider = new MockSpeechProvider()
  ) {}

  async transcribeAudio(input: {
    buffer: Buffer;
    mimeType: string;
    sampleRate?: number;
    languageCode?: string;
    autoDetect?: boolean;
  }): Promise<string> {
    if (this.speechProvider.isAvailable()) {
      try {
        return await this.speechProvider.transcribe(input);
      } catch (error) {
        console.warn('[SpeechService] Cloud speech provider failed, using fallback:', error);
      }
    }

    // If fallback provider is available or in development/test
    if (this.fallbackProvider.isAvailable()) {
      return this.fallbackProvider.transcribe(input);
    }

    throw new AppError(500, 'Speech recognition service is not operational.');
  }
}
