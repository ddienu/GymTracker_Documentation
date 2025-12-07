import clientOrderService from "../services/clientOrderService.js";

class ClientOrderController {

    async createClientOrder(req, res, next) {
        try {
            const profileId = req.params.profileId;
            const paymentMethodId = req.body.paymentMethodId;
            console.log(paymentMethodId);

            if (!profileId || !paymentMethodId) {
                return res.status(400).json({
                    message: "Missing required fields"
                })
            };

            const response = await clientOrderService.createClientOrder(profileId, paymentMethodId);
            if (!response) {
                return res.status(404).json({
                    message: "Error generando la orden"
                })
            };

            return res.status(201).json({
                message: "Orden generada satisfactoriamente",
                data: response
            });
        } catch (error) {
            next(error);
        }
    };

    async getClientOrderById(req, res, next){
        const clientOrderId = req.params.clientOrderId;

        if(!clientOrderId){
            return res.status(400).json({
                message: "El id de la orden es requerido"
            });
        }

        const result = await clientOrderService.getClientOrderById(clientOrderId);
        if(!result){
            return res.status(204);
        }

        return res.status(200).json({
            message: "Orden del cliente obtenida satisfactoriamente",
            data: result
        });
    }
}

export default new ClientOrderController();