import { Link } from "react-router-dom"


const CTA = () => {
  return (
    <section className="flex flex-col bg-green-600 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <h4 className="text-3xl sm:text-4xl font-semibold mb-4 sm:mb-6">
          Join Our Mission
        </h4>
        <p className="mb-6 sm:mb-8 text-gray-200 text-base sm:text-lg max-w-xl">
          Ready to make a positive impact? Start your sustainable journey with us today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center">
          <Link
            to="/products"
            className="w-[80%] mx-auto sm:mx-0 sm:w-auto text-center bg-white text-green-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition"
          >
            Shop Products
          </Link>
          <Link
            to="/about"
            className="w-[80%] mx-auto sm:mx-0 sm:w-auto text-center border border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white hover:text-green-700 transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA