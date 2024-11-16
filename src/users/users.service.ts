import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(telegramId: string, walletAddress: string) {
    return this.prisma.user.create({
      data: {
        telegramId,
        walletAddress,
      },
    });
  }

  async addPosition(
    telegramId: string,
    tokenPair: string,
    minPrice: number,
    maxPrice: number,
    chainId: number,
  ) {
    return this.prisma.position.create({
      data: {
        userId: telegramId,
        tokenPair,
        minPrice,
        maxPrice,
        chainId,
      },
    });
  }

  async getAllActivePositions() {
    return this.prisma.position.findMany({
      where: {
        isActive: true,
      },
      include: {
        user: true,
      },
    });
  }
}
