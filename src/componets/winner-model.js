import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";

import { mockApiRequest as apiRequest } from '../lib/mockApiRequest';

export default function WinnerModal({ isOpen, onClose, mobile, spin }) {
  const [name, setName] = useState("");

  const claimPrizeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/claim-prize", {
        mobile,
        name,
        spinId: spin.id,
      });
      return response.json();
    },
    onSuccess: () => {
      alert("Prize Claimed! Congratulations! Your prize has been registered. You will be contacted soon!");
      onClose();
    },
    onError: (error) => {
      alert(error.message || "Failed to claim prize");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name to claim the prize");
      return;
    }
    claimPrizeMutation.mutate();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogContent sx={{ position: "relative", textAlign: "center", pt: 6, pb: 6 }}>
            {/* Confetti */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: ["#FFD700", "#FF6B35", "#4ECDC4", "#FF4757"][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: -10,
                  }}
                  animate={{ y: 400, rotate: 360, opacity: 0 }}
                  initial={{ y: 0, rotate: 0, opacity: 1 }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              ))}
            </Box>

            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Typography variant="h1" mb={4}>
                🎉
              </Typography>
            </motion.div>

            <Typography variant="h4" fontFamily="'Fredoka', sans-serif" color="text.primary" mb={2}>
              Congratulations!
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              You've won an amazing prize!
            </Typography>

            {/* Prize Display */}
            <Box
              sx={{
                bgcolor: "primary.light",
                background: "linear-gradient(90deg, #00bfa5, #ffee58)",
                borderRadius: 3,
                p: 4,
                mb: 4,
                color: "text.primary",
              }}
            >
              <Typography variant="h2" mb={1}>
                {spin.prizeIcon}
              </Typography>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {spin.prizeName}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                {spin.prizeValue}
              </Typography>
            </Box>

            {/* Name Input Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                id="winnerName"
                label="Enter Your Name"
                placeholder="Your full name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  disabled={claimPrizeMutation.isLoading}
                  variant="contained"
                  sx={{
                    flex: 1,
                    background: "linear-gradient(90deg, #4caf50, #2e7d32)",
                    fontWeight: "600",
                    "&:hover": {
                      background: "linear-gradient(90deg, #2e7d32, #4caf50)",
                    },
                  }}
                  startIcon={<span>✅</span>}
                >
                  {claimPrizeMutation.isLoading ? "Claiming..." : "Claim Prize"}
                </Button>

                <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
                  Close
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
