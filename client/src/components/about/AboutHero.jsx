import aboutHero from "../../assets/AboutHero.jpg"; 
import leaf from "../../assets/Leaf.svg";
import { PiHeart, PiRecycleFill } from "react-icons/pi";
import { RiGroupLine } from "react-icons/ri";

const AboutHero = () => {
  return (
    <div className="mx-auto w-full">
              <div className="relative h-[35rem] w-full ">
        
        <img
          src={aboutHero}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-green-800/90"></div>

        
        <div className="absolute inset-0 flex flex-col justify-center items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-500 text-white px-3 rounded-md text-sm font-medium backdrop-blur-md border border-white/30">
            About EcoMarket
          </div>

          <h1 className="text-white text-[3.5rem] font-bold mb-4 leading-tight my-8">
            Building a Sustainable Future, One Product at a Time
          </h1>

          <p className="text-white text-lg leading-relaxed">
            We&apos;re on a mission to make sustainable living accessible,
            affordable, and enjoyable for everyone. Through carefully curated
            eco-friendly products, we&apos;re helping create a world where
            conscious consumption is the norm, not the exception.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-20 justify-items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-2">
            <RiGroupLine className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-4xl font-bold text-black">10K+</h2>
          <p className="text-gray-700 mt-1">Happy Customers</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <img src={leaf} alt="leaf logo" className="w-9" />
          </div>
          <h2 className="text-4xl font-bold text-black">50+</h2>
          <p className="text-gray-700 mt-1">Eco Brands</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <PiRecycleFill className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-4xl font-bold text-black">1M+</h2>
          <p className="text-gray-700 mt-1">Plastic Items Avoided</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <PiHeart className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-4xl font-bold text-black">95%</h2>
          <p className="text-gray-700 mt-1">Customer Satisfaction</p>
        </div>
      </div>
    </div>
  )
}

export default AboutHero