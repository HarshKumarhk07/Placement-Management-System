import { FaInstagram, FaFacebookF, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-[#3E2723] text-[#D7CCC8] pt-16 pb-8">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* Brand */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <img src="/avani_enterprises_logo.jpg" alt="PMS Logo" className="h-14 w-14 object-cover rounded-lg border border-[#D7CCC8]/30" />
                        <div>
                            <h3 className="font-bold text-lg text-[#FAF9F8] tracking-wider uppercase leading-tight" style={{ fontFamily: 'serif' }}>Placement <br />Management</h3>
                            <p className="text-[10px] tracking-[0.15em] font-medium uppercase opacity-60 mt-1">Powered by Avani Enterprises</p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed font-light italic">
                        "Bridging the gap between talent and opportunity through technological excellence."
                    </p>
                    <div className="flex gap-4">
                        {[<FaFacebookF />, <FaInstagram />, <FaLinkedinIn />, <FaEnvelope />].map((icon, i) => (
                            <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-full border border-[#D7CCC8]/20 hover:bg-[#D7CCC8] hover:text-[#3E2723] transition-all">
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h4 className="text-[#FAF9F8] font-bold mb-6 text-sm uppercase tracking-widest">Quick Actions</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        {['Register for Drives', 'Student Login', 'Recruiter Portal', 'View Results'].map(link => (
                            <li key={link} className="hover:text-[#FAF9F8] cursor-pointer flex items-center gap-2 group">
                                <div className="w-1.5 h-1.5 bg-[#D7CCC8]/30 group-hover:bg-[#FAF9F8] rounded-full"></div>
                                {link}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Location */}
                <div>
                    <h4 className="text-[#FAF9F8] font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                    <div className="bg-[#FAF9F8]/5 p-4 rounded-xl border border-[#D7CCC8]/10 space-y-4">
                        <div className="flex items-start gap-3 text-sm">
                            <FiMapPin className="mt-1 text-[#D7CCC8]" />
                            <p className="leading-relaxed">
                                Tower B, 3rd Floor, Unitech Cyber Park, <br />
                                Sector 39, Gurugram, HR 122002
                            </p>
                        </div>
                        <div className="w-full h-24 bg-white/10 rounded-lg overflow-hidden grayscale opacity-50 hover:opacity-100 transition-opacity">
                            <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.667468647636!2d77.0396656150862!3d28.45949658248873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0xa19932155535928b!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1614141414141!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 border-t border-[#D7CCC8]/10 mt-16 pt-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] font-medium opacity-50">
                    © 2026 Avani HR Portal | Placement Management System
                </p>
            </div>
        </footer>
    );
};

export default Footer;