import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp(); // Trigger auto-submit when timer hits 0
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Clear the interval when the component unmounts
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-red-500 font-semibold">
      {/* Display time in mm:ss format */}
      {new Date(timeLeft * 1000).toISOString().substr(14, 5)}
    </div>
  );
};

export default CountdownTimer;
