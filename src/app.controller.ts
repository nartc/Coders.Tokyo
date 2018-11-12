import { Get, Controller, Res } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  index(@Res() res): string {
    return res.sendFile(join(__dirname, '../public/index.html'));
  }
}
