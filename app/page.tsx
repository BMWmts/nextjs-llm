import { LoginForm } from "@/components/login-form";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      {/* --- Navbar Section --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">MyWebApp</div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Features</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Pricing</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Contact</a>
          {/* AuthButtons จะถูก Render ตรงนี้ */}
          {/* สามารถปรับแต่งให้แสดงแค่ปุ่ม Login/Logout โดยไม่ต้องมีข้อมูล User ก็ได้ */}
          {/* หรือจะแยกเป็น Link ไปหน้า Login/Logout ของตัวเอง */}
         <LoginForm />
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* เพิ่ม SVG หรือ Pattern เบาๆ เพื่อความ modern */}
          <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-200" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Unlock the Future with <span className="text-blue-600">Cutting-Edge</span> Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Experience seamless integration and powerful features designed to elevate your digital presence.
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
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Powerful Features for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">💡</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Intuitive Interface</h3>
            <p className="text-gray-600">
              Navigate with ease through our user-friendly and beautifully designed platform.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">⚡</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Blazing Fast Performance</h3>
            <p className="text-gray-600">
              Optimized for speed, ensuring a smooth and responsive experience every time.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
            <div className="text-blue-600 text-5xl mb-4">🔒</div> {/* Icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Robust Security</h3>
            <p className="text-gray-600">
              Your data is protected with the latest security protocols and encryption.
            </p>
          </div>
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="py-20 bg-white px-6 md:px-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied users and transform your workflow today.
        </p>
        <button className="px-10 py-5 bg-blue-600 text-white rounded-lg shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 text-lg font-semibold">
          Sign Up for Free
        </button>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-800 text-white py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">MyWebApp</h3>
            <p className="text-gray-400">
              Revolutionizing digital experiences with cutting-edge technology and user-centric design.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">123 Tech Lane, Innovation City</p>
            <p className="text-gray-400">Email: info@mywebapp.com</p>
            <p className="text-gray-400">Phone: +1 (234) 567-8900</p>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 pt-8 border-t border-gray-700">
          &copy; {new Date().getFullYear()} MyWebApp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}