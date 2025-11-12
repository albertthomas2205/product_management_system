import ProductTable from "../components/ProductTable";


export default function App() {
  return (
    <div className="min-h-screen bg-stone-200 p-3">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🛒 Product Management System
      </h1>
      <ProductTable />
    </div>
  );
}
