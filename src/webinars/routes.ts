import { FastifyInstance } from 'fastify';
import { AppContainer } from 'src/container';
import { WebinarNotFoundError, NotOrganizerError } from 'src/webinars/use-cases/cancel-webinar';

export async function webinarRoutes(
  fastify: FastifyInstance,
  container: AppContainer,
) {
  const { organizeWebinarUseCase, cancelWebinarUseCase } = container.useCases;

  fastify.post<{
    Body: { title: string; seats: number; startDate: string; endDate: string };
  }>('/webinars', {}, async (request, reply) => {
    const organizeCommand = {
      userId: 'fake-user-id',
      title: request.body.title,
      seats: request.body.seats,
      startDate: new Date(request.body.startDate),
      endDate: new Date(request.body.endDate),
    };

    try {
      await organizeWebinarUseCase.execute(organizeCommand);
      reply.status(200).send({ message: 'Webinar created' });
    } catch (err) {
      if (err instanceof WebinarNotFoundError) {
        return reply.status(404).send({ error: err.message });
      }
      if (err instanceof NotOrganizerError) {
        return reply.status(401).send({ error: err.message });
      }
      reply.status(500).send({ error: 'An error occurred' });
    }
  });

  fastify.post<{
    Params: { id: string };
    Body: { userId: string };
  }>('/webinars/:id/cancel', {}, async (request, reply) => {
    const { id } = request.params;
    const { userId } = request.body;

    try {
      await cancelWebinarUseCase.execute({ webinarId: id, userId });
      reply.status(200).send({ message: 'Webinar canceled' });
    } catch (err) {
      if (err instanceof WebinarNotFoundError) {
        return reply.status(404).send({ error: err.message });
      }
      if (err instanceof NotOrganizerError) {
        return reply.status(401).send({ error: err.message });
      }
      reply.status(500).send({ error: 'An error occurred' });
    }
  });
}