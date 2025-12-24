import mealService from '../services/mealService.js';

/**
 * El Controlador de Comidas maneja las solicitudes HTTP.
 */
class MealController {
  async createMeal(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const newMeal = await mealService.createMeal(req.body);
      res.status(201).json(newMeal);
    } catch (error) {
      next(error);
    }
  }

  async getAllMeals(req, res, next) {
    try {
      const meals = await mealService.getAllMeals();
      res.status(200).json(meals);
    } catch (error) {
      next(error);
    }
  }

  async getMealById(req, res, next) {
    try {
      const { id } = req.params;
      const meal = await mealService.getMealById(id);
      res.status(200).json(meal);
    } catch (error) {
      next(error);
    }
  }

  async updateMeal(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        const error = new Error('El campo nombre es obligatorio.');
        error.statusCode = 400;
        throw error;
      }
      const updatedMeal = await mealService.updateMeal(id, req.body);
      res.status(200).json(updatedMeal);
    } catch (error) {
      next(error);
    }
  }

  async deleteMeal(req, res, next) {
    try {
      const { id } = req.params;
      await mealService.deleteMeal(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new MealController(); 