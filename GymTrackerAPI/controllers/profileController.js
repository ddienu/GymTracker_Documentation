import profileService from '../services/profileService.js';

const profileController = {
  /**
   * Obtiene el perfil del usuario autenticado.
   */
  async getProfile(req, res, next) {
    try {
      // El user_id es añadido al objeto req por el authMiddleware
      const userId = req.user.userId;

      const userProfile = await profileService.getProfileByUserId(userId);

      if (!userProfile) {
        const error = new Error('Profile not found.');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza el perfil del usuario autenticado.
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const profileData = req.body;
      
      const updatedProfile = await profileService.updateProfileByUserId(userId, profileData);
      
      res.status(200).json({ message: 'Perfil actualizado con éxito.', profile: updatedProfile });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Crea un nuevo perfil.
   */
  async createProfile(req, res, next) {
    try {
      const profileData = req.body;
      const newProfile = await profileService.createProfile(profileData);
      res.status(201).json({ message: 'Perfil creado con éxito.', profile: newProfile });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtiene un perfil por su ID.
   */
  async getProfileById(req, res, next) {
    try {
      const { id } = req.params;
      const profile = await profileService.getProfileById(id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualiza un perfil por su ID.
   */
  async updateProfileById(req, res, next) {
    try {
      const { id } = req.params;
      const profileData = req.body;

      if (Object.keys(profileData).length === 0) {
        return res.status(400).json({ message: 'No se enviaron datos para actualizar.' });
      }

      const updatedProfile = await profileService.updateProfile(id, profileData);
      res.status(200).json({ message: 'Perfil actualizado con éxito.', profile: updatedProfile });
    } catch (error) {
      next(error);
    }
  }
};

export default profileController; 