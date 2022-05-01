import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { Profile } from "../profile.entity";
import { Company } from "../company.entity";

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @InjectRepository(Profile)
  private readonly ProfileRepository: Repository<Profile>;

  @InjectRepository(Company)
  private readonly CompRepository: Repository<Company>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto): Promise<any> {
    const { name, email, password, lastName, is_company }: RegisterDto = body;
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new User();
    user.email = email;
    user.password = this.helper.encodePassword(password);
    user.is_company = is_company;
    const userData = await this.repository.save(user);

    if (is_company) {
      const company = new Company();
      company.name = name;
      company.user = userData;
      await this.CompRepository.save(company);
    } else {
      const profile = new Profile();
      profile.name = name;
      profile.lastname = lastName;
      profile.user = userData;
      await this.ProfileRepository.save(profile);
    }
    return userData;

  }

  public async login(body: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password }: LoginDto = body;
    console.log('email', email);
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(user.id, { lastLoginAt: new Date() });

    return Promise.resolve({user, token: this.helper.generateToken(user)});
  }

  public async refresh(user: User): Promise<string> {
    await this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }
}
