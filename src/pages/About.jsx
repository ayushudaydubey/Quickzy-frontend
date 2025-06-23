import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-black mb-6">About Us</h1>
        
        <p className="text-gray-800 text-lg leading-relaxed mb-4">
          <strong className="text-black">Quickzy</strong> is your one-stop destination for modern, reliable, and affordable online shopping. Our platform is designed to bring a seamless experience to both customers and administrators.
        </p>

        <p className="text-gray-800 text-lg leading-relaxed mb-4">
          Whether you're looking for the latest gadgets, stylish clothing, or daily essentials, ShopVerse offers a wide range of high-quality products at competitive prices. With secure payments, fast delivery, and real-time order tracking, we ensure our customers are always in control.
        </p>

        <p className="text-gray-800 text-lg leading-relaxed mb-4">
          Our admin panel empowers store owners with complete control over their product inventory, order management, and user base — all built with speed and simplicity in mind. From product creation to real-time updates and customer interaction, everything is just a few clicks away.
        </p>

        <p className="text-gray-800 text-lg leading-relaxed mb-4">
          At ShopVerse, we're not just building an e-commerce store — we're creating a digital shopping experience that feels personal, intuitive, and modern.
        </p>

        <div className="mt-8 text-center">
          <span className="inline-block bg-black text-white font-medium px-6 py-3 rounded-full shadow-lg">
            Thank you for choosing Quickzy 🖤
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;