import { HashingServiceProtocol } from './hashing.service';
import * as bcrypt from 'bcrypt';
export class BcrytService extends HashingServiceProtocol {
  async hash(senha: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(senha, saltOrRounds);
  }
  async compare(senha: string, senhaHash: string): Promise<boolean> {
    return bcrypt.compare(senha, senhaHash);
  }
}
