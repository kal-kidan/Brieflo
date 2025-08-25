import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ScriptsModule,
    // ConfigModule.forRoot({
    //   envFilePath: `.env`,
    //   isGlobal: true,
    // }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
