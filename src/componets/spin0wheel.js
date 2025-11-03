import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Confetti from "react-confetti"; // ✅ Add this line
import {
  CircularProgress, // ✅ Add this line inside MUI imports
} from "@mui/material";

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });
  const [openForm, setOpenForm] = useState(false);
  const [winnerPrize, setWinnerPrize] = useState("");
  const [formData, setFormData] = useState({ name: "", mobile: "", id: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const segments = [
    { label: "🎯 Try Again" },
    { label: "💰 Ada Sampatha" },
    { label: "🎯 Try Again" },
    { label: "🏆 Gift Voucher" },
    { label: "🎯 Try Again" },
    { label: "🎪 Govi Setha" },
    { label: "🎯 Try Again" },
    { label: "🎊 Mega Power 2" },
  ];

  // const handleSpin = () => {
  //   if (isSpinning) return;
  //   setIsSpinning(true);

  //   const randomRotation = Math.floor(Math.random() * 360) + 1440;
  //   setRotation((prev) => prev + randomRotation);

  //   setTimeout(() => {
  //     setIsSpinning(false);

  //     // Decide win/lose
  //     const winningSegment = segments[Math.floor(Math.random() * segments.length)];
  //     if (winningSegment.label.includes("Try Again")) {
  //       setToast({ open: true, message: "😅 Try Again Next Time!", severity: "info" });
  //     } else {
  //       setWinnerPrize(winningSegment.label);
  //       setOpenForm(true);
  //     }
  //   }, 4000);
  // };

  // Replace with your actual Google Form "formResponse" URL
  const GOOGLE_FORM_ACTION =
    "https://docs.google.com/forms/d/e/1FAIpQLSfcLs8nAeOG7HnDTZeB09mcITFQ4IyMySZLByx4nCyFd5E0pw/formResponse";

  // Replace entry numbers with your actual form field IDs
  const ENTRY_NAME = "entry.1346198872";
  const ENTRY_MOBILE = "entry.1391927988";
  const ENTRY_ID = "entry.62945274";
  const ENTRY_PRIZE = "entry.846432622";

  const handleSpin = () => {
    if (isSpinning) return;

    // ---- DAILY LIMIT (3 spins per day) ----
    const today = new Date().toISOString().split("T")[0];
    const spinData = JSON.parse(localStorage.getItem("spinData")) || { spins: 0, date: today };

    if (spinData.date !== today) {
      spinData.spins = 0;
      spinData.date = today;
    }

    if (spinData.spins >= 3) {
      setToast({
        open: true,
        message: "🎡 You’ve used all 3 spins for today! Come back tomorrow.",
        severity: "warning",
      });
      return;
    }

    spinData.spins += 1;
    localStorage.setItem("spinData", JSON.stringify(spinData));
    // --------------------------------------

    setIsSpinning(true);
    const randomRotation = Math.floor(Math.random() * 360) + 1440;
    setRotation((prev) => prev + randomRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const winningSegment = segments[Math.floor(Math.random() * segments.length)];

      if (winningSegment.label.includes("Try Again")) {
        setToast({ open: true, message: "😅 Try Again Next Time!", severity: "info" });
      } else {
        setWinnerPrize(winningSegment.label);
        setOpenForm(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formBody = new URLSearchParams();
    formBody.append(ENTRY_NAME, formData.name);
    formBody.append(ENTRY_MOBILE, formData.mobile);
    formBody.append(ENTRY_ID, formData.id);
    formBody.append(ENTRY_PRIZE, winnerPrize);

    try {
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: formBody,
      });
      setToast({ open: true, message: "🎉 Submitted Successfully!", severity: "success" });
      setOpenForm(false);
      setFormData({ name: "", mobile: "", id: "" });
    } catch (error) {
      setToast({ open: true, message: "Error submitting form", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remaining spins for display
  const today = new Date().toISOString().split("T")[0];
  const spinData = JSON.parse(localStorage.getItem("spinData")) || { spins: 0, date: today };
  const spinsLeft = spinData.date === today ? 3 - spinData.spins : 3;

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      {showConfetti && <Confetti numberOfPieces={400} recycle={false} />}

      <Typography variant="h3" sx={{ mb: 2, color: "white" }}>
        🎰 Spin the Wheel! 🎰
      </Typography>

      <Typography variant="subtitle1" sx={{ color: "white", mb: 2 }}>
        You have {spinsLeft} spin{spinsLeft !== 1 && "s"} left today.
      </Typography>

    {/* Wheel */}
<Box sx={{ position: "relative", mx: "auto", width: 320, height: 320 }}>
  <motion.div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "8px solid white",
      background: `conic-gradient(
        #FF6B35 0deg 45deg,
        #4ECDC4 45deg 90deg,
        #FFD700 90deg 135deg,
        #00D084 135deg 180deg,
        #9B59B6 180deg 225deg,
        #FF4757 225deg 270deg,
        #3498DB 270deg 315deg,
        #FFA500 315deg 360deg
      )`,
      position: "relative",
    }}
    animate={{ rotate: rotation }}
    transition={{ duration: 4, ease: "easeOut" }}
  >
    {/* 🎯 Prize Labels on Wheel */}
    {segments.map((segment, i) => {
      const angle = (360 / segments.length) * i + 22.5; // center each label
      return (
        <Typography
          key={i}
          sx={{
            position: "absolute",
            top: "40%",
            left: "40%",
            transform: `rotate(${angle}deg) translate(0, -120px) rotate(-${angle}deg)`,
            transformOrigin: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.9rem",
            textShadow: "1px 1px 3px black",
            width: "50px",
            textAlign: "center",
          }}
        >
          {segment.label}
        </Typography>
      );
    })}
  </motion.div>


        {/* Pointer */}
        <Box
  sx={{
    position: "absolute",
    top: "-10px", // you can adjust to sit nicely above the wheel
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "20px solid red", // 👈 changed from borderBottom → borderTop
  }}
/>
      </Box>

      {/* Spin Button */}
      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={handleSpin}
        disabled={isSpinning}
        sx={{ mt: 4 }}
      >
        {isSpinning ? "⏳ Spinning..." : "🎡 Spin Now!"}
      </Button>

      {/* Winner Form */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>🎉 You Won {winnerPrize}!</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Mobile Number"
            fullWidth
            margin="dense"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          <TextField
            label="ID Number"
            fullWidth
            margin="dense"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}