import jwt from 'jsonwebtoken';

const secret = process.env.JWT_ACCESS_SECRET || 'fallback-secret-key-12345';
const token = jwt.sign({ userId: '1ad10577-4c98-4108-bdcc-3216e4f444a0', email: 'admin@gmail.com', role: 'ADMIN' }, secret);

const res = await fetch('http://localhost:3000/admin/properties', {
  headers: { cookie: `auth_token=${token}; auth_session=active` }
});
const html = await res.text();

// Check if the page contains properties data in the SSR payload
const nuxtData = html.split('__NUXT_DATA__')[1];
if (nuxtData) {
  // Find if properties data is included
  const hasProps = nuxtData.includes('admin-properties-list') || nuxtData.includes('isVacant');
  console.log('Has properties in SSR payload:', hasProps);
  console.log('First 2000 chars of NUXT_DATA:', nuxtData.slice(0, 2000));
} else {
  console.log('No __NUXT_DATA__ found');
  console.log('HTML sample:', html.slice(0, 1000));
}
