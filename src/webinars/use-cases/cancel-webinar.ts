import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IMailer } from 'src/core/ports/mailer.interface';

type CancelWebinarInput = {
  webinarId: string;
  userId: string;
};

export class WebinarNotFoundError extends Error {
  constructor() {
    super('Webinar not found');
    this.name = 'WebinarNotFoundError';
  }
}

export class NotOrganizerError extends Error {
  constructor() {
    super('Only the organizer can cancel this webinar');
    this.name = 'NotOrganizerError';
  }
}

export class OrganizerNotFoundError extends Error {
  constructor() {
    super('Organizer not found');
    this.name = 'OrganizerNotFoundError';
  }
}

export class CancelWebinar {
  constructor(
    private readonly webinarRepository: IWebinarRepository,
    private readonly userRepository: IUserRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute(input: CancelWebinarInput): Promise<void> {
    const webinar = await this.webinarRepository.findById(input.webinarId);
    if (!webinar) {
      throw new WebinarNotFoundError();
    }

    if (webinar.props.organizerId !== input.userId) {
      throw new NotOrganizerError();
    }

    const organizer = await this.userRepository.findById(input.userId);
    if (!organizer) {
      throw new OrganizerNotFoundError();
    }

    await this.webinarRepository.delete(input.webinarId);

    await this.mailer.send({
      to: organizer.props.email,
      subject: `Webinar "${webinar.props.title}" canceled`,
      body: `The webinar "${webinar.props.title}" has been canceled.`,
    });
  }
}