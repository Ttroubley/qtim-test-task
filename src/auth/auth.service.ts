import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { comparePassword } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User successfully created',
    };
    try {
      await this.usersService.createUser(createUserDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  public async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.validateUser(username, password);
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  private async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new HttpException('User doesnt exists', HttpStatus.UNAUTHORIZED);
    }

    const comparePasswords = await comparePassword(user.password, password);

    if (!comparePasswords) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
