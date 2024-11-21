const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: Number,
        },
    ],
    total: { type: Number, default: 0 }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
