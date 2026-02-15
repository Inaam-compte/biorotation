/**
 * No authentication - all users use the default main account
 */

// Default user ID that all data will be associated with
export const DEFAULT_USER_ID = 'main-account-user-id'

/**
 * Get the default user session (no authentication required)
 */
export const getDefaultUser = () => {
  return {
    user: {
      id: DEFAULT_USER_ID,
      email: 'main@account.local',
      name: 'Compte Principal',
      phone: '+216 00 000 000',
      exploitantName: 'Exploitation Principale',
      gouvernorat: 'Tunis',
      animalCount: 0,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: 'main-session-id',
      userId: DEFAULT_USER_ID,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      token: 'main-token',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

/**
 * Always returns the default user
 */
export const getCurrentUser = () => {
  return getDefaultUser()
}
