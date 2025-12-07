import paymentService from "../services/paymentService.js";

class PaymentController {
    async getPayments(req, res, next) {
        try {
            const profileId = req.params.profileId;

            if (!profileId) {
                return res.status(400).json({
                    message: "El id del perfil es requerido"
                });
            }

            const result = await paymentService.getPaymentsByClientId(profileId);
            console.log("Esto es result", result);

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
    }
}

export default new PaymentController();