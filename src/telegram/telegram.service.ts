import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { Start } from 'nestjs-telegraf';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private usersService: UsersService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    const startPayload =
      'text' in ctx.message ? ctx.message.text?.split(' ')[1] : undefined; // Get parameters after /start

    if (startPayload) {
      try {
        // Decode and parse the position parameters
        const params = JSON.parse(
          Buffer.from(startPayload, 'base64').toString(),
        );
        const telegramId = ctx.from.id.toString();

        // Create or update user position
        await this.usersService.addPosition(
          telegramId,
          params.tokenPair,
          params.minPrice,
          params.maxPrice,
          params.chainId,
        );

        await ctx.reply('Position tracking has been set up successfully! 🎉');
      } catch (error) {
        await ctx.reply(
          'Sorry, there was an error setting up your position tracking.',
        );
      }
    } else {
      await ctx.reply('Welcome to the Position Tracking Bot! 🤖');
    }
  }

  generateTrackingLink(params: {
    tokenPair: string;
    minPrice: number;
    maxPrice: number;
    chainId: number;
  }): string {
    // Convert parameters to Base64
    const payload = Buffer.from(JSON.stringify(params)).toString('base64');
    return `https://t.me/YourBotUsername?start=${payload}`;
  }

  async sendAlert(telegramId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(telegramId, message);
    } catch (error) {
      console.error(`Failed to send alert to ${telegramId}:`, error);
    }
  }
}
