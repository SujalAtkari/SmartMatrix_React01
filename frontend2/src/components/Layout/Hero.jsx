import React from "react";
import Home from "../../pages/Home";
import heroimg1 from "../../assets/heroimg1.png";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroimg1}
        alt="Hero Image"
        className="w-full h-[400px] mid:h-[600px] lg:h-[750px] object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter text-yellow-300 uppercase mb-4">
            Vacation
            <br /> Ready
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore or vacation ready outfitsbwith fast worldwide shipping.
          </p>
          <Link
            to="#"
            className="bg-white text-[#ea2e0e] px-6 py-2 rounded-sm text-lg"
          >
            Shop Now
          </Link>
        </div>{" "}
      </div>
    </section>
  );
};

export default Hero;
