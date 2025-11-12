import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct, updateProduct } from "../api/mockApi";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price must be positive"),
  stock: z.number().min(0, "Stock must be zero or more"),
});

export default function ProductForm({ editingProduct, onCancelEdit }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: "", stock: "" },
  });

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock,
      });
    } else {
      reset({ name: "", price: "", stock: "" });
    }
  }, [editingProduct, reset]);

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products"], (old = []) => [...old, newProduct]);
      reset();
    },
  });

  const editMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (updated) => {
      queryClient.setQueryData(["products"], (old = []) =>
        old.map((p) => (p.id === updated.id ? updated : p))
      );
      reset();
      onCancelEdit?.();
    },
  });

  const onSubmit = (data) => {
    const formatted = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    };
    if (editingProduct) {
      editMutation.mutate({ id: editingProduct.id, ...formatted });
    } else {
      addMutation.mutate(formatted);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-end gap-3 p-3 bg-white rounded-lg shadow-sm max-w-5xl mx-auto text-sm"
    >
      {/* Inputs in one line */}
      <div className="flex items-center gap-3 flex-nowrap w-full justify-end">
        <input
          type="text"
          placeholder="Product Name"
          {...register("name")}
          className="border p-2 rounded w-1/5 focus:ring focus:ring-blue-200"
        />

        <input
          type="number"
          placeholder="Price"
          {...register("price", { valueAsNumber: true })}
          className="border p-2 rounded w-1/5 focus:ring focus:ring-blue-200"
        />

        <input
          type="number"
          placeholder="Stock"
          {...register("stock", { valueAsNumber: true })}
          className="border p-2 rounded w-1/5 focus:ring focus:ring-blue-200"
        />

        {/* Buttons aligned right */}
        <div className="flex gap-2">
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                reset();
                onCancelEdit?.();
              }}
              className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`px-5 py-1.5 rounded text-white transition ${
              editingProduct
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editingProduct ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}
