// admin/users/page.tsx
import { prisma } from '@/lib/prisma';
export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <table className="w-full text-sm">
      <thead><tr><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.blocked ? 'Blocked' : 'Active'}</td>
            <td>
              {!u.blocked && (
                <form action={`/api/admin/users/${u.id}/block`} method="post">
                  <button className="text-red-600">Block</button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
