import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PostDTO } from './dto/post.dto';

@Controller('translate')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('normal')
  translateFromNormal(@Body() body: PostDTO): Record<string, string> {
    return { rovarsprak: this.appService.translateFromNormal(body?.text) };
  }

  @Post('rovarsprak')
  translateFromRovarsprak(@Body() body: PostDTO): Record<string, string> {
    return { normal: this.appService.translateFromRovarsprak(body?.text) };
  }

  @Post('jokeoftheday')
  jokeOfTheDay(@Body() body: PostDTO): Promise<Record<string, string>> {
    return this.appService.jokeAPI(body?.url, body?.jokeKeys);
  }
}
