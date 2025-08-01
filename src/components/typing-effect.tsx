"use client"

import { TypeAnimation } from 'react-type-animation';

export function TypingEffect() {
  return (
    <TypeAnimation
      sequence={[
        'A Full Stack Developer.',
        1000,
        'A MERN Stack Expert.',
        1000,
        'A Machine Learning Enthusiast.',
        1000,
        'I build beautiful, responsive, and scalable web applications.',
        2000,
      ]}
      wrapper="p"
      speed={50}
      className="mx-auto max-w-[700px] text-muted-foreground md:text-xl h-16"
      repeat={Infinity}
    />
  );
}
