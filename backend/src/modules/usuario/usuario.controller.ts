import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @Post('criar')
  criarUsuario(@Body() body: CriarUsuarioDto) {
    return this.usuarioService.criarUsuario(body);
  }
  @Get('buscar/:id')
  buscarUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.buscarUsuario(id);
  }
}
