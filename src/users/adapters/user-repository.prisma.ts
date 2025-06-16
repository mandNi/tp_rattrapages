import { PrismaClient } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';

export class UserRepositoryPrisma implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record
      ? new User({
        id: record.id,
        email: record.email,
        password: record.password,
      })
      : null;
  }
}
