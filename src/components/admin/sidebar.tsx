"use client";

import { motion } from "framer-motion";
import {
    Home, User, Briefcase, GraduationCap, FolderOpen,
    MessageSquare, Settings, Wrench, Menu, X, LogOut, Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    userName?: string;
    onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, userName, onLogout }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { id: "overview", label: "Overview", icon: Home },
        { id: "personal", label: "Personal Info", icon: User },
        { id: "skills", label: "Skills", icon: Code2 },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "projects", label: "Projects", icon: FolderOpen },
        { id: "testimonials", label: "Reviews", icon: MessageSquare },
        { id: "services", label: "Services", icon: Wrench },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gray-900/80 backdrop-blur-xl border-r border-white/10">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Admin Panel
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Welcome, {userName || "Admin"}
                </p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            setIsOpen(false);
                        }}
                        className={cn(
                            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            activeTab === item.id
                                ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            activeTab === item.id ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300"
                        )} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 fixed inset-y-0 left-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button size="icon" variant="outline" onClick={() => setIsOpen(!isOpen)} className="bg-gray-900/50 border-white/10 backdrop-blur">
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="w-72 h-full bg-gray-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SidebarContent />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
