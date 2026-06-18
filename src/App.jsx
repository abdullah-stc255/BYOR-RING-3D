import { useState } from "react";
import { product } from "./data/product";
import RingViewer from "./components/RingViewer";
import CartModal from "./components/CartModal";

export default function App() {
  const [selectedMaterials, setSelectedMaterials] = useState({});
  const [selectedComponents, setSelectedComponents] = useState({});
  const [configurator, setConfigurator] = useState({
    materials: [],
    components: [],
  });
  const [cartItem, setCartItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentVariant = product.variants.find((variant) =>
    variant.options.every(
      (opt, index) =>
        opt ===
        [selectedMaterials["Metal 01"], selectedMaterials["Gem 01"]][index],
    ),
  );

  const handleMaterialChange = (configuratorName, optionName) => {
    setSelectedMaterials((prev) => ({
      ...prev,
      [configuratorName]: optionName,
    }));
  };

  const handleComponentChange = (componentName, variationName) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentName]: variationName,
    }));
  };

  const handleConfiguratorReady = (data) => {
    setIsLoading(false);
    setConfigurator(data);
    const defaultMaterials = {};
    data.materials.forEach((mat) => {
      if (mat.options[0]) defaultMaterials[mat.name] = mat.options[0].name;
    });
    setSelectedMaterials(defaultMaterials);

    const defaultComponents = {};
    data.components.forEach((comp) => {
      if (comp.options[0]) defaultComponents[comp.name] = comp.options[0].name;
    });
    setSelectedComponents(defaultComponents);
  };

  const formatPrice = (cents) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const handleAddToCart = () => {
    setCartItem({
      title: product.title,
      ...selectedMaterials,
      ...selectedComponents,
      price: currentVariant?.price,
      formattedPrice: currentVariant ? formatPrice(currentVariant.price) : "—",
    });
  };

  return (
    <div className="flex min-h-screen w-screen bg-[#F4F1EE] text-gray-900 font-sans p-4 gap-4 items-start">
      <CartModal item={cartItem} onClose={() => setCartItem(null)} />

      {/* Left: 3D Viewer — fixed to viewport */}
      <div className="w-1/2 sticky top-4 h-[calc(100vh-2rem)] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white flex-shrink-0">
        <RingViewer
          selectedMaterials={selectedMaterials}
          selectedHead={selectedComponents["Heads"]}
          selectedShank={selectedComponents["Shanks"]}
          onConfiguratorReady={handleConfiguratorReady}
        />
      </div>

      {/* Right: Product Info — scrolls with page */}
      <div className="w-1/2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col px-10 py-10 gap-6">
        {/* Title + Price */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Fine Jewellery
          </p>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight">
            {product.title}
          </h1>
          <p className="text-2xl text-gray-500 mt-2 font-light">
            {currentVariant ? formatPrice(currentVariant.price) : "—"}
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* Skeleton while loading */}
        {isLoading && (
          <div className="flex flex-col gap-6 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
                <div className="flex gap-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-10 h-10 rounded-full bg-gray-200" />
                  ))}
                </div>
              </div>
            ))}
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="h-3 w-20 bg-gray-200 rounded-full" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-14 h-14 rounded-xl bg-gray-200" />
                  ))}
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-gray-100 h-32" />
          </div>
        )}

        {/* Dynamic Material Configurators */}
        {!isLoading && configurator.materials.map((mat) => (
          <div key={mat.name}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              {mat.title}:{" "}
              <span className="text-gray-900 normal-case tracking-normal font-semibold">
                {selectedMaterials[mat.name] || "—"}
              </span>
            </p>
            <div className="flex gap-3 flex-wrap">
              {mat.options.map(({ name, icon }) => {
                const isSelected = selectedMaterials[mat.name] === name;
                return (
                  <button
                    key={name}
                    onClick={() => handleMaterialChange(mat.name, name)}
                    title={name}
                    className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${
                      isSelected
                        ? "border-gray-900 scale-110 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {icon ? (
                      <img
                        src={icon}
                        alt={name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-[8px] text-gray-400 flex items-center justify-center h-full px-1 text-center leading-tight">
                        {name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Dynamic Component Configurators (Heads, Shanks, etc.) */}
        {!isLoading && configurator.components.map((comp) => (
          <div key={comp.name}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              {comp.title}:{" "}
              <span className="text-gray-900 normal-case tracking-normal font-semibold">
                {selectedComponents[comp.name] || "—"}
              </span>
            </p>
            <div className="flex gap-3 flex-wrap">
              {comp.options.map(({ name, icon }) => {
                const isSelected = selectedComponents[comp.name] === name;
                return (
                  <button
                    key={name}
                    onClick={() => handleComponentChange(comp.name, name)}
                    title={name}
                    className={`w-14 h-14 rounded-xl border-2 transition-all overflow-hidden bg-gray-50 ${
                      isSelected
                        ? "border-gray-900 scale-110 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {icon ? (
                      <img
                        src={icon}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[9px] text-gray-400 leading-tight px-1 flex items-center justify-center h-full text-center">
                        {name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <hr className="border-gray-100" />

        {/* Configuration Summary */}
        {!isLoading && (configurator.materials.length > 0 ||
          configurator.components.length > 0) && (
          <div className="rounded-2xl border border-gray-100 bg-[#F9F7F5] p-5 flex flex-col gap-3 text-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Your Configuration
            </p>
            {configurator.materials.map((mat) => (
              <div key={mat.name} className="flex justify-between items-center">
                <span className="text-gray-400">{mat.title}</span>
                <span className="font-medium text-gray-900">
                  {selectedMaterials[mat.name] || "—"}
                </span>
              </div>
            ))}
            {configurator.components.map((comp) => (
              <div
                key={comp.name}
                className="flex justify-between items-center"
              >
                <span className="text-gray-400">{comp.title}</span>
                <span className="font-medium text-gray-900">
                  {selectedComponents[comp.name] || "—"}
                </span>
              </div>
            ))}
            {currentVariant && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(currentVariant.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Availability</span>
                  <span
                    className={`font-medium ${currentVariant.available ? "text-green-600" : "text-red-500"}`}
                  >
                    {currentVariant.available ? "In Stock" : "Sold Out"}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold text-sm tracking-wide hover:bg-gray-700 transition-all"
          >
            Add to Cart
          </button>
          <button className="w-full py-4 border border-gray-200 text-gray-900 rounded-full font-semibold text-sm tracking-wide hover:border-gray-400 hover:bg-gray-50 transition-all">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
