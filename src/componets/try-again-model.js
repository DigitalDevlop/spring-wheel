import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function TryAgainModal({ isOpen, onClose, attemptsLeft, onTryAgain }) {
  const handleTryAgain = () => {
    onTryAgain();
    onClose();
  };

  // const nextAvailableSpinDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogContent>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ textAlign: "center" }}
            >
              {attemptsLeft > 0 ? (
                <>
                  <Typography variant="h1" mb={2}>
                    😔
                  </Typography>
                  <Typography variant="h5" fontFamily="'Fredoka', sans-serif" color="text.primary" mb={2}>
                    Oops! No Prize This Time
                  </Typography>
                  <Typography color="text.secondary" mb={4}>
                    Don&apos;t worry! You have{" "}
                    <Box component="span" fontWeight="bold" color="primary.main">
                      {attemptsLeft} more attempt{attemptsLeft > 1 ? "s" : ""}
                    </Box>{" "}
                    this month.
                  </Typography>

                  <Box display="flex" gap={2} justifyContent="center">
                    <Button
                      onClick={handleTryAgain}
                      variant="contained"
                      sx={{
                        flex: 1,
                        background: "linear-gradient(90deg, #1976d2, #ff6d00)",
                        fontWeight: "600",
                        "&:hover": {
                          background: "linear-gradient(90deg, #ff6d00, #1976d2)",
                        },
                      }}
                      startIcon={<span>🔄</span>}
                    >
                      Try Again
                    </Button>
                    <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
                      Close
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h1" mb={2}>
                    ⏰
                  </Typography>
                  <Typography variant="h5" fontFamily="'Fredoka', sans-serif" color="text.primary" mb={2}>
                    Come Back Next Month!
                  </Typography>
                  <Typography color="text.secondary" mb={4}>
                    You&apos;ve used all your attempts for this month. Come back next month for more chances to win!
                  </Typography>

                  <Box
                    bgcolor="#f0f0f0"
                    borderRadius={2}
                    p={2}
                    mb={4}
                    textAlign="center"
                    color="text.secondary"
                  >
                    <Typography variant="body2">Next available spin:</Typography>
                    <Typography variant="h6" fontWeight="600" color="text.primary">
                      {/* {nextAvailableSpinDate} */}
                    </Typography>
                  </Box>

                  <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{
                      background: "linear-gradient(90deg, #1976d2, #ff6d00)",
                      fontWeight: "600",
                      "&:hover": {
                        background: "linear-gradient(90deg, #ff6d00, #1976d2)",
                      },
                    }}
                    startIcon={<span>📅</span>}
                  >
                    Understood
                  </Button>
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
