import { products } from "./dummyData";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function fetchProducts() {
  await delay(300);
  return products.filter((p) => !p.isDeleted);
}

export async function addProduct(newProduct) {
  await delay(300);
  const product = { id: Date.now(), ...newProduct, isDeleted: false };
  products.push(product);
  return product;
}

export async function updateProduct(updatedProduct) {
  await delay(300);
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return products[index];
  }
  throw new Error("Product not found");
}

export async function softDeleteProduct(id) {
  await delay(200);
  const product = products.find((p) => p.id === id);
  if (product) product.isDeleted = true;
  return { success: true, id };
}
