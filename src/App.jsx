import { Route, Routes } from "react-router-dom";
import PanoramaViewer from "./components/PanoramaViewer/PanoramaViewer";

import ProductView from "./components/Products/Product/ProductView";


function App() {
  return (
    <Routes>
      <Route path="/" element={<PanoramaViewer />} />
      <Route path="/product-one" element={<ProductView />} />
     
    </Routes>
  );
}

export default App;
