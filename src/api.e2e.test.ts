import supertest from 'supertest';
import { TestServerFixture } from './tests/fixtures';

describe('Webinar Routes E2E', () => {
  let fixture: TestServerFixture;

  beforeAll(async () => {
    fixture = new TestServerFixture();
    await fixture.init();
  });

  beforeEach(async () => {
    await fixture.reset();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  describe('POST /webinars/:id/cancel', () => {
    it('should cancel an existing webinar', async () => {
      const prisma = fixture.getPrismaClient();
      const server = fixture.getServer();

      // ARRANGE: créer l’organisateur
      await prisma.user.create({
        data: {
          id: 'user-id',
          email: 'user@test.com',
          password: 'blablabla',
        },
      });

      // ARRANGE: créer le webinar associé à cet utilisateur
      await prisma.webinar.create({
        data: {
          id: 'webinar-id',
          title: 'Test Webinar',
          seats: 20,
          startDate: new Date(),
          endDate: new Date(),
          organizerId: 'user-id',
        },
      });

      // ACT: appeler l'endpoint d'annulation
      const response = await supertest(server)
        .post('/webinars/webinar-id/cancel')
        .send({ userId: 'user-id' })
        .expect(200);

      // ASSERT: vérifier la réponse
      expect(response.body).toEqual({ message: 'Webinar canceled' });

      // ASSERT: le webinar doit être supprimé
      const deleted = await prisma.webinar.findUnique({
        where: { id: 'webinar-id' },
      });
      expect(deleted).toBeNull();
    });

    it('should return 404 if webinar does not exist', async () => {
      const prisma = fixture.getPrismaClient();
      const server = fixture.getServer();

      // ARRANGE: créer l’utilisateur
      await prisma.user.create({
        data: {
          id: 'user-id',
          email: 'user@test.com',
          password: 'blablabla',
        },
      });

      // ACT & ASSERT: appeler sur un ID inexistant
      await supertest(server)
        .post('/webinars/non-existent-id/cancel')
        .send({ userId: 'user-id' })
        .expect(404);
    });

    it('should return 401 if user is not the organizer', async () => {
      const prisma = fixture.getPrismaClient();
      const server = fixture.getServer();

      // ARRANGE: créer deux utilisateurs
      await prisma.user.createMany({
        data: [
          {
            id: 'correct-user',
            email: 'correct@test.com',
            password: 'correct',
          },
          {
            id: 'wrong-user',
            email: 'wrong@test.com',
            password: 'wrong',
          },
        ],
      });

      // ARRANGE: créer un webinar organisé par 'correct-user'
      await prisma.webinar.create({
        data: {
          id: 'webinar-id',
          title: 'Test Webinar',
          seats: 20,
          startDate: new Date(),
          endDate: new Date(),
          organizerId: 'correct-user',
        },
      });

      // ACT & ASSERT: tentative d’annulation par 'wrong-user'
      await supertest(server)
        .post('/webinars/webinar-id/cancel')
        .send({ userId: 'wrong-user' })
        .expect(401);
    });
  });
});