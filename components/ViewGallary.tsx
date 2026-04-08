// components/ViewGallery.tsx
import { useState } from "react";

interface ViewGalleryProps {
  images: string[];
}

const ViewGallery: React.FC<ViewGalleryProps> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <button
        className="bg-orange-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded transition"
        onClick={() => setIsOpen(true)}
      >
        View Gallery
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-11/12 max-w-3xl bg-white rounded-lg p-4">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 font-bold text-xl"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <div className="flex items-center justify-between">
              <button
                className="text-orange-500 hover:text-yellow-400 text-2xl font-bold"
                onClick={prevImage}
              >
                ‹
              </button>
              <img
                src={images[currentIndex]}
                alt={`Gallery ${currentIndex + 1}`}
                className="max-h-96 object-contain mx-4"
              />
              <button
                className="text-orange-500 hover:text-yellow-400 text-2xl font-bold"
                onClick={nextImage}
              >
                ›
              </button>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentIndex ? "bg-orange-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewGallery;