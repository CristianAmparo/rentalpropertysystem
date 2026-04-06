import jwt from 'jsonwebtoken';
import { prisma } from './server/utils/prisma';

const secret = process.env.JWT_ACCESS_SECRET || 'fallback-secret-key-12345';

async function run() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin found');

  const token = jwt.sign({ userId: admin.id, email: admin.email, role: admin.role }, secret, { expiresIn: '7d' });
  const cookie = `auth_token=${token}`;

  console.log('Fetching properties...');
  const propRes = await fetch('http://localhost:3000/api/admin/properties?isArchived=false', {
    headers: { cookie }
  });
  if (!propRes.ok) console.log('Props Error:', propRes.status, await propRes.text());
  else console.log('Props:', await propRes.json());

  console.log('Fetching applications...');
  const appRes = await fetch('http://localhost:3000/api/admin/applications', {
    headers: { cookie }
  });
  if (!appRes.ok) console.log('Apps Error:', appRes.status, await appRes.text());
  else console.log('Apps:', await appRes.json());

  console.log('Fetching users...');
  const userRes = await fetch('http://localhost:3000/api/admin/users', {
    headers: { cookie }
  });
  if (!userRes.ok) console.log('Users Error:', userRes.status, await userRes.text());
  else console.log('Users:', await userRes.json());

}

run().catch(console.error).finally(() => prisma.$disconnect());
