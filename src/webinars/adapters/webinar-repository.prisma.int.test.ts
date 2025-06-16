import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { WebinarRepositoryPrisma } from './webinar-repository.prisma';

const asyncExec = promisify(exec);

describe('PrismaWebinarRepository – Integration', () => {
  jest.setTimeout(30000);
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let repository: WebinarRepositoryPrisma;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test_db')
      .withUsername('user_test')
      .withPassword('password_test')
      .start();

    const dbUrl = container.getConnectionUri();

    prismaClient = new PrismaClient({
      datasources: {
        db: { url: dbUrl },
      },
    });

    await asyncExec(`DATABASE_URL=${dbUrl} npx prisma migrate deploy`);
    await prismaClient.$connect();
  });

  beforeEach(async () => {
    repository = new WebinarRepositoryPrisma(prismaClient);
    await prismaClient.webinar.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
    await container.stop();
  });

  describe('Scenario: delete a webinar', () => {
    it('should remove the webinar from the database', async () => {
      // ARRANGE
      const webinar = new Webinar({
        id: 'webinar-to-delete',
        title: 'Webinar to Delete',
        organizerId: 'user-123',
        startDate: new Date('2025-07-01T10:00:00Z'),
        endDate: new Date('2025-07-01T11:00:00Z'),
        seats: 30,
      });

      await prismaClient.webinar.create({
        data: {
          id: webinar.props.id,
          title: webinar.props.title,
          startDate: webinar.props.startDate,
          endDate: webinar.props.endDate,
          seats: webinar.props.seats,
          organizerId: webinar.props.organizerId,
        },
      });

      // ACT
      await repository.delete('webinar-to-delete');

      // ASSERT
      const result = await prismaClient.webinar.findUnique({
        where: { id: 'webinar-to-delete' },
      });
      expect(result).toBeNull();
    });
  });
});
