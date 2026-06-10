"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, motion } from "framer-motion";

interface CountUpProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Number of decimal places */
  decimals?: number;
}

export function CountUp({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: CountUpProps) {
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 25,
    mass: 1,
  });

  const display = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    spring.jump(0);
    spring.set(value);
    prevValue.current = value;
  }, [spring, value, duration]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = v;
      }
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span ref={nodeRef} className={className}>
      {`${prefix}0${suffix}`}
    </motion.span>
  );
}
