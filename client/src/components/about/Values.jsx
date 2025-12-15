import leaf from "../../assets/Leaf.svg"; 
import { RiGroupLine } from "react-icons/ri";
import { BsBullseye } from "react-icons/bs";
import { LiaCertificateSolid } from "react-icons/lia";

const Values = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12">
      {/* العنوان */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
        Our Values
      </h1>
      <p className="text-base sm:text-xl text-center mb-10 sm:mb-14 mx-auto max-w-3xl text-gray-700">
        These core values guide every decision we make and every product we
        choose to feature
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <img src={leaf} alt="leaf logo" className="w-9" loading="lazy" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Environmental Impact</h2>
          <p className="px-3 sm:px-5 text-gray-600 text-sm sm:text-base">
            Every product we sell contributes to reducing environmental impact
            and promoting sustainable living practices.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <BsBullseye className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Quality First</h2>
          <p className="px-3 sm:px-5 text-gray-600 text-sm sm:text-base">
            We carefully vet all our products to ensure they meet our high
            standards for quality, durability, and sustainability.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <RiGroupLine className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Community Focused</h2>
          <p className="px-3 sm:px-5 text-gray-600 text-sm sm:text-base">
            Building a community of conscious consumers who care about the
            planet and future generations.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <LiaCertificateSolid className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Transparency</h2>
          <p className="px-3 sm:px-5 text-gray-600 text-sm sm:text-base">
            We believe in full transparency about our products&apos; origins,
            materials, and environmental impact.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Values;
