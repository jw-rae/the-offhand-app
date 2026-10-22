import type { Access, PayloadRequest, Where } from 'payload'

export type UserRole = 'admin' | 'editor' | 'author'

type AuthenticatedUser = {
  id: number | string
  role?: UserRole
}

export function isAuthenticatedUser(user: unknown): user is AuthenticatedUser {
  return typeof user === 'object' && user !== null && 'id' in user
}

export function hasRole(user: unknown, role: UserRole): boolean {
  return isAuthenticatedUser(user) && user.role === role
}

export function isAdmin(user: unknown): boolean {
  return hasRole(user, 'admin')
}

export const adminOnlyAccess: Access = ({ req }) => isAdmin(req.user)

export const adminPanelAccess = ({ req }: { req: PayloadRequest }): boolean =>
  isAuthenticatedUser(req.user)

export const postReadAccess: Access = ({ req }) => {
  if (isAdmin(req.user) || hasRole(req.user, 'editor')) return true
  const publishedPosts: Where = { _status: { equals: 'published' } }
  if (!isAuthenticatedUser(req.user)) return publishedPosts

  const authoredPosts: Where = { author: { equals: req.user.id } }
  const publishedOrOwnedPosts: Where = { or: [publishedPosts, authoredPosts] }
  return publishedOrOwnedPosts
}

export const postCreateAccess: Access = ({ req }) =>
  isAuthenticatedUser(req.user) &&
  (isAdmin(req.user) || hasRole(req.user, 'editor') || hasRole(req.user, 'author'))

export const postUpdateAccess: Access = ({ req }) => {
  if (isAdmin(req.user) || hasRole(req.user, 'editor')) return true
  if (!isAuthenticatedUser(req.user)) return false

  return { author: { equals: req.user.id } }
}
