/**
 * Type transformers
 * Handles conversion between frontend and backend data structures
 */

import { User } from '@/types/auth';
import { UserData, UserProfile } from '@/types/user';

/**
 * Transform backend UserData to frontend User
 * Converts snake_case to camelCase and restructures data
 */
export function fromUserDTO(data: UserData): User {
  const profile = data.profile;

  return {
    id: data.id?.toString() || '',
    email: data.email || '',
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    profilePicture: profile?.avatar_url,
    dateOfBirth: profile?.date_of_birth,
    gender: profile?.gender as User['gender'],
    phoneNumber: data.phone_number,
    emailVerified: data.email_verified,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
}

/**
 * Transform frontend User to backend UserData
 * Converts camelCase to snake_case and restructures data
 */
export function toUserDTO(user: User): UserData {
  const profile: UserProfile = {
    first_name: user.firstName,
    last_name: user.lastName,
    avatar_url: user.profilePicture,
    date_of_birth: user.dateOfBirth,
    gender: user.gender,
  };

  return {
    id: user.id ? parseInt(user.id) : undefined,
    email: user.email,
    phone_number: user.phoneNumber,
    email_verified: user.emailVerified,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    profile,
  };
}

/**
 * Transform partial User update to backend format
 */
export function toUpdateUserDTO(
  user: Partial<User>
): Partial<UserData> & { profile?: Partial<UserProfile> } {
  const result: Partial<UserData> & { profile?: Partial<UserProfile> } = {};

  if (user.email !== undefined) result.email = user.email;
  if (user.phoneNumber !== undefined) result.phone_number = user.phoneNumber;
  if (user.emailVerified !== undefined)
    result.email_verified = user.emailVerified;

  // Build profile object if any profile fields are present
  const profileFields = [
    'firstName',
    'lastName',
    'profilePicture',
    'dateOfBirth',
    'gender',
  ] as const;
  const hasProfileFields = profileFields.some(
    field => user[field] !== undefined
  );

  if (hasProfileFields) {
    result.profile = {};
    if (user.firstName !== undefined)
      result.profile.first_name = user.firstName;
    if (user.lastName !== undefined) result.profile.last_name = user.lastName;
    if (user.profilePicture !== undefined)
      result.profile.avatar_url = user.profilePicture;
    if (user.dateOfBirth !== undefined)
      result.profile.date_of_birth = user.dateOfBirth;
    if (user.gender !== undefined) result.profile.gender = user.gender;
  }

  return result;
}

/**
 * Format date string to YYYY-MM-DD format for API
 */
export function formatDateForAPI(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string from API (YYYY-MM-DD) to Date object
 */
export function parseDateFromAPI(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Validate and transform gender value
 */
export function normalizeGender(
  gender: string | undefined
): User['gender'] | undefined {
  if (!gender) return undefined;

  const normalizedGender = gender.toLowerCase();
  if (
    normalizedGender === 'male' ||
    normalizedGender === 'female' ||
    normalizedGender === 'other' ||
    normalizedGender === 'prefer-not-to-say'
  ) {
    return normalizedGender as User['gender'];
  }

  return undefined;
}

/**
 * Safely parse numeric ID from various formats
 */
export function parseNumericId(
  id: string | number | undefined
): number | undefined {
  if (id === undefined || id === null) return undefined;

  const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Safely convert ID to string format
 */
export function stringifyId(id: string | number | undefined): string {
  if (id === undefined || id === null) return '';
  return String(id);
}
