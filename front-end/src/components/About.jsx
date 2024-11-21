import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            About Our Store
          </h1>
          <div className="space-y-6 text-white">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-purple-300">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We are passionate about delivering high-quality products that enhance your lifestyle. 
                Our commitment is to provide an exceptional shopping experience with carefully curated 
                items that meet the highest standards of quality and design.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-purple-300">
                Our Values
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Customer Satisfaction</li>
                <li>Innovative Product Selection</li>
                <li>Transparent and Ethical Business Practices</li>
                <li>Continuous Improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-purple-300">
                Our Team
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our dedicated team of professionals works tirelessly to bring you the best products 
                and shopping experience. From product selection to customer support, we're committed 
                to excellence at every step.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/contact" 
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 
              text-white font-semibold rounded-full hover:from-pink-600 
              hover:to-purple-600 transition-all duration-300 inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;