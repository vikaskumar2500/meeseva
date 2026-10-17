import { UserRepository } from './modules/users/user.repository.js';
import { OTPRepository } from './modules/auth/otp.repository.js';
import { ApplicationRepository } from './modules/applications/application.repository.js';
import { TrackingRepository } from './modules/tracking/tracking.repository.js';
import { ServiceRepository } from './modules/services/service.repository.js';
import { DocumentRepository } from './modules/documents/document.repository.js';

import {
  TwilioSmsProvider,
  MockSmsProvider,
} from './infrastructure/notifications/sms/sms.providers.js';
import {
  SendGridEmailProvider,
  MockEmailProvider,
} from './infrastructure/notifications/email/email.providers.js';
import { NotificationService } from './infrastructure/notifications/notification.service.js';
import { LocalStorageProvider } from './infrastructure/storage/local-storage.provider.js';
import {
  GoogleSpeechProvider,
  MockSpeechProvider,
} from './infrastructure/speech/speech.providers.js';

import { AuthService } from './modules/auth/auth.service.js';
import { ApplicationService } from './modules/applications/application.service.js';
import { TrackingService } from './modules/tracking/tracking.service.js';
import { GovServiceCatalogService } from './modules/services/service.service.js';
import { DocumentService } from './modules/documents/document.service.js';
import { SpeechService } from './modules/speech/speech.service.js';
import { UserService } from './modules/users/user.service.js';

import { AuthController } from './modules/auth/auth.controller.js';
import { ApplicationController } from './modules/applications/application.controller.js';
import { TrackingController } from './modules/tracking/tracking.controller.js';
import { ServiceController } from './modules/services/service.controller.js';
import { DocumentController } from './modules/documents/document.controller.js';
import { SpeechController } from './modules/speech/speech.controller.js';
import { UserController } from './modules/users/user.controller.js';

/**
 * Enterprise IoC / DI Composition Root
 * Centralizes instantiation and wires high-level services to low-level infrastructure via domain abstractions.
 */
class Container {
  // 1. Repositories (Data Layer)
  readonly userRepository = new UserRepository();
  readonly otpRepository = new OTPRepository();
  readonly applicationRepository = new ApplicationRepository();
  readonly trackingRepository = new TrackingRepository();
  readonly serviceRepository = new ServiceRepository();
  readonly documentRepository = new DocumentRepository();

  // 2. Infrastructure Providers
  readonly smsProviders = [new TwilioSmsProvider(), new MockSmsProvider()];
  readonly emailProviders = [
    new SendGridEmailProvider(),
    new MockEmailProvider(),
  ];
  readonly notificationService = new NotificationService(
    this.smsProviders,
    this.emailProviders
  );
  readonly storageProvider = new LocalStorageProvider();
  readonly speechProvider = new GoogleSpeechProvider();
  readonly fallbackSpeechProvider = new MockSpeechProvider();

  // 3. Application Services (Domain Logic with DIP)
  readonly authService = new AuthService(
    this.userRepository,
    this.otpRepository,
    this.notificationService
  );

  readonly applicationService = new ApplicationService(
    this.applicationRepository,
    this.trackingRepository,
    this.notificationService
  );

  readonly trackingService = new TrackingService(
    this.trackingRepository,
    this.applicationRepository
  );

  readonly serviceCatalogService = new GovServiceCatalogService(
    this.serviceRepository
  );

  readonly documentService = new DocumentService(
    this.documentRepository,
    this.storageProvider
  );

  readonly speechService = new SpeechService(
    this.speechProvider,
    this.fallbackSpeechProvider
  );

  readonly userService = new UserService(this.userRepository);

  // 4. Presentation Controllers
  readonly authController = new AuthController(this.authService);
  readonly applicationController = new ApplicationController(
    this.applicationService
  );
  readonly trackingController = new TrackingController(this.trackingService);
  readonly serviceController = new ServiceController(
    this.serviceCatalogService
  );
  readonly documentController = new DocumentController(this.documentService);
  readonly speechController = new SpeechController(this.speechService);
  readonly userController = new UserController(this.userService);
}

export const container = new Container();
