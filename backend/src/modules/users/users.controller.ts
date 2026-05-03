import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../common/prisma/prisma.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Get()
  @ApiOperation({ summary: 'List users in organization' })
  async findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAllByOrganization(organizationId, { page, pageSize, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.usersService.update(id, dto, requesterId);
  }

  @Delete(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user' })
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.usersService.deactivate(id, requesterId);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite a new team member' })
  async invite(
    @Body() body: { email: string; role?: string },
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') invitedById: string,
  ) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const invitation = await this.prisma.invitation.create({
      data: {
        email: body.email.toLowerCase(),
        role: (body.role ?? 'MEMBER') as any,
        organizationId,
        invitedById,
        expiresAt,
      },
    });
    // TODO: send invitation email
    return { invitation, message: `Invitation sent to ${body.email}` };
  }

  @Get('invitations/list')
  @ApiOperation({ summary: 'List pending invitations' })
  async listInvitations(@CurrentUser('organizationId') organizationId: string) {
    return this.prisma.invitation.findMany({
      where: { organizationId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
