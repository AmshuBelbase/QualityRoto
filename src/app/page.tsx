'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  
  const specialtiesRef = useRef<HTMLDivElement>(null); 
  const scrollToSpecialties = () => { 
    if (specialtiesRef.current) {
      specialtiesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const getintouchRef = useRef<HTMLDivElement>(null); 
  const scrollToGetInTouch = () => { 
    if (getintouchRef.current) {
      getintouchRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const specialties = [
    { name: 'Tea Packaging', icon: '🍵' },
    { name: 'Cookies & Biscuits', icon: '🍪' },
    { name: 'Noodles & Snacks', icon: '🍜' },
    { name: 'Rice & Flour', icon: '🌾' },
    { name: 'Spices', icon: '🌶️' },
    { name: 'Dry Fruits', icon: '🥜' },
    { name: 'Detergents & Soap', icon: '🧼' },
    { name: 'Custom Packaging', icon: '📦' },
  ];

  const features = [
    { title: 'On-Time Deliveries', icon: '⚡' },
    { title: 'Customized Solutions', icon: '✨' },
    { title: 'High Quality Products', icon: '⭐' },
    { title: 'Reasonable Prices', icon: '💰' },
  ];

  const branches = [
    {
      location: 'Corporate Office',
      address: '8th Floor, Ambe Complex, Teku, Kathmandu',
      person: 'Mr. Padam Poudel',
      role: 'Regional Marketing Officer, Central Nepal',
      phone: '9851012726',
      icon: '🏢'
    },
    {
      location: 'Hetauda Branch',
      address: 'Hetauda, Makwanpur',
      person: 'Mr. Sunil Lamichanne',
      role: 'Regional Marketing Officer, Eastern Nepal',
      phone: '9857015653',
      icon: '🏪'
    },
    {
      location: 'Butwal Branch',
      address: 'Butwal, Rupandehi',
      person: 'Mr. Robin Gyawali',
      role: 'Regional Marketing Officer, Western Nepal',
      phone: '9857010801',
      icon: '🏪'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
    {/* Navbar */}
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg py-2 h-16'  // ✅ SHRINK: Smaller height, padding
          : 'bg-transparent py-5 h-30'       // ✅ EXPANDED: Larger height, padding
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <Image 
            src="/logo.png" 
            alt="Quality Roto Packaging" 
            width={180} 
            height={60}
            className={`w-auto transition-all duration-300 ${
              scrolled ? 'h-12' : 'h-22'  // ✅ Logo shrinks too!
            }`}
            priority
          />
        </motion.div>
        <div className="flex gap-3"> {/* ✅ Reduced gap when scrolled */}
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                scrolled 
                  ? 'text-gray-700 hover:text-[#1B5FA6]'  // ✅ Smaller text
                  : 'text-gray-700 hover:text-[#1B5FA6] px-6 py-2 text-base'
              }`}
            >
              Staff Portal
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToGetInTouch}
            className={`font-medium shadow-lg rounded-lg transition-all ${
              scrolled 
                ? 'px-4 py-1.5 text-sm bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white'  // ✅ Smaller button
                : 'px-6 py-2 text-base bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white'
            }`}
          >
            Contact Us
          </motion.button>
          
        </div>
      </div>
    </motion.nav>


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-orange-50 to-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Nepal's Leading
                <span className="block bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] bg-clip-text text-transparent">
                  Flexible Packaging
                </span>
                Solutions
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Manufacturing and supplying optimal quality packaging wrappers and pouches for tea, cookies, noodles, flour, rice, and customized solutions.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToGetInTouch}
                  className="px-8 py-4 bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Request a Quote
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToSpecialties}
                  className="px-8 py-4 border-2 border-[#1B5FA6] text-[#1B5FA6] rounded-xl font-semibold text-lg hover:bg-[#1B5FA6] hover:text-white transition-all"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                  className="text-white text-9xl opacity-20"
                >
                  📦
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                  🏭
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 px-4" ref={specialtiesRef}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Specialties</h2>
            <p className="text-xl text-gray-600">Comprehensive packaging solutions for various industries</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-[#F15A29]"
              >
                <div className="text-5xl mb-4">{specialty.icon}</div>
                <h3 className="font-semibold text-gray-800">{specialty.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Message from CEO</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-3 gap-0">
              {/* CEO Photo Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-full min-h-[400px] bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] flex items-center justify-center"
              >
                <div className="text-center p-8">
                  <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src="/ceo.jpg"
                      alt="Mr. Gangadhar Bhandari"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mr. Gangadhar Bhandari</h3>
                  <p className="text-white/90 text-lg">CEO</p>
                  <p className="text-white/90">Quality Roto Packaging Pvt Ltd</p>
                </div>
              </motion.div>

              {/* Message Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="md:col-span-2 p-8 md:p-12"
              >
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Quality Roto Packaging Pvt Ltd is Nepal's leading flexible roto packaging company. Former Jagdamba Roto Packaging Pvt Ltd which was later re-established in 2011 as Quality Roto Packaging Pvt Ltd has set a benchmark in today's market.
                  </p>
                  <p className="text-lg">
                    Quality Roto Packaging Pvt Ltd is one of the leading companies engaged in the manufacture and distribution of high-quality wrappers, pouches, packaging, and printings. We manufacture packing pouch and wrapper of different consumer goods as per their order and supply them to concerned industries.
                  </p>
                  <p className="text-lg">
                    Consumer goods like Noodles, Biscuits, Cookies, Flour, Rice, Spices, Tea, Corn Flakes, Dry Fruits, Confectioneries, Soap, Detergent, Namkeen, Agro Seeds, Agarbatti and many more.
                  </p>

                  {/* Contact Info */}
                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-[#F15A29]">📍</span>
                      <span>Mayadevi-08, Siddharthanagar (Bhairahawa), Rupandehi, Lumbini Zone, Nepal</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-[#F15A29]">📞</span>
                      <span>9857011801 / 9857010803</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="text-[#F15A29]">✉️</span>
                      <div className="flex flex-col">
                        <a href="mailto:rotojagdamba@gmail.com" className="hover:text-[#1B5FA6] transition-colors">
                          rotojagdamba@gmail.com
                        </a>
                        <a href="mailto:qualityroto2015@gmail.com" className="hover:text-[#1B5FA6] transition-colors">
                          qualityroto2015@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Our commitment to excellence and customer satisfaction</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all border-t-4 border-[#1B5FA6]"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-orange-50" ref={getintouchRef}>
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or feedback? We're here to help! Feel free to reach out to us for any queries, feedback, or business inquiries.
            </p>
          </motion.div>

          {/* Main Contact Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
              <p className="text-gray-600">
                <a href="tel:+9779857010801" className="block hover:text-[#1B5FA6] transition-colors">
                  +977-9857010801
                </a>
                <a href="tel:+9779857010803" className="block hover:text-[#1B5FA6] transition-colors">
                  +977-9857010803
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
              <p className="text-gray-600">
                <a href="mailto:qualityroto2015@gmail.com" className="block hover:text-[#1B5FA6] transition-colors break-all">
                  qualityroto2015@gmail.com
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
              <p className="text-gray-600">
                Hatibangai, Siddharthanagar (Bhairahawa) Rupandehi, Lumbini Zone, Nepal
              </p>
            </motion.div>
          </div>

          {/* Branches Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Branches</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {branches.map((branch, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                >
                  <div className="text-4xl mb-4">{branch.icon}</div>
                  <h4 className="text-xl font-bold text-[#1B5FA6] mb-3">{branch.location}</h4>
                  <div className="space-y-2 text-gray-600">
                    <p className="font-medium">{branch.address}</p>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="font-semibold text-gray-800">{branch.person}</p>
                      <p className="text-sm">{branch.role}</p>
                      <a href={`tel:+977${branch.phone}`} className="text-[#F15A29] hover:text-[#1B5FA6] font-semibold transition-colors">
                        📞 {branch.phone}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-6">Find Us on Map</h3>
              <p className="text-center text-gray-600 mb-8">
                Visit our main facility in Siddharthanagar, Bhairahawa
              </p>
              <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14153.81563331735!2d83.430219!3d27.517354!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39969beb06db9b9d%3A0xae048d9873119e35!2sQuality%20Roto%20Packaging%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1767950518219!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
              </div>
            </div>
          </motion.div>


          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Our Official Social Network</h3>
            <div className="flex justify-center gap-6">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.facebook.com/Qualityrotopackaging/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
              >
                <FaFacebookF className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-gradient-to-br from-[#1B5FA6] to-[#F15A29] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
              >
                <FaLinkedinIn className="text-xl" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[#1B5FA6] to-[#F15A29] rounded-3xl shadow-2xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of satisfied customers who trust our packaging solutions
            </p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-[#1B5FA6] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Create Your Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Product Category */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Product Category</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-[#F15A29] transition-colors">Flour Packaging Pouch</a></li>
                <li><a href="#" className="hover:text-[#F15A29] transition-colors">Cookies Packaging Pouch</a></li>
                <li><a href="#" className="hover:text-[#F15A29] transition-colors">Spices Packaging Pouch</a></li>
                <li>
                  <a onClick={scrollToSpecialties} rel="noopener noreferrer" className="text-[#F15A29] font-semibold hover:text-white transition-colors">
                    See More →
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Contact Us</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="tel:+9779857010801" className="flex items-center gap-2 hover:text-[#F15A29] transition-colors">
                    📞 +977-9857010801 / 9857010803
                  </a>
                </li>
                <li>
                  <a href="mailto:qualityroto2015@gmail.com" className="flex items-center gap-2 hover:text-[#F15A29] transition-colors">
                    ✉️ qualityroto2015@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-300">
                  📍 Hatibangai, Siddharthanagar (Bhairahawa)
                </li>
                <li className="text-sm text-gray-400">Rupandehi, Lumbini Zone, Nepal</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Social Media</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/Qualityrotopackaging/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-[#F15A29] rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                  <FaFacebookF className="text-lg" />
                </a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-[#F15A29] rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                  <FaLinkedinIn className="text-lg" />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-[#F15A29] rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                  <FaInstagram className="text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            {/* <div>
              <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="https://www.qualityroto.com/" className="hover:text-[#F15A29] transition-colors">Home</a></li>
                <li><a href="https://www.qualityroto.com/Aboutus" className="hover:text-[#F15A29] transition-colors">About Us</a></li>
                <li><a href="https://www.qualityroto.com/terms" className="hover:text-[#F15A29] transition-colors">Terms & Condition</a></li>
                <li><a href="https://www.qualityroto.com/privacy" className="hover:text-[#F15A29] transition-colors">Privacy Policy</a></li>
              </ul>
            </div> */}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>©2026 All Rights Reserved by Quality Roto Packaging Pvt. Ltd.</p>
            <p className="mt-2">
              Developed by{' '}
              <a href="https://amshubelbase.com.np/" target="_blank" rel="noopener noreferrer" className="text-[#F15A29] font-medium hover:text-white transition-colors">
                Amshu Belbase
              </a>
            </p>
          </div>
        </div>
      </footer>



    </div>
  );
}
