import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  countInStock: Number,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;