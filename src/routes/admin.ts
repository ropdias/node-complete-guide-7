import express from 'express';
import {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from '../controllers/admin';

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId', getEditProduct);

// Remember when using post requests you don't need to pass dynamic segment
// and the data can be enclosed in the request body we are sending
router.post('/edit-product', postEditProduct);

router.post('/delete-product', postDeleteProduct);

export default router;
