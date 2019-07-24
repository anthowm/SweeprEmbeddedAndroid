/**
 * Action types
 */

export const FETCH_PROFILE_REQUESTED = 'FETCH_PROFILE_REQUESTED';
export const SET_USER_SKILL_LEVEL_REQUESTED = 'SET_USER_SKILL_LEVEL_REQUESTED';
export const UPDATE_USER_SKILL_LEVEL_REQUESTED = 'UPDATE_USER_SKILL_LEVEL_REQUESTED';

/**
 * Action creators
 */

export function getProfile() {
  return { type: FETCH_PROFILE_REQUESTED };
}

export function setUserSkillLevel(skillLevel) {
  return { type: SET_USER_SKILL_LEVEL_REQUESTED, skillLevel };
}

export function updateUserSkillLevel(skillLevel) {
  return { type: UPDATE_USER_SKILL_LEVEL_REQUESTED, skillLevel };
}
