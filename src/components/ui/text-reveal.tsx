"use client";
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";

type TextRevealProps = {
    text: string;
    el?: keyof JSX.IntrinsicElements;
    className?: string;
    delay?: number;
    duration?: number;
};

export const TextReveal = ({
    text,
    el: Wrapper = "p",
    className,
    delay = 0,
    duration = 0.5,
}: TextRevealProps) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.5, once: true });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const defaultAnimations = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const charAnimations = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            scale: 1.5,
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: duration,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    return (
        <Wrapper className={className}>
            <motion.span
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={defaultAnimations}
                aria-hidden
            >
                {text.split("").map((char, index) => (
                    <motion.span
                        key={`${char}-${index}`}
                        className="inline-block"
                        variants={charAnimations}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.span>
            <span className="sr-only">{text}</span>
        </Wrapper>
    );
};
