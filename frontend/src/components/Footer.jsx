import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-12 pb-6 mt-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        {/* Logo Placeholder - User to replace src */}
                        <img src="/logo.png" alt="Avani Enterprises" className="h-12 w-12 object-contain bg-white rounded-full p-1" />
                        <div>
                            <h3 className="font-bold text-xl leading-tight">AVANI</h3>
                            <p className="text-accent text-sm tracking-widest">ENTERPRISES</p>
                        </div>
                    </div>
                    <p className="text-gray-300 text-sm italic">
                        Empowering workforce with trust & technology. <br />
                        Simplifying Human Resources, One Click at a Time.
                    </p>
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                        <FiMapPin className="mt-1 flex-shrink-0 text-accent" />
                        <p>
                            Tower B, 3rd Floor, Unitech Cyber Park, <br />
                            Sector 39, Gurugram, Haryana 122002
                        </p>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <SocialIcon icon={<FaInstagram />} />
                        <SocialIcon icon={<FaFacebookF />} />
                        <SocialIcon icon={<FaTwitter />} />
                        <SocialIcon icon={<FaLinkedinIn />} />
                        <SocialIcon icon={<FaEnvelope />} />
                    </div>
                </div>

                {/* HR Portal / Features Section */}
                <div>
                    <h3 className="text-2xl font-bold mb-4 border-b-2 border-white inline-block pb-1">HR Portal</h3>
                    <h4 className="text-lg font-semibold mb-3 text-accent">Key Features</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Employee Management</li>
                        <li>• Salary Calculation</li>
                        <li>• EOD Reports</li>
                        <li>• Performance Tracking</li>
                    </ul>
                </div>

                {/* Visit Us Section (Map) */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Visit Us</h3>
                    <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden relative">
                        {/* Placeholder for Map - User can replace iframe or image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.667468647636!2d77.0396656150862!3d28.45949658248873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0xa19932155535928b!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1614141414141!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
                <p>
                    &copy; 2025 Avani HR Portal. All rights reserved. |
                    <span className="mx-2 hover:text-white cursor-pointer">Privacy Policy</span> |
                    Made with <span className="text-red-500">♥</span> by Placement Management System
                </p>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
        {icon}
    </a>
);

export default Footer;
