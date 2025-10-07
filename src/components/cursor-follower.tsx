"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorFollower = () => {
    const [isHoveringLink, setIsHoveringLink] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Use motion values for smoother animation
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    // Spring physics for ultra-smooth movement with instant response
    const springConfig = { damping: 15, stiffness: 1000, mass: 0.1, restDelta: 0.001 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
    
    // Refs for performance
    const requestRef = useRef<number>();
    const mousePos = useRef({ x: -100, y: -100 });
    
    useEffect(() => {
        const updateCursor = () => {
            const targetX = mousePos.current.x;
            const targetY = mousePos.current.y;
            const currentX = cursorX.get();
            const currentY = cursorY.get();
            
            // Calculate distance for dynamic lerp
            const distance = Math.sqrt(
                Math.pow(targetX - currentX, 2) + 
                Math.pow(targetY - currentY, 2)
            );
            
            // Dynamic lerp factor based on distance for ultra-responsive feel
            const baseLerp = 0.65;
            const dynamicLerp = distance > 100 ? 0.85 : baseLerp;
            
            const newX = currentX + (targetX - currentX) * dynamicLerp;
            const newY = currentY + (targetY - currentY) * dynamicLerp;
            
            cursorX.set(newX);
            cursorY.set(newY);
            
            requestRef.current = requestAnimationFrame(updateCursor);
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX;
            const newY = e.clientY;
            mousePos.current = { x: newX, y: newY };
            
            // Direct set for immediate response on fast movements
            const currentX = cursorX.get();
            const currentY = cursorY.get();
            const distance = Math.sqrt(
                Math.pow(newX - currentX, 2) + 
                Math.pow(newY - currentY, 2)
            );
            
            // If moving very fast, update immediately for zero lag
            if (distance > 200) {
                cursorX.set(newX);
                cursorY.set(newY);
            }
            
            if (!isVisible) setIsVisible(true);
        };
        
        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target instanceof HTMLAnchorElement ||
                target instanceof HTMLButtonElement ||
                target.classList.contains('cursor-hover') ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setIsHoveringLink(true);
            }
        };
        
        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target instanceof HTMLAnchorElement ||
                target instanceof HTMLButtonElement ||
                target.classList.contains('cursor-hover') ||
                target.closest('a') ||
                target.closest('button')
            ) {
                setIsHoveringLink(false);
            }
        };
        
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeaveWindow = () => setIsVisible(false);
        
        // Start animation loop immediately
        updateCursor();
        
        // Event listeners
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget) handleMouseLeaveWindow();
        });
        document.body.addEventListener('mouseenter', handleMouseEnter, true);
        document.body.addEventListener('mouseleave', handleMouseLeave, true);
        
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseenter', handleMouseEnter, true);
            document.body.removeEventListener('mouseleave', handleMouseLeave, true);
        };
    }, [cursorX, cursorY]);
    
    const cursorVariants = {
        default: {
            width: 28,
            height: 28,
            backgroundColor: 'rgba(139, 92, 246, 0.25)',
            border: '2px solid rgba(139, 92, 246, 0.5)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
        },
        hover: {
            width: 56,
            height: 56,
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '2px solid rgba(139, 92, 246, 0.6)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
        },
        click: {
            width: 36,
            height: 36,
            backgroundColor: 'rgba(139, 92, 246, 0.35)',
            border: '2px solid rgba(139, 92, 246, 0.7)',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)',
        },
    };
    
    const dotVariants = {
        default: {
            width: 5,
            height: 5,
            backgroundColor: 'rgb(168, 85, 247)',
        },
        hover: {
            width: 10,
            height: 10,
            backgroundColor: 'rgb(147, 51, 234)',
        },
        click: {
            width: 3,
            height: 3,
            backgroundColor: 'rgb(168, 85, 247)',
        },
    };

    return (
        <>
            {/* Outer cursor ring */}
            <motion.div
                className="cursor-outer fixed top-0 left-0 rounded-full z-[9999] pointer-events-none hidden md:block will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                }}
                variants={cursorVariants}
                animate={isClicking ? 'click' : isHoveringLink ? 'hover' : 'default'}
                transition={{
                    type: 'tween',
                    duration: 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            />
            
            {/* Inner cursor dot */}
            <motion.div
                className="cursor-inner fixed top-0 left-0 rounded-full z-[9999] pointer-events-none hidden md:block will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                }}
                variants={dotVariants}
                animate={isClicking ? 'click' : isHoveringLink ? 'hover' : 'default'}
                transition={{
                    type: 'tween',
                    duration: 0.02,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            />
        </>
    );
};

export default CursorFollower;
