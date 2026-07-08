import { useEffect, useState } from "react";

const Countdown = () => {
  const target = new Date().getTime() + 1000 * 60 * 60 * 8;

  const calculate = () => {
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return {
      hours: String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, "0"),
      minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [time, setTime] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <span>{time.hours}</span> :
      <span>{time.minutes}</span> :
      <span>{time.seconds}</span>
    </div>
  );
};

export default Countdown;