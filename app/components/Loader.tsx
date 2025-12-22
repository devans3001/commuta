import React, { useState, useEffect } from "react";
import {
  ClimbingBoxLoader,
  GridLoader,
  HashLoader,
  PacmanLoader,
  RingLoader,
  SyncLoader,
} from "react-spinners";

const DEFAULT_COLOR = "#7E22CE";

// 1️⃣ Create a type for any spinner component
type SpinnerComponent = React.ComponentType<{
  color?: string;
  size?: number;
}>;

// 2️⃣ Make the array typed
const spinnerComponents: SpinnerComponent[] = [
  ClimbingBoxLoader,
  GridLoader,
  HashLoader,
  PacmanLoader,
  RingLoader,
  SyncLoader,
];

function Loading() {
  // 3️⃣ Use proper generic for state
  const [RandomSpinner, setRandomSpinner] = useState<SpinnerComponent | null>(
    null
  );

  useEffect(() => {
    const picked =
      spinnerComponents[Math.floor(Math.random() * spinnerComponents.length)];

    setRandomSpinner(() => picked);
  }, []);

  if (!RandomSpinner) return null;

  return (
    <>
    {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> */}
      <GridLoader size={30} />
    </>
  );
}

export default Loading;
