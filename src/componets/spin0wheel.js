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
import image1 from "./Dana Nidanaya.png"
import image2 from "./Mega Power.png"
import image3 from "./Govisetha.png"
import image4 from "./Hadahana.png"

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
    { label: "Try Again" },
    { label: "Dana Nidanaya", image: image1},
    { label: "Try Again" },
    { label: "Mega Power", image: image2},
    { label: "Try Again" },
    { label: "Govisetha", image: image3},
    { label: "Try Again" },
    { label: "Hadahana", image: image4},
  ];

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
    const spinData = JSON.parse(localStorage.getItem("spinData")) || { spins: 0, date: today, hasWon: false };

    if (spinData.date !== today) {
      spinData.spins = 0;
      spinData.hasWon = false;
      spinData.date = today;
    }

     // 🛑 Stop if already won today
     if(spinData.hasWon) {
      setToast({
        open: true,
        message: "🎡 You’ve used all 3 spins for today! Come back tomorrow.",
        severity: "warning",
      });
      return;
     }

      // 🛑 Stop if already used 3 spins (without a win)
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
    const newRotation = rotation + randomRotation; // store total rotation
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = newRotation % 360; // normalize rotation within one turn
      const segmentAngle = 360 / segments.length;
      const adjustedRotation = (360 - normalizedRotation + segmentAngle / 2) % 360;
      const winningIndex = Math.floor(adjustedRotation / segmentAngle);
      const winningSegment = segments[winningIndex >= segments.length ? 0 : winningIndex];

      if (winningSegment.label.includes("Try Again")) {
        setToast({ open: true, message: "😅 Try Again Next Time!", severity: "info" });
      } else {
        // 🏆 Mark as winner and stop further spins today
      spinData.hasWon = true;
      localStorage.setItem("spinData", JSON.stringify(spinData));
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
    <Box
    sx={{
      width: { xs: "100%", sm: "400px" },   // responsive width
      height: { xs: "auto", sm: "450px" },  // full widget height
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      margin: "0 auto",
      background: "transparent",            // transparent background
      boxShadow: "none",
      p: { xs: 2, sm: 3 },
      overflow: "hidden",                   // prevent cutoff inside iframe
    }}
  >
  
      {showConfetti && <Confetti numberOfPieces={400} recycle={false} />}

      <Typography
  variant="h3"
  sx={{
    mb: 2,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",

    // ✅ Responsive font sizes
    fontSize: {
      xs: "1.75rem", // Mobile
      sm: "2.2rem",  // Tablets
      md: "2.9rem",    // Desktop
    }
  }}
>
Spin the Wheel!
</Typography>

<Typography
  variant="subtitle1"
  sx={{
    color: "black",
    mb: 2,
    textAlign: "center",

    // ✅ Responsive subtitle
    fontSize: {
      xs: "0.9rem",
      sm: "1rem",
      md: "1.2rem",
    }
  }}
>
  You have {spinsLeft} spin{spinsLeft !== 1 && "s"} left today.
</Typography>

    {/* Wheel */}
    <Box
  sx={{
    position: "relative",
    mx: "auto",
    width: { xs: 260, sm: 300, md: 320 },
    height: { xs: 260, sm: 300, md: 320 },
  }}
>
{/* 🎯 Pointer */}
<Box
    sx={{
      position: "absolute",
      top: "-15px",              // move it above the circle
      left: "54%",
      transform: "translateX(-50%) rotate(180deg)",
      width: 0,
      height: 0,
      borderLeft: "12px solid transparent",
      borderRight: "12px solid transparent",
      borderBottom: "20px solid #ff007f",
      zIndex: 10,
    }}
  />
 
  <motion.div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "2px solid black",
      background: `conic-gradient(
        red 0deg 45deg,
        #fff 45deg 90deg, 
        red  90deg 135deg,
        #fff 135deg 180deg,
        red  180deg 225deg,
        #FFf 225deg 270deg,
        red  270deg 315deg,
        #FFf 315deg 360deg
      )`,
      position: "relative",
       // color chnaged
    }}
    animate={{ rotate: rotation }}
    transition={{ duration: 4, ease: "easeOut" }}
  >
    {/* 🎯 Prize Labels on Wheel */}
    {segments.map((segment, i) => {
  const angle = (360 / segments.length) * i + 22.5;
  return (
    <Box
      key={i}
      sx={{
        position: "absolute",
        top: "43%",
        left: "44%",
        transform: {
          xs: `rotate(${angle}deg) translate(0, -85px) rotate(-${angle}deg)`,
          sm: `rotate(${angle}deg) translate(0, -100px) rotate(-${angle}deg)`,
          md: `rotate(${angle}deg) translate(0, -115px) rotate(-${angle}deg)`,
        },
        transformOrigin: "center",
        textAlign: "center",
      }}
    >
      {segment.image ? (
        <img
          src={segment.image}
          alt={segment.label}
          style={{
            width: "45px",
            height: "30px",
            // borderRadius: "8px",
            objectFit: "contain",
          }}
        />
      ) : (
        <Typography
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: {
              xs: "0.6rem",
              sm: "0.75rem",
              md: "0.9rem",
            },
            // textShadow: "1px 1px 3px black",
          }}
        >
          {segment.label}
        </Typography>
      )}
    </Box>
  );
})}
  </motion.div>


        {/* Pointer */}
        <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh", // ✅ vertically center
    textAlign: "center",
    background: "transparent",
    p: { xs: 2, sm: 3, md: 4 }, // ✅ responsive padding
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
  sx={{ mt: 3, mb: 1 }}
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