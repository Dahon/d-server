import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as Guard, IAuthGuard } from '@nestjs/passport';
import { User } from '../user.entity';

@Injectable()
export class JwtAuthGuard extends Guard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: User): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user }: any = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}
