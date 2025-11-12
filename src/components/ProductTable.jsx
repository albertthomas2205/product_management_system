import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, softDeleteProduct } from "../api/mockApi";
import ProductForm from "./ProductForm";

export default function ProductTable() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: softDeleteProduct,
    onSuccess: (deleted) => {
      queryClient.setQueryData(["products"], (old = []) =>
        old.filter((p) => p.id !== deleted.id)
      );
    },
  });

  const filteredData = useMemo(
    () => data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (isError) return <p className="p-4 text-red-500">Error loading data</p>;

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // ✅ Format price as Indian currency (e.g., ₹1,250.00)
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6 w-[80%] mx-auto">
      {/* ✅ Form Component */}
      <ProductForm
        editingProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
      />

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border border-gray-300 p-2 rounded w-full mb-4 focus:ring focus:ring-blue-200 mt-4"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-right">Price</th>
              <th className="p-2 border text-right">Stock</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4 italic">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedData.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2 border text-left">{product.name}</td>
                  <td className="p-2 border text-right">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-2 border text-right">{product.stock}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
