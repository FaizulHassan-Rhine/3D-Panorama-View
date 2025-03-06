import ProductAsset from "./ProductAsset";



const ProductView = () => {
  return (
    <div className="flex flex-col py-5 items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">360° Product Viewer</h1>
      <ProductAsset imagePath="/images/product/" imageCount={91} />
      <p className="text-sm text-gray-600 mt-4">Drag to rotate</p>
    </div>
  );
};

export default ProductView;
