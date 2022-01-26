import { Body, Controller, Get, Header, OnModuleInit, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
  ) {
  }

  async onModuleInit() {
    await this.appService.bulkInsert();
  }

  @Get('serverstatus')
  async serverStatus() {
    const results = await this.appService.getServerStatus();
    return results;
  }

  @Get('findserver')
  async root(@Res() res: Response) {
    let error = "<h1>ALL OFFLINE</h1>"
    let results = await this.appService.findServer();
    res.send(results||error);
  }


  @Get('search')
  async search(@Query('q') q: string) {
    const results = await this.appService.searchIndex(q);
    return results;
  }
}
