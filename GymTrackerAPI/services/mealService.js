import mealRepository from '../repositories/mealRepository.js';

/**
 * La Capa de Servicio para Comidas.
 */
class MealService {
  async createMeal(data) {
    const result = await mealRepository.create(data);
    return await mealRepository.findById(result.insertId);
  }

  async getAllMeals() {
    return await mealRepository.findAll();
  }

  async getMealById(id) {
    const meal = await mealRepository.findById(id);
    if (!meal) {
      const error = new Error('Comida no encontrada.');
      error.statusCode = 404;
      throw error;
    }
    return meal;
  }

  async updateMeal(id, data) {
    await this.getMealById(id); // Validar existencia
    await mealRepository.update(id, data);
    return await mealRepository.findById(id);
  }

  async deleteMeal(id) {
    await this.getMealById(id); // Validar existencia
    await mealRepository.remove(id);
  }
}

export default new MealService(); 