import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDTO } from './dto/auth-credentions.dto';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<User> {
    const { username, password } = authCredentialsDTO;
    const salt = bcrypt.genSaltSync(10);
    const user = new User();

    user.username = username;
    user.salt = salt;
    user.password = this.hashPassword(salt, password);

    try {
      return await user.save();
    } catch (error) {
      if (['23505', '3505'].includes(error.code)) {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  hashPassword(salt: string, password: string): string {
    return bcrypt.hashSync(password, salt);
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<string> {
    const { username, password } = authCredentialsDTO;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
