// src/components/ProductManager.jsx
import { useState } from "react";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

export default function ProductManager() {
  const [editingProduct, setEditingProduct] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ProductTable onEdit={setEditingProduct} />
    </div>
  );
}
