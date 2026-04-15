import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login_usuario.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async loginUsuario(@Body() body: LoginDto) {
    return await this.authService.usuarioLogin(body);
  }
}
