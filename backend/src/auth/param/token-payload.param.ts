import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';
import { PayloadTokenDto } from '../dto/payload_token.dto';
import { RequestComPayload } from '../types/request-com-payload';

export const TokenPayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PayloadTokenDto => {
    const request = ctx.switchToHttp().getRequest<RequestComPayload>();
    return request[REQUEST_TOKEN_PAYLOAD_NAME];
  },
);
