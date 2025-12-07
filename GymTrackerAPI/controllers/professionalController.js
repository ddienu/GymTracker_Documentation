import profileRepository from "../repositories/profileRepository.js";
import professionalService from "../services/professionalService.js";
import profileService from "../services/profileService.js";

const professionalController = {
  async getRoleByProfileEmail(req, res, next) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const result = await professionalService.getRoleByProfileEmail(email);
      console.log(result);
      return res.status(200).json({
        message: "Role by email founded",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfessionalByEmail(req, res, next) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const profile = await profileService.getProfileByEmail(email);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res.status(200).json({
        message: "Profile found",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async createProfessionalByEmail(req, res, next) {
    try {
      const professionalData = req.body;
      const { email } = req.query;

      // console.log(!{ email });
      // console.log(professionalData);

      if ({ email }.email == undefined) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      await professionalService.createProfessional(email, professionalData);

      return res.status(201).json({
        message: "Professional created successfully",
        status: 201,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  },

  async createProfessionalProfile(req, res, next) {
    try {
      // El userId se obtiene del token verificado por el authMiddleware
      const { id: userId } = req.user;

      // Los detalles del perfil profesional se obtienen del cuerpo de la petición
      const professionalData = req.body;

      const newProfessional =
        await professionalService.createProfessionalProfile(
          userId,
          professionalData
        );

      res.status(201).json({
        message: "Professional profile created successfully.",
        professional: newProfessional,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllProfessionals(req, res, next) {
    try {
      const professionals = await professionalService.getAllProfessionals();
      res.status(200).json(professionals);
    } catch (error) {
      next(error);
    }
  },

  async getProfessionalById(req, res, next) {
    try {
      const { id } = req.params;
      const professional = await professionalService.getProfessionalById(id);

      if (!professional) {
        const error = new Error("Professional not found.");
        error.statusCode = 404;
        return next(error);
      }

      res.status(200).json(professional);
    } catch (error) {
      next(error);
    }
  },

  async updateProfessionalProfile(req, res, next) {
    try {
      const { id: professionalId } = req.params; // ID del perfil de especialista a actualizar
      const professionalData = req.body; // Nuevos datos
      const { id: userId } = req.user; // ID del usuario que hace la petición

      const updatedProfessional =
        await professionalService.updateProfessionalProfile(
          userId,
          professionalId,
          professionalData
        );

      res.status(200).json({
        message: "Professional profile updated successfully.",
        professional: updatedProfessional,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProfessionalProfile(req, res, next) {
    try {
      const { professionalId } = req.params;

      if(!professionalId){
        return res.status(400).json({
          message: "ProfessionalId is required"
        })
      }

      await professionalService.deleteProfessionalProfile(
        professionalId
      );

      res.status(200).json({ 
        message: "Professional profile deleted successfully." 
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfessionalAvailability(req, res, next) {
    try {
      const { id: professionalId } = req.params;
      const date = req.query.date;
      const availableSlots =
        await professionalService.getProfessionalAvailability(professionalId, date);
      res.status(200).json({
        message: `Professional availabity for: ${date}`,
        data: availableSlots
      });
    } catch (error) {
      next(error);
    }
  },

  async getAssignedClients(req, res, next) {
    try {
      const { id: userId } = req.user;
      const clients = await professionalService.getClientsForProfessional(
        userId
      );
      res.status(200).json({
        message: "Assigned clients retrieved successfully.",
        clients,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllClientsWithGoals(req, res, next) {
    try {
      const { id: userId } = req.user;
      const clients = await professionalService.getAllClientsWithGoals(userId);
      res.status(200).json({
        message: "All clients with goals retrieved successfully.",
        clients,
      });
    } catch (error) {
      next(error);
    }
  },

  async getClientGoals(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { clientId } = req.params;
      const client = await professionalService.getClientGoalsById(
        userId,
        clientId
      );
      res.status(200).json({
        message: "Client goals retrieved successfully.",
        client,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfessionalAndProfile(req, res, next){
    try{
      const professionalId = req.params.professionalId;
      console.log(professionalId);
      const professionalData = req.body;
      console.log(professionalData);

      if(!professionalId){
        return res.status(400).json({
          message: "ProfessionalId is required"
        });
      }

      if(!professionalData){
        return res.status(400).json({
          message: "Required fields are missing"
        });
      }

      const result = await professionalService.updateProfessionalAndProfile(professionalId, professionalData);

      if(result.affectedRows === 0){
        return res.status(404).json({ message: "Profesional no encontrado" });
      }

      return res.status(200).json({ message: "Profesional actualizado correctamente" });

    }catch(error){
      next(error);
    }
  },

  async getProfessionalAndProfileData(req,res,next){
    try{
      const professionalId = req.params.professionalId;

      if(!professionalId){
        return res.status(400).json({
          message: "ProfesionalId is required"
        });
      }

      const result = await professionalService.getProfessionalAndProfileData(professionalId);
      return res.status(200).json({
        message: "Professional and profile retrieved successfully",
        data: result
      });

    }catch(error){
      next(error);
    }
  },

  async getProfessionalAppointments(req,res,next){
    try{
      const professionalId = req.params.professionalId;
      const date = req.query.date;
      if(!professionalId || !date){
        return res.status(400).json({
          message: "Missing required fields"
        });
      }

      const result = await professionalService.getProfessionalAppointments(professionalId, date);
      return res.status(200).json({
        message: `Appointments for professional with ID: ${professionalId} retrieved successfully`,
        data: result
      });

    }catch(error){
      next(error);
    }
  }
};

export default professionalController;
