import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/enums';
import AppDataSource from 'src/database/data-source';

async function seedUsers() {
  await AppDataSource.initialize();

  try {
    const userRepository = AppDataSource.getRepository(User);

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

    const passwordHash = await bcrypt.hash('Admin@123', 10);

    for (const user of users) {
      const exists = await userRepository.findOne({
        where: { email: user.email },
      });

      if (!exists) {
        const newUser = userRepository.create({
          ...user,
          passwordHash,
        });

        await userRepository.save(newUser);
        console.log(`Created user: ${user.email}`);
      } else {
        console.log(`User already exists: ${user.email}`);
      }
    }
  } finally {
    await AppDataSource.destroy();
  }
}

seedUsers().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});