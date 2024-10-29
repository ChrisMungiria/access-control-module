import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.project.create({
      data,
    });
  }

  async findProjectsByUserRole(user: any) {
    const userRole = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        roleId: true,
      },
    });
    if (userRole.roleId == 1) {
      // Admin: Return all projects
      return this.prisma.project.findMany({
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
        },
      });
    } else {
      // Engineer and Project Manager: Return projects assigned to them
      return this.prisma.project.findMany({
        where: {
          userId: user.userId,
        },
      });
    }
  }

  async findProjectById(id: string, user: any): Promise<any> {
    const requestingUser = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      select: {
        roleId: true,
      },
    });

    if (requestingUser.roleId === 3) {
      return null;
    }
    return await this.prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.project.update({
      where: {
        id: parseInt(id),
      },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.project.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
