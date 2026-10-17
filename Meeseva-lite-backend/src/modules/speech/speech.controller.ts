import type { RequestHandler } from 'express';
import { AppError } from '../../common/errors/app-error.js';
import { SpeechService } from './speech.service.js';

export class SpeechController {
  constructor(private readonly speechService = new SpeechService()) {}

  recognize: RequestHandler = async (request, response, next) => {
    try {
      const file = request.file as
        | { buffer: Buffer; mimetype: string }
        | undefined;
      if (!file) {
        throw new AppError(400, 'Audio file is required.');
      }

      const sampleRateRaw = request.body?.sampleRate as string | undefined;
      const sampleRate = sampleRateRaw ? Number(sampleRateRaw) : undefined;
      const languageCode =
        (request.body?.language as string | undefined) || undefined;
      const autoDetect =
        request.body?.autoDetect === 'true' ||
        request.body?.autoDetect === true;

      const transcript = await this.speechService.transcribeAudio({
        buffer: file.buffer,
        mimeType: file.mimetype,
        sampleRate: Number.isFinite(sampleRate) ? sampleRate : undefined,
        languageCode,
        autoDetect,
      });

      response.json({ text: transcript });
    } catch (error) {
      next(error);
    }
  };
}
