import { PrismaClient } from '@prisma/client';
import { RealDateGenerator } from 'src/core/adapters/real-date-generator';
import { RealIdGenerator } from 'src/core/adapters/real-id-generator';
import { PrismaWebinarRepository } from 'src/webinars/adapters/webinar-repository.prisma';
import { OrganizeWebinars } from 'src/webinars/use-cases/organize-webinar';

export class AppContainer {
  private prismaClient!: PrismaClient;
  private webinarRepository!: PrismaWebinarRepository;
  private organizeWebinarUseCase!: OrganizeWebinars;

  init(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
    this.webinarRepository = new PrismaWebinarRepository(this.prismaClient);
    // Initialize use cases

    this.organizeWebinarUseCase = new OrganizeWebinars(
      this.webinarRepository,
      new RealIdGenerator(),
      new RealDateGenerator(),
    );
  }

  getPrismaClient() {
    return this.prismaClient;
  }

  get useCases() {
    return {
      organizeWebinarUseCase: this.organizeWebinarUseCase,
    };
  }
}

export const container = new AppContainer();
