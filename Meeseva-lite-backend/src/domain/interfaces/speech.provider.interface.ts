export interface SpeechRecognitionInput {
  buffer: Buffer;
  mimeType: string;
  sampleRate?: number;
  languageCode?: string;
  autoDetect?: boolean;
}

export interface ISpeechRecognitionProvider {
  readonly name: string;
  isAvailable(): boolean;
  transcribe(input: SpeechRecognitionInput): Promise<string>;
}
