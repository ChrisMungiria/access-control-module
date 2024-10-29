import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user.roleId !== 1) {
      throw new ForbiddenException(
        'You do not have permission to create projects',
      );
    }

    return this.projectsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(@Request() req) {
    const user = req.user;
    return await this.projectsService.findProjectsByUserRole(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id') id, @Request() req) {
    const user = req.user;

    const project = await this.projectsService.findProjectById(id, user);
    if (!project) {
      throw new ForbiddenException('Project not found');
    }

    return project;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user.roleId !== 1) {
      throw new ForbiddenException(
        'You do not have permission to update projects',
      );
    }

    return this.projectsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email);
    if (user.roleId !== 1) {
      throw new ForbiddenException(
        'You do not have permission to update projects',
      );
    }

    return this.projectsService.delete(id);
  }
}
