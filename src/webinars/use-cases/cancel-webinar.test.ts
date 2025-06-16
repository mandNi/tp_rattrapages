import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { CancelWebinar } from './cancel-webinar';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryUserRepository } from 'src/webinars/adapters/user-repository.in-memory';
import { User } from 'src/users/entities/user.entity';

describe('Feature: Cancel webinar', () => {
  let repository: InMemoryWebinarRepository;
  let mailer: InMemoryMailer;
  let userRepository: InMemoryUserRepository;
  let useCase: CancelWebinar;

  const organizer = new User({
    id: 'user-alice-id',
    email: 'alice@email.com',
    password: 'password123',
  });

  const otherUser = new User({
    id: 'user-bob-id',
    email: 'bob@email.com',
    password: 'password456',
  });

  const webinar = new Webinar({
    id: 'id-1',
    organizerId: organizer.props.id,
    title: 'Test Webinar',
    startDate: new Date('2024-01-10T10:00:00.000Z'),
    endDate: new Date('2024-01-10T11:00:00.000Z'),
    seats: 100,
  });

  beforeEach(() => {
    repository = new InMemoryWebinarRepository();
    mailer = new InMemoryMailer();
    userRepository = new InMemoryUserRepository();
    useCase = new CancelWebinar(repository, userRepository, mailer);

    // setup
    repository.database.push(webinar);
    userRepository.database.push(organizer);
    userRepository.database.push(otherUser);
  });

  describe('Scenario: happy path', () => {
    it('should cancel the webinar if the user is the organizer', async () => {
      await useCase.execute({ webinarId: 'id-1', userId: 'user-alice-id' });

      expect(repository.database).toHaveLength(0);
      expect(mailer.sentEmails[0].to).toBe('alice@email.com');
      expect(mailer.sentEmails[0].body).toContain('has been canceled');
    });
  });

  describe('Scenario: user is not organizer', () => {
    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: 'id-1', userId: 'user-bob-id' }),
      ).rejects.toThrow('Only the organizer can cancel this webinar');
    });
  });

  describe('Scenario: webinar does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: 'invalid-id', userId: 'user-alice-id' }),
      ).rejects.toThrow('Webinar not found');
    });
  });
});