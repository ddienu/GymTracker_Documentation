import clientRepository from "../repositories/clientRepository.js";
import paymentRepository from "../repositories/paymentRepository.js";
import CustomError from '../utils/CustomError.js';

class PaymentService {
    async getPaymentsByProfileId(profileId) {
        //1. Se busca el cliente por profileId
        const clientFounded = await clientRepository.findByProfileId(profileId);
        console.log(clientFounded);

        if(!clientFounded){
            throw new CustomError("Cliente no encontrado", 404);
        }

        //2. Se traen los pagos por el id del cliente
        const paymentsFounded = await paymentRepository.getPaymentsByClientId(clientFounded.client_id);
        return paymentsFounded;
    };

    async getPaymentsByClientId(clientId){
        const paymentsFounded = await paymentRepository.getPaymentsByClientId(clientId);
        return paymentsFounded;
    }
}

export default new PaymentService();