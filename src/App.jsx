import { useState } from "react";
import { product } from "./data/product";
import RingViewer from "./components/RingViewer";
import CartModal from "./components/CartModal";

const METAL_COLORS = {
  "Yellow Gold": "#E8B923",
  "White Gold": "#D9D9D9",
  "Rose Gold": "#E8A090",
};

const GEM_COLORS = {
  White: "#F0F0F0",
  Emerald: "#50C878",
  Ruby: "#E0115F",
};

const HEADS = [
  "R-H002-V7-RENDER-2",
  "R-H020-V5-RENDER",
  "R-H043-V4-RENDER",
  "R-H049-V4-RENDER",
  "R-H082-V5-RENDER",
];

const SHANKS = [
  "R-S021-V1-RENDER",
  "R-S029-V1-RENDER",
  "R-S034-V1-RENDER",
  "R-S056-V1-RENDER",
  "R-S103-V1-RENDER",
];

export default function App() {
  const [selectedOptions, setSelectedOptions] = useState([
    product.options[0].values[0],
    product.options[1].values[0],
  ]);
  const [selectedHead, setSelectedHead] = useState(HEADS[0]);
  const [selectedShank, setSelectedShank] = useState(SHANKS[0]);
  const [configurator, setConfigurator] = useState({ metals: [], gems: [], heads: [], shanks: [] });
  const [cartItem, setCartItem] = useState(null);

  const currentVariant = product.variants.find((variant) =>
    variant.options.every((opt, index) => opt === selectedOptions[index]),
  );

  const handleOptionChange = (optionIndex, value) => {
    setSelectedOptions((prev) => {
      const updated = [...prev];
      updated[optionIndex] = value;
      return updated;
    });
  };

  const formatPrice = (cents) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  const handleAddToCart = () => {
    const item = {
      variantId: currentVariant.id,
      title: product.title,
      metal: selectedOptions[0],
      gem: selectedOptions[1],
      price: currentVariant.price,
      formattedPrice: formatPrice(currentVariant.price),
    };
    console.log("Adding to cart:", item);
    setCartItem(item);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F1EE] text-gray-900 font-sans p-4 gap-4">
      {/* Cart Modal */}
      <CartModal item={cartItem} onClose={() => setCartItem(null)} />

      {/* Left: 3D Viewer */}
      <div className="w-1/2 h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        <RingViewer
          selectedMetal={selectedOptions[0]}
          selectedGem={selectedOptions[1]}
          selectedHead={selectedHead}
          selectedShank={selectedShank}
          onConfiguratorReady={setConfigurator}
        />
      </div>

      {/* Right: Product Info */}
      <div className="w-1/2 h-full overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center px-10 py-10 pt-24 gap-6">
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

        {/* Metal swatches */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Metal:{" "}
            <span className="text-gray-900 normal-case tracking-normal font-semibold">
              {selectedOptions[0]}
            </span>
          </p>
          <div className="flex gap-3">
            {(configurator.metals.length ? configurator.metals : product.options[0].values.map((v) => ({ name: v, icon: null }))).map(({ name, icon }) => {
              const isSelected = selectedOptions[0] === name;
              return (
                <button
                  key={name}
                  onClick={() => handleOptionChange(0, name)}
                  title={name}
                  className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={!icon ? { backgroundColor: METAL_COLORS[name] } : {}}
                >
                  {icon && <img src={icon} alt={name} className="w-full h-full object-cover rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gem swatches */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Gem:{" "}
            <span className="text-gray-900 normal-case tracking-normal font-semibold">
              {selectedOptions[1]}
            </span>
          </p>
          <div className="flex gap-3">
            {(configurator.gems.length ? configurator.gems : product.options[1].values.map((v) => ({ name: v, icon: null }))).map(({ name, icon }) => {
              const isSelected = selectedOptions[1] === name;
              return (
                <button
                  key={name}
                  onClick={() => handleOptionChange(1, name)}
                  title={name}
                  className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={!icon ? { backgroundColor: GEM_COLORS[name] } : {}}
                >
                  {icon && <img src={icon} alt={name} className="w-full h-full object-cover rounded-full" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Head selectors */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Head:{" "}
            <span className="text-gray-900 normal-case tracking-normal font-semibold">
              {selectedHead}
            </span>
          </p>
          <div className="flex gap-3 flex-wrap">
            {(configurator.heads.length ? configurator.heads : HEADS.map((h) => ({ name: h, icon: null }))).map(({ name, icon }) => {
              const isSelected = selectedHead === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedHead(name)}
                  title={name}
                  className={`w-14 h-14 rounded-xl border-2 transition-all overflow-hidden bg-gray-50 ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {icon
                    ? <img src={icon} alt={name} className="w-full h-full object-cover" />
                    : <span className="text-[9px] text-gray-400 leading-tight px-1 flex items-center justify-center h-full text-center">{name}</span>
                  }
                </button>
              );
            })}
          </div>
        </div>

        {/* Shank selectors */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
            Shank:{" "}
            <span className="text-gray-900 normal-case tracking-normal font-semibold">
              {selectedShank}
            </span>
          </p>
          <div className="flex gap-3 flex-wrap">
            {(configurator.shanks.length ? configurator.shanks : SHANKS.map((s) => ({ name: s, icon: null }))).map(({ name, icon }) => {
              const isSelected = selectedShank === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedShank(name)}
                  title={name}
                  className={`w-14 h-14 rounded-xl border-2 transition-all overflow-hidden bg-gray-50 ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {icon
                    ? <img src={icon} alt={name} className="w-full h-full object-cover" />
                    : <span className="text-[9px] text-gray-400 leading-tight px-1 flex items-center justify-center h-full text-center">{name}</span>
                  }
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Configuration Summary */}
        {currentVariant && (
          <div className="rounded-2xl border border-gray-100 bg-[#F9F7F5] p-5 flex flex-col gap-3 text-sm">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Your Configuration
            </p>
            {[
              { label: "Metal", value: selectedOptions[0] },
              { label: "Gem", value: selectedOptions[1] },
              { label: "Price", value: formatPrice(currentVariant.price) },
              {
                label: "Availability",
                value: currentVariant.available ? "In Stock" : "Sold Out",
                color: currentVariant.available
                  ? "text-green-600"
                  : "text-red-500",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-400">{label}</span>
                <span className={`font-medium ${color || "text-gray-900"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant?.available}
            className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold text-sm tracking-wide hover:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button
            disabled={!currentVariant?.available}
            className="w-full py-4 border border-gray-200 text-gray-900 rounded-full font-semibold text-sm tracking-wide hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
