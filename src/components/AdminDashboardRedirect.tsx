import { redirect } from 'next/navigation'

export const AdminDashboardRedirect = () => {
  redirect('/admin/collections/posts')
}
