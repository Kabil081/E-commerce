const mongodb=require('mongoose')
const ProductSchema=new mongodb.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
}, { timestamps: true });
const Product=mongodb.model('Product',ProductSchema);
module.exports=Product;