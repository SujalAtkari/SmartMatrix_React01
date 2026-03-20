import React from "react";
import menscollection from "../../assets/menscollection.png";
import womenscollection from "../../assets/womenscollection.png";
import { Link } from "react-router-dom";
const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/*womens collection*/}
        <div className="relative flex-1">
          <img
            src={womenscollection}
            alt="Women's Collection"
            className="w-full h-[700] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-800 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/*mens collection*/}
        <div className="relative flex-1">
          <img
            src={menscollection}
            alt="Men's Collection"
            className="w-full h-[900] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-800 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
