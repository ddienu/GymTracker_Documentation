import cartService from '../services/cartService.js';

const cartController = {
    async getCart(req, res, next) {
        try {
            const userId = req.params.clientId;
            const cart = await cartService.getCart(userId);
            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    },

    async addItemToCart(req, res, next) {
        try {
            const userId = req.params.clientId;
            const { itemType, itemId, quantity } = req.body;

            // La validación básica de los datos se delega al servicio.
            const updatedCart = await cartService.addItemToCart(userId, { itemType, itemId, quantity });
            
            res.status(200).json(updatedCart);
        } catch (error) {
            next(error);
        }
    },

    async updateQuantityInCart(req, res, next) {
        try {
            const userId = req.params.clientId;
            const { itemType, itemId, quantity } = req.body;
            // const { productId } = req.params;
            // const { quantity } = req.body;
            
            if( !itemType || !itemId || !quantity ){
                return res.status(400).json({
                    message: "Required fields are missing"
                });
            };

            if(itemType == "product"){
                const updatedProduct = await cartService.updateProductQuantityInCart(userId, itemId, quantity);
                return res.status(200).json({
                    message: "Product quantity updated successfully",
                    data: updatedProduct
                })
            }else if( itemType == "service"){
                const updatedService = await cartService.updateServiceQuantityInCart(userId, itemId, quantity);
                return res.status(200).json({
                    message: "Service quantity updated successfully",
                    data: updatedService
                })
            }else{
                return res.status(404).json({
                    message: "Invalid item"
                });
            };
        } catch (error) {
            next(error);
        }
    },

    async removeItemFromCart(req, res, next){
        try{    
            const clientId = req.params.clientId;
            const { itemType, itemId } = req.body;

            if(!clientId || !itemType || !itemId ){
                return res.status(400).json({
                    message: "Required fields are missing"
                });
            };

            if(itemType == "product"){
                const productRemoved = await cartService.removeProductFromCart(clientId, itemId);
                return res.status(200).json({
                    message: "Product removed from cart successfully"
                });
            }else if(itemType == "service"){
                const serviceRemoved = await cartService.removeServiceFromCart(clientId, itemId);
                return res.status(200).json({
                    message: "Service removed from cart successfully"
                });
            }else{
                return res.status(400).json({
                    message: "Invalid product type"
                });
            }

        }catch(error){
            next(error);
        }
    },

    async removeProductFromCart(req, res, next) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            
            // Esta lógica también necesitará ser generalizada
            const updatedCart = await cartService.removeProductFromCart(userId, productId);

            res.status(200).json(updatedCart);
        } catch (error) {
            next(error);
        }
    },

    async updateServiceQuantityInCart(req, res, next){
        try{
            const userId = req.user.id;
            const { serviceId } = req.params;
            const { quantity } = req.body;
            
            if(!userId || !serviceId || !quantity){
                return res.status(400).json({
                    message: "Campos requeridos faltantes"
                });
            };

            const result = await cartService.updateServiceQuantityInCart(userId, serviceId, quantity);
            return res.status(200).json({
                message: "Service quantity updated successfully",
                data: result
            });
        }catch(error){
            next(error);
        }
    },

    async removeServiceFromCart(req, res, next) {
        try {
            const userId = req.user.id;
            const { serviceId } = req.params;
            
            // Esta lógica también necesitará ser generalizada
            const result = await cartService.removeServiceFromCart(userId, serviceId);

            return res.status(200).json({
                message: "Service deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async clearCart(req, res, next) {
        try {
            const userId = req.params.clientId;
            console.log(userId);
            if(!userId){
                return res.status(400).json({
                    message: "Client ID is required"
                });
            };

            const result = await cartService.clearCart(userId);
            return res.status(200).json({ 
                message: 'Cart cleared successfully'
             });
        } catch (error) {
            next(error);
        }
    }
};

export default cartController; 