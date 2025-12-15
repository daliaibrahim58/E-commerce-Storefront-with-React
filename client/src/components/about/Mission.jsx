import aboutMission from "../../assets/AboutMission.svg";

const Mission = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 bg-white">
      <div className="flex flex-col md:flex-row md:items-stretch md:gap-10">
        
        {/* النص على الشمال */}
        <div className="md:w-3/5 text-left flex flex-col justify-between">
          <h1 className="text-4xl font-bold mb-8">Our Mission</h1>

          <div>
            <p className="text-gray-700 mb-6 text-xl leading-relaxed">
              At EcoMarket, we believe that small changes can make a big impact.
              Our mission is to democratize access to sustainable products by
              connecting conscious consumers with ethical brands that share our
              values.
            </p>

            <p className="text-gray-700 mb-8 text-xl leading-relaxed">
              We carefully vet every product and brand on our platform to ensure
              they meet our strict standards for environmental responsibility,
              social impact, and quality. From zero-waste personal care to
              sustainable fashion, we make it easy to live more consciously.
            </p>
          </div>

          {/* القيم */}
          <div className="flex flex-wrap justify-start gap-3 mt-4">
            <div className="bg-green-500/20 px-4 py-1 rounded-xl text-xs font-medium">
              <p className="text-green-800 m-0">Carbon Neutral</p>
            </div>

            <div className="bg-blue-500/20 px-3 py-1 rounded-xl text-xs font-medium">
              <p className="text-blue-700 m-0">B-Corp Certified</p>
            </div>

            <div className="bg-purple-500/20 px-3 py-1 rounded-xl text-xs font-medium">
              <p className="text-purple-700 m-0">Fair Trade</p>
            </div>
          </div>
        </div>

        {/* الصورة Full Height */}
        <div className="md:w-2/5 mt-10 md:mt-16 flex justify-center items-stretch">
          <div className="w-full  flex items-stretch">
            <img
              src={aboutMission}
              alt="EcoMarket"
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Mission;
