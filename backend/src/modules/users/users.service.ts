import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        status: true,
        organizationId: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findAllByOrganization(
    organizationId: string,
    options: { page?: number; pageSize?: number; search?: string } = {},
  ) {
    const page = Math.max(1, parseInt(String(options.page ?? 1), 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(options.pageSize ?? 20), 10) || 20));
    const { search } = options;
    const skip = (page - 1) * pageSize;

    const where = {
      organizationId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async update(id: string, dto: UpdateUserDto, requesterId: string) {
    const user = await this.findById(id);

    // Users can only update their own profile unless they're an admin
    const requester = await this.findById(requesterId);
    if (id !== requesterId && !['ADMIN', 'SUPER_ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        displayName: dto.firstName && dto.lastName
          ? `${dto.firstName} ${dto.lastName}`
          : undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async deactivate(id: string, requesterId: string) {
    const requester = await this.findById(requesterId);
    if (!['ADMIN', 'SUPER_ADMIN'].includes(requester.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }
}
