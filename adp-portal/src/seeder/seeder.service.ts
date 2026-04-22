import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/enums';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async seedUsers() {
    console.log('Seeding users...');
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@test.com',
        role: UserRole.ADMIN,
      },
      {
        fullName: 'Development Wing User',
        email: 'dev@test.com',
        role: UserRole.DEVELOPMENT_WING,
      },
      {
        fullName: 'Works & Services User',
        email: 'works@test.com',
        role: UserRole.WORKS_AND_SERVICES,
      },
      {
        fullName: 'P&D Wing User',
        email: 'pnd@test.com',
        role: UserRole.PND_WING,
      },
      {
        fullName: 'Finance User',
        email: 'finance@test.com',
        role: UserRole.FINANCE_DEPARTMENT,
      },
      {
        fullName: 'Authority User',
        email: 'authority@test.com',
        role: UserRole.COMPETENT_AUTHORITY,
      },
    ];

    console.log('Seeding users...');

    const dbInfo = await this.userRepository.query(
      'SELECT current_database(), current_schema()',
    );
    console.log('Seeder DB info:', dbInfo);

    const beforeCount = await this.userRepository.count();
    console.log('Seeder user count before:', beforeCount);
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    for (const user of users) {
      const exists = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (!exists) {
        const newUser = this.userRepository.create({
          ...user,
          passwordHash,
        });

        await this.userRepository.save(newUser);
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }
    const afterCount = await this.userRepository.count();
    console.log('Seeder user count after:', afterCount);
  }
}