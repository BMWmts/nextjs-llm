import { redirect } from "next/navigation";

import { UserProfile } from "@/components/user-profile";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Sakano-LLM</div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </a>
          <div className="flex items-center space-x-4">
            <UserProfile user={data.user} />
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* เพิ่ม SVG หรือ Pattern เบาๆ เพื่อความ modern */}
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.1"
              />
            </pattern>
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
              className="text-blue-200"
            />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Unlock the Future with{" "}
            <span className="text-blue-600">Sakano</span> LLM
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro, maxime?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
              Get Started
            </button>
            <button className="px-8 py-4 bg-white text-blue-600 border border-blue-300 rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className="py-20 bg-gray-50 px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">💡</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Intuitive Interface
            </h3>
            <p className="text-gray-600">
              Navigate with ease through our user-friendly and beautifully
              designed platform.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">⚡</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Blazing Fast Performance
            </h3>
            <p className="text-gray-600">
              Optimized for speed, ensuring a smooth and responsive experience
              every time.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">🔒</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Robust Security
            </h3>
            <p className="text-gray-600">
              Your data is protected with the latest security protocols and
              encryption.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
