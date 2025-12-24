import paymentService from "../services/paymentService.js";

class PaymentController {
    async getPaymentsByProfileId(req, res, next) {
        try {
            const profileId = req.params.profileId;

            if (!profileId) {
                return res.status(400).json({
                    message: "El id del perfil es requerido"
                });
            }

            const result = await paymentService.getPaymentsByProfileId(profileId);

            if (result.length === 0) {
                return res.status(204);
            }

            return res.status(200).json({
                message: "Listado de pagos obtenido satisfactoriamente",
                data: result
            })
        } catch (error) {
            next(error);
        }
    };

    async getPaymentsByClientId(req, res, next){
        try{
            const clientId = req.params.clientId;

            if(!clientId){
                return res.status(400).json({
                    message: "El id del cliente es requerido"
                });
            }

            const result = await paymentService.getPaymentsByClientId(clientId);

            return res.status(200).json({
                message: "Listado de pagos obtenido satisfactoriamente",
                data: result
            });

        }catch(error){
            next(error);
        }
    }
}

export default new PaymentController();