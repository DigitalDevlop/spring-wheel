import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";

export default function ConfettiCelebration() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = [];
    const colors = ["#FFD700", "#FF6B35", "#4ECDC4", "#FF4757", "#9B59B6", "#00D084"];

    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      });
    }

    setConfetti(pieces);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            backgroundColor: piece.color,
            left: `${piece.x}%`,
            top: -20,
            borderRadius: "2px",
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            rotate: [0, 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </Box>
  );
}
