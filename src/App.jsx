import { useState } from "react";
import { product } from "./data/product";
import RingViewer from "./components/RingViewer";

const METAL_COLORS = {
  "Yellow Gold": "#E8B923",
  "White Gold": "#D9D9D9",
  "Rose Gold": "#E8A090",
};

const GEM_COLORS = {
  White: "#F5F5F5",
  Emerald: "#50C878",
  Ruby: "#E0115F",
};

export default function App() {
  const [selectedOptions, setSelectedOptions] = useState([
    product.options[0].values[0],
    product.options[1].values[0],
  ]);

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
    const cartItem = {
      variantId: currentVariant.id,
      title: product.title,
      metal: selectedOptions[0],
      gem: selectedOptions[1],
      price: currentVariant.price,
      formattedPrice: formatPrice(currentVariant.price),
    };
    console.log("Adding to cart:", cartItem);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAF8] text-gray-900 font-sans">
      {/* Left: 3D Viewer — takes half the screen */}
      <div className="w-1/2 h-full">
        <RingViewer
          selectedMetal={selectedOptions[0]}
          selectedGem={selectedOptions[1]}
        />
      </div>

      {/* Right: Product Info — scrollable */}
      <div className="w-1/2 h-full overflow-y-auto flex flex-col justify-center px-12 py-12 gap-7">
        {/* Title + Price */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Fine Jewellery
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="text-2xl text-gray-600 mt-2 font-light">
            {currentVariant ? formatPrice(currentVariant.price) : "—"}
          </p>
        </div>

        <hr className="border-gray-200" />

        {/* Metal — color swatches */}
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
                      : "border-transparent hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: METAL_COLORS[value] }}
                />
              );
            })}
          </div>
        </div>

        {/* Gem — color swatches */}
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
                      : "border-transparent hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: GEM_COLORS[value] }}
                />
              );
            })}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Configuration Summary */}
        {currentVariant && (
          <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 flex flex-col gap-2 border border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Your Configuration
            </p>
            <div className="flex justify-between">
              <span>Metal</span>
              <span className="text-gray-900 font-medium">
                {selectedOptions[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Gem</span>
              <span className="text-gray-900 font-medium">
                {selectedOptions[1]}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Price</span>
              <span className="text-gray-900 font-medium">
                {formatPrice(currentVariant.price)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Availability</span>
              <span
                className={
                  currentVariant.available
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {currentVariant.available ? "In Stock" : "Sold Out"}
              </span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant?.available}
            className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold text-sm tracking-wide hover:bg-gray-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button
            disabled={!currentVariant?.available}
            className="w-full py-4 border border-gray-300 text-gray-900 rounded-full font-semibold text-sm tracking-wide hover:border-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        <p className="text-xs text-center text-gray-400">
          Free shipping & returns · Lifetime warranty
        </p>
      </div>
    </div>
  );
}
