import db from '../config/db.js';
import CustomError from '../utils/CustomError.js';
import clientRepository from "../repositories/clientRepository.js";
import appointmentCreditsRepository from '../repositories/appointmentCreditsRepository.js';


const appointmentCreditsService = {

    async getAppointmentCredits(profileId) {
        const clientFounded = await clientRepository.findByProfileId(profileId);

        if (!clientFounded) {
            throw new CustomError("Cliente no encontrado", 404);
        }

        const appointmentCredits = await appointmentCreditsRepository.getAppointmentCreditsByClientId(clientFounded.client_id);

        return appointmentCredits;
    }

}

export default appointmentCreditsService; 