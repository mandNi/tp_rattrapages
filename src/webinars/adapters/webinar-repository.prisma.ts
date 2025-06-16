import { PrismaClient } from '@prisma/client';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

export class WebinarRepositoryPrisma implements IWebinarRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(webinar: Webinar): Promise<void> {
    await this.prisma.webinar.create({
      data: {
        id: webinar.props.id,
        organizerId: webinar.props.organizerId,
        title: webinar.props.title,
        startDate: webinar.props.startDate,
        endDate: webinar.props.endDate,
        seats: webinar.props.seats,
      },
    });
  }

  async findById(id: string): Promise<Webinar | null> {
    const result = await this.prisma.webinar.findUnique({ where: { id } });
    if (!result) return null;

    return new Webinar({
      id: result.id,
      organizerId: result.organizerId,
      title: result.title,
      startDate: result.startDate,
      endDate: result.endDate,
      seats: result.seats,
    });
  }

  async update(webinar: Webinar): Promise<void> {
    await this.prisma.webinar.update({
      where: { id: webinar.props.id },
      data: {
        title: webinar.props.title,
        startDate: webinar.props.startDate,
        endDate: webinar.props.endDate,
        seats: webinar.props.seats,
        organizerId: webinar.props.organizerId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.webinar.delete({
      where: { id },
    });
  }
}
