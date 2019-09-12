import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentions.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorartor';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentialsDTO: AuthCredentialsDTO) {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDTO);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
