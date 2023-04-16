import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtService = new JwtService({ secret: 'super-secret' });
    const token = request.headers.authorization.split(' ')[1];
    const payload = jwtService.verify(token);
    return payload;
  },
);