import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
    description: { type: String, default: '' },

    // Extra fields used by the admin UI (previously mock data)
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    category: { type: String, default: '' },

    // Stock field used by the store + admin UI (admin calls it `stock`)
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
