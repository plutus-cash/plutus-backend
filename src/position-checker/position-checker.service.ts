import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class PositionCheckerService {
  constructor(
    private usersService: UsersService,
    private telegramService: TelegramService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPositions() {
    const activePositions = await this.usersService.getAllActivePositions();

    for (const position of activePositions) {
      const currentPrice = await this.getUniswapPrice(position.tokenPair);

      if (
        currentPrice < position.minPrice ||
        currentPrice > position.maxPrice
      ) {
        await this.telegramService.sendAlert(
          position.user.telegramId,
          `Alert: ${position.tokenPair} price (${currentPrice}) is out of range [${position.minPrice} - ${position.maxPrice}]`,
        );
      }
    }
  }

  private async getUniswapPrice(tokenPair: string): Promise<number> {
    // Implement Uniswap price fetching logic here
    // You can use ethers.js or web3.js to interact with Uniswap contracts
    return 0; // Placeholder
  }
}
