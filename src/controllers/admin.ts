import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';

export const getAddProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

export const postAddProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // We can use the "magic association" method createProduct() to create
  // a new product associated to the user
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEditProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // We are already coming from a 'edit-product' route but this was added just to show
  // how to retrieve data from a query param:
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // We can use the "magic association" method getProducts() to find
  // a product associated to the user
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0]; // getProducts return an array
      // If we don't have a product and it's undefined:
      if (!product) {
        // We could retrieve a error page (better user experience) but for now we will just redirect:
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Fetch information from the product
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(() => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

export const getProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Fetch information from the product
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
