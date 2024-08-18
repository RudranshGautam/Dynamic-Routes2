const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'cart.json');

module.exports = class Cart {
    static getCart(userId) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                if (err) {
                    return reject(err);
                }
                const cart = JSON.parse(fileContent);
                if (cart.userId === userId) {
                    resolve(cart);
                } else {
                    resolve({ products: [], totalPrice: 0 });
                }
            });
        });
    }

    static addProduct(userId, id, productTitle, productPrice) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                let cart = { userId: userId, products: [], totalPrice: 0 };

                if (!err) {
                    cart = JSON.parse(fileContent);
                    if (cart.userId !== userId) {
                        cart = { userId: userId, products: [], totalPrice: 0 };
                    }
                }

                const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
                const existingProduct = cart.products[existingProductIndex];
                let updatedProduct;

                if (existingProduct) {
                    updatedProduct = { ...existingProduct };
                    updatedProduct.qty += 1;
                    cart.products[existingProductIndex] = updatedProduct;
                } else {
                    updatedProduct = { id: id, qty: 1, title: productTitle, price: productPrice };
                    cart.products = [...cart.products, updatedProduct];
                }

                cart.totalPrice += productPrice;

                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    }
};

