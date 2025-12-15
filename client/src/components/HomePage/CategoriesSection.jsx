
const categories = [
{ name: "Personal Care", productsCount: 24 },
{ name: "Sustainable Fashion", productsCount: 18 },
{ name: "Zero Waste Living", productsCount: 32 },
];
const CategoryCard = ({ name, productsCount }) => (
  <div className="bg-gray-900 text-white p-8 flex flex-col justify-center items-center h-48 sm:h-64 rounded-xl transition duration-300 hover:bg-gray-700 shadow-xl cursor-pointer">
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <p className="text-gray-400">{productsCount} products</p>
  </div>
);

const CategoriesSection = () => {
  return (
    <section className="py-16 px-4 sm:px-8 lg:px-16 text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
        Shop by Category
      </h2>
      <p className="text-lg text-gray-600 mb-12">
        Find eco-friendly products for every aspect of your life
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <CategoryCard key={index} {...cat} />
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection