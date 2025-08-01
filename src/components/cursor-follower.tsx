"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CursorFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHoveringLink, setIsHoveringLink] = useState(false);

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e: MouseEvent) => {
            if ((e.target instanceof HTMLAnchorElement) || (e.target instanceof HTMLButtonElement)) {
                setIsHoveringLink(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            if ((e.target instanceof HTMLAnchorElement) || (e.target instanceof HTMLButtonElement)) {
                setIsHoveringLink(false);
            }
        };

        window.addEventListener('mousemove', mouseMove);
        document.body.addEventListener('mouseenter', handleMouseEnter, true);
        document.body.addEventListener('mouseleave', handleMouseLeave, true);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            document.body.removeEventListener('mouseenter', handleMouseEnter, true);
            document.body.removeEventListener('mouseleave', handleMouseLeave, true);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            height: 16,
            width: 16,
            backgroundColor: 'hsl(var(--primary))',
            mixBlendMode: 'difference',
        },
        hover: {
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            height: 64,
            width: 64,
            backgroundColor: 'hsl(var(--primary))',
            mixBlendMode: 'difference',
            opacity: 0.2,
        },
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none hidden md:block"
            variants={variants}
            animate={isHoveringLink ? 'hover' : 'default'}
            transition={{ type: 'spring', stiffness: 800, damping: 40 }}
        />
    );
};

export default CursorFollower;
