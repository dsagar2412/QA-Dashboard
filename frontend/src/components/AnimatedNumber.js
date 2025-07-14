import React, { useEffect, useRef, useState } from 'react';

const AnimatedNumber = ({ value, duration = 1000, format = v => v }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef();
  const startValueRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startValueRef.current = 0;
    setDisplayValue(0);
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const current = startValueRef.current + (value - startValueRef.current) * progress;
      setDisplayValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span>{format(Math.round(displayValue))}</span>;
};

export default AnimatedNumber; 