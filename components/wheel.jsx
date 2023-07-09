import React, { useState } from "react";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

export default function Wheel({ data, position, origin, onClick }) {
  const [activeLayers, setActiveLayers] = useState(0);

  const angle = 360 / data.length;

  const Wrapper = styled(motion.div)`
    height: 450px;
    width: 450px;
    border-radius: 100%;
    position: absolute;
    transform-origin: center;
    user-select: none;
    top: ${position[1]}px;
    left: ${position[0]}px;
    transform: translate(-50%, -50%);
    z-index: 1;
  `;

  console.log(data);
  return (
    <Wrapper as={motion.div} onMouseLeave={() => setActiveLayers(0)}>
      <Origin data={origin} onMouseEnter={() => setActiveLayers(1)} />
      {activeLayers == 1 &&
          data.map((c, i) => (
            <Node
              data={c}
              index={i}
              angle={angle}
              key={i}
              onClick={(e) => onClick(e, i)}
            />
          ))}
    </Wrapper>
  );
}

function Origin({ data, onMouseEnter, onMouseLeave }) {
  const Wrapper = styled.div`
    color: black;
    aspect-ratio: 1 / 1;
    padding: 16px;
    border-radius: 100%;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
  `;
  return <Wrapper onMouseEnter={onMouseEnter}>{data}</Wrapper>;
}

function Node({ data, index, angle, onClick, onHover }) {
  const rotation = () => {
    return angle * index + angle / 2;
  };

  const Wrapper = styled.div`
    & {
      color: black;
      min-height: 40px;
      aspect-ratio: 1/1;
      border-radius: 100%;
      padding: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-origin: center;
      transform: translate(-50%, -50%) rotate(${rotation}deg) translate(170px)
        rotate(-${rotation}deg);
      transition: 0.2s ease;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 1);
      scale: 1.05;
    }
  `;
  return (
    <Wrapper
      onClick={(e) => onClick(e, index)}
    >
      {data}
    </Wrapper>
  );
}
