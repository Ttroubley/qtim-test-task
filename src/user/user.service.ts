import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const isUserExists = await this.usersRepository.findOneBy({ username });

    if (isUserExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(password);
    const user: UserEntity = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
