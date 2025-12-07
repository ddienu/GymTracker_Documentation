import exerciseRepository from '../repositories/exerciseRepository.js';

/**
 * La Capa de Servicio para Ejercicios.
 */
class ExerciseService {
  async createExercise(data) {
    const result = await exerciseRepository.create(data);
    return await exerciseRepository.findById(result.insertId);
  }

  async getAllExercises() {
    return await exerciseRepository.findAll();
  }

  async getExerciseById(id) {
    const exercise = await exerciseRepository.findById(id);
    if (!exercise) {
      const error = new Error('Ejercicio no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return exercise;
  }

  async updateExercise(id, data) {
    await this.getExerciseById(id); // Validar existencia
    await exerciseRepository.update(id, data);
    return await exerciseRepository.findById(id);
  }

  async deleteExercise(id) {
    await this.getExerciseById(id); // Validar existencia
    await exerciseRepository.remove(id);
  }
}

export default new ExerciseService(); 