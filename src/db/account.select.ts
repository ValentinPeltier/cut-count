export const AccountWithUserSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  importedFileDate: true,
  status: true,
  feedbackDate: true,
  organizationVersionId: true,
  organizationVersion: {
    select: {
      id: true,
      organizationId: true,
    },
  },
  role: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      level: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      password: true,
      resetToken: true,
      source: true,
    },
  },
}
