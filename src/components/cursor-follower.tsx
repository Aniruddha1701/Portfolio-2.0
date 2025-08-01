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
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            height: 32,
            width: 32,
            backgroundColor: 'hsl(var(--primary))',
            mixBlendMode: 'difference',
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: 'hsl(var(--background))',
            mixBlendMode: 'normal',
            border: '2px solid hsl(var(--primary))'
        },
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none"
            variants={variants}
            animate={isHoveringLink ? 'hover' : 'default'}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
    );
};

export default CursorFollower;
