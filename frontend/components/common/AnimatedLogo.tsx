"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type AnimatedLogoProps = {
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  ariaLabel?: string;
};

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = "h-10 w-10",
  autoplay = true,
  loop = true,
  ariaLabel = "Logo",
}) => {
  return (
    <div className={className} aria-label={ariaLabel}>
      <DotLottieReact src="/logo.lottie" autoplay={autoplay} loop={loop} />
    </div>
  );
};

export default AnimatedLogo;
