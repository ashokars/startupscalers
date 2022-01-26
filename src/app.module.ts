import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
    exclude: ['/api*'],
  }),HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
