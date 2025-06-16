import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { User } from 'src/users/entities/user.entity';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public database: User[] = []) {}

  async findById(id: string): Promise<User | null> {
    const user = this.database.find((u) => u.props.id === id);
    return user ? new User({ ...user.initialState }) : null;
  }
}