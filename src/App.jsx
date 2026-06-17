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
            {product.options[0].values.map((value) => {
              const isSelected = selectedOptions[0] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(0, value)}
                  title={value}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: METAL_COLORS[value] }}
                />
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
            {product.options[1].values.map((value) => {
              const isSelected = selectedOptions[1] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(1, value)}
                  title={value}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-gray-900 scale-110 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: GEM_COLORS[value] }}
                />
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
          <div className="flex gap-2 flex-wrap">
            {HEADS.map((head) => (
              <button
                key={head}
                onClick={() => setSelectedHead(head)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  selectedHead === head
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {head}
              </button>
            ))}
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
          <div className="flex gap-2 flex-wrap">
            {SHANKS.map((shank) => (
              <button
                key={shank}
                onClick={() => setSelectedShank(shank)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  selectedShank === shank
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {shank}
              </button>
            ))}
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
