import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useOnClickOutside } from 'usehooks-ts';

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
    return context;
};

export const SidebarProvider = ({ children, initialExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(initialExpanded);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar, isMobileOpen, setIsMobileOpen, toggleMobile }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const ExpandableSidebar = ({ sidebarItems = [], footerItem }) => {
    const { isExpanded, toggleSidebar, isMobileOpen, toggleMobile, setIsMobileOpen } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    // For mobile "click outside to close"
    const mobileRef = React.useRef(null);
    useOnClickOutside(mobileRef, () => setIsMobileOpen(false));

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gradient-to-b from-primary to-primary-light text-cream shadow-2xl relative">
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between overflow-hidden">
                <motion.div
                    animate={{ width: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap"
                >
                    <h2 className="text-xl font-bold tracking-widest text-accent">AVANI HR</h2>
                </motion.div>
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex p-2 rounded-xl hover:bg-white/10 text-secondary transition-colors"
                >
                    {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={24} />}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 space-y-2 mt-4 custom-scrollbar overflow-y-auto">
                {sidebarItems.map((item, idx) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <SidebarItem
                            key={idx}
                            item={item}
                            isActive={isActive}
                            isExpanded={isExpanded}
                            onClick={() => {
                                navigate(item.path);
                                setIsMobileOpen(false);
                            }}
                        />
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            {footerItem && (
                <div className="p-4 border-t border-white/10">
                    <SidebarItem
                        item={footerItem}
                        isExpanded={isExpanded}
                        onClick={footerItem.onClick}
                        className="hover:bg-red-500/10 hover:text-red-400"
                    />
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobile}
                className="md:hidden fixed top-4 left-4 z-[60] bg-primary p-2 rounded-lg text-white shadow-lg"
            >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isExpanded ? 260 : 80 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 z-40"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[50] md:hidden"
                            onClick={toggleMobile}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-screen w-72 z-[55] md:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

const SidebarItem = ({ item, isActive, isExpanded, onClick, className }) => {
    const { icon: Icon, label } = item;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative flex items-center py-3 px-4 rounded-2xl cursor-pointer transition-all duration-300",
                isActive
                    ? "bg-secondary/10 text-accent font-semibold shadow-inner"
                    : "text-gray-400 hover:bg-white/5 hover:text-secondary",
                !isExpanded && "justify-center px-0",
                className
            )}
        >
            <div className={cn(
                "flex-shrink-0 transition-colors",
                isActive ? "text-accent" : "text-gray-400 group-hover:text-secondary"
            )}>
                <Icon size={isExpanded ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            <motion.span
                initial={false}
                animate={{
                    opacity: isExpanded ? 1 : 0,
                    x: isExpanded ? 0 : -10,
                    display: isExpanded ? 'block' : 'none'
                }}
                className="ml-4 whitespace-nowrap overflow-hidden text-sm"
            >
                {label}
            </motion.span>

            {/* Active Glow Indicator */}
            {isActive && (
                <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-2xl bg-accent/5 ring-1 ring-accent/30 pointer-events-none"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
            )}

            {/* Tooltip for collapsed mode */}
            {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-primary text-cream text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10 z-[100] shadow-xl">
                    {label}
                </div>
            )}
        </motion.div>
    );
};
