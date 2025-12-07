import profileRepository from '../repositories/profileRepository.js';
import CustomError from '../utils/CustomError.js';

class ProfileService {
  /**
   * Obtiene un perfil por el ID del usuario.
   * @param {number} userId - El ID del usuario.
   */
  async getProfileByUserId(userId) {
    const profile = await profileRepository.findByUserId(userId);
    return profile;
  }

  async getProfileByEmail(email){
    const profile = await profileRepository.findProfileByEmail(email);
    return profile;
  }

  /**
   * Actualiza el perfil de un usuario.
   * @param {number} userId - El ID del usuario cuyo perfil se va a actualizar.
   * @param {object} profileData - Los datos a actualizar.
   */
  async updateProfileByUserId(userId, profileData) {
    // Primero, nos aseguramos de que el perfil exista
    const existingProfile = await this.getProfileByUserId(userId);
    if (!existingProfile) {
        throw new CustomError('Profile not found for this user.', 404);
    }

    const updatedProfile = await profileRepository.update(existingProfile.profile_id, profileData);
    return updatedProfile;
  }

  /**
   * Crea un nuevo perfil.
   * @param {object} profileData - Los datos del perfil.
   * @returns {Promise<object>} El perfil creado.
   */
  async createProfile(profileData) {
    const newProfile = await profileRepository.create(profileData);
    return newProfile;
  }

  /**
   * Obtiene un perfil por su ID.
   * @param {number} profileId - El ID del perfil.
   * @returns {Promise<object>} El perfil encontrado.
   */
  async getProfileById(profileId) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw new CustomError('Perfil no encontrado.', 404);
    }
    return profile;
  }

  /**
   * Actualiza un perfil por su ID.
   * @param {number} profileId - El ID del perfil.
   * @param {object} profileData - Los datos a actualizar.
   * @returns {Promise<object>} El perfil actualizado.
   */
  async updateProfile(profileId, profileData) {
    const existingProfile = await profileRepository.findById(profileId);
    if (!existingProfile) {
      throw new CustomError('Perfil no encontrado.', 404);
    }

    const updatedProfile = await profileRepository.update(profileId, profileData);
    return updatedProfile;
  }
}

export default new ProfileService(); 