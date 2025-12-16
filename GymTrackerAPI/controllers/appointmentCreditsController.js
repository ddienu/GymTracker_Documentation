import appointmentCreditsService from "../services/appointmentCreditsService.js";

const appointmentCreditsController = {
    async getAppointmentCredits(req, res, next){
        try{
            const profileId = req.params.profileId;

            if(!profileId){
                return res.status(400).json({
                    message: "El id del perfil es requerido"
                });
            }

            const result = await appointmentCreditsService.getAppointmentCredits(profileId);
            
            if(result.length === 0){
                return res.status(204).json({
                    message: "El cliente no tiene créditos disponibles"
                });
            };

            return res.status(200).json({
                message: "Citas disponibles obtenidas correctamente",
                data: result
            });
        }catch(error){
            next(error);
        }
    }
}

export default appointmentCreditsController;