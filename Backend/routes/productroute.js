import express from 'express';
import Product from '../modules/productmodule.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

const DATA_IMAGE_PATTERN = /^data:image\/(?:png|jpe?g|webp|gif|svg\+xml);base64,[a-z0-9+/=]+$/i;
const HTTP_IMAGE_PATTERN = /^https?:\/\//i;
const APP_IMAGE_PATTERN = /^\/[^\s]*$/;

const normalizeProductImage = (value) => {
  const normalized = value == null ? '' : String(value).trim();

  if (!normalized) return '';
  if (normalized.startsWith('blob:')) {
    throw new Error('Temporary browser image URLs cannot be saved. Please re-upload the image.');
  }

  if (DATA_IMAGE_PATTERN.test(normalized) || HTTP_IMAGE_PATTERN.test(normalized) || APP_IMAGE_PATTERN.test(normalized)) {
    return normalized;
  }

  throw new Error('Product image must be a valid uploaded image, URL, or app image path');
};

// CREATE PRODUCT

router.post('/', protect, requireRole('admin'), async (req, res) => {
  try {
    const { name, price, image, description, countInStock, size, color, category } = req.body;

    if (!name) return res.status(400).json({ message: 'Product name is required' });

    const product = new Product({
      name,
      price,
      image: normalizeProductImage(image),
      description,
      size,
      color,
      category,
      countInStock,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    const status = error?.message?.includes('image') || error?.message?.includes('Temporary browser image URLs') ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
});

//  Read (All) Product file

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read (single) product file



router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update products

router.put('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.image = req.body.image !== undefined ? normalizeProductImage(req.body.image) : product.image;
    product.description = req.body.description ?? product.description;
    product.size = req.body.size ?? product.size;
    product.color = req.body.color ?? product.color;
    product.category = req.body.category ?? product.category;
    product.countInStock = req.body.countInStock ?? product.countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    const status = error?.message?.includes('image') || error?.message?.includes('Temporary browser image URLs') ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
});

//  Delete Product

router.delete('/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
