import { Request } from 'express';
import { PayloadTokenDto } from '../dto/payload_token.dto';

export type RequestComPayload = Request & {
  token_payload: PayloadTokenDto;
};
