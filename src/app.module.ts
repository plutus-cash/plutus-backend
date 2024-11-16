import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TelegramModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        include: [TelegramModule],
        launchOptions: {
          webhook: {
            domain: configService.get<string>('WEBHOOK_DOMAIN'),
            hookPath: configService.get<string>('WEBHOOK_PATH'),
          },
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
