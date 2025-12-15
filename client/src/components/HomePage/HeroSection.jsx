import homeImage from "../../assets/AboutHero.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-10 justify-between md:min-h-screen bg-[#F0FAF0] p-4 sm:p-10 lg:p-20 overflow-hidden">
      {/* Text */}
      <div className="z-10 relative text-center md:text-left sm:w-[45%]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-snug sm:leading-tight md:leading-tight text-center md:text-left break-words">
        <span className="text-black">Sustainable </span>
        <br className="md:hidden" /> {/* يكسر السطر على الموبايل فقط */}
        <span className="text-[#55A069]">Living Made </span>
        <br />
        <span className="text-black">Simple</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-md mx-auto md:mx-0">
          Discover eco-friendly products that make a difference. From bamboo
          essentials to organic skincare, shop mindfully and reduce your
          environmental footprint.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <Link
            to="/products"
            className="bg-[#55A069] hover:bg-[#438053] text-white font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-lg text-center"
        >
            Shop Now
        </Link>

        <Link
            to="/about"
            className="border-2 border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-300 text-lg text-center"
        >
            Learn More
        </Link>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full lg:absolute lg:top-0 lg:right-0 h-64 sm:h-80 md:h-full lg:w-[50%] flex justify-end flex-1">
        <img
          src={homeImage}
          alt="Eco-friendly sustainable products"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSection;
