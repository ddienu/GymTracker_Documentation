import exerciseService from '../services/exerciseService.js';

/**
 * El Controlador de Ejercicios maneja las solicitudes HTTP.
 */
class ExerciseController {
  async createExercise(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const newExercise = await exerciseService.createExercise(req.body);
      res.status(201).json(newExercise);
    } catch (error) {
      next(error);
    }
  }

  async getAllExercises(req, res, next) {
    try {
      const exercises = await exerciseService.getAllExercises();
      res.status(200).json(exercises);
    } catch (error) {
      next(error);
    }
  }

  async getExerciseById(req, res, next) {
    try {
      const { id } = req.params;
      const exercise = await exerciseService.getExerciseById(id);
      res.status(200).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async updateExercise(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const updatedExercise = await exerciseService.updateExercise(id, req.body);
      res.status(200).json(updatedExercise);
    } catch (error) {
      next(error);
    }
  }

  async deleteExercise(req, res, next) {
    try {
      const { id } = req.params;
      await exerciseService.deleteExercise(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ExerciseController(); 