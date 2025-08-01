"use client"

import { TypeAnimation } from 'react-type-animation';
import { useEffect, useState } from 'react';

export function TypingEffect() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl h-16">&nbsp;</p>;
  }

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
