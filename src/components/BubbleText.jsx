import React from "react";

const BubbleText = () => {
  const hoverTextStyle = {
    transition: '0.35s font-weight, 0.35s color',
  };

  return (
    <h2 className="text-center text-5xl font-thin text-white">
      {"AI Precision OncoTailor".split("").map((child, idx) => (
        <span
          key={idx}
          style={hoverTextStyle}
          className="hover:text-pink-500 hover:font-bold"
        >
          {child}
        </span>
      ))}
    </h2>
  );
};

export default BubbleText;
