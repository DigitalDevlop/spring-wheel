import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import WinnerModal from "../componets/winner-model";
import TryAgainModal from "../componets/try-again-model";
import ConfettiCelebration from "../componets/confititi-celebreation";
import SpinWheel from "../componets/spin0wheel";
import MobileInput from "../componets/mobile-input";
import { Box, Button, Container, Typography, Grid, Paper } from "@mui/material";
export default function SpinWheelPage() {
  const [currentMobile, setCurrentMobile] = useState("");
  const [showWheel, setShowWheel] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [spinResult, setSpinResult] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showTryAgainModal, setShowTryAgainModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: prizes } = useQuery({
    queryKey: ["/api/prizes"],
    enabled: true,
  });

  const handleMobileSuccess = (mobile, data) => {
    console.log("data, mobile", data,mobile)
    setCurrentMobile(mobile);
    setCustomerData(data);
    setShowWheel(true);
  };

  const handleSpinComplete = (result) => {
    setSpinResult(result);

    if (result.spin.isWinner) {
      setShowConfetti(true);
      setShowWinnerModal(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setShowTryAgainModal(true);
    }
  };

  const handleTryAgain = () => {
    setShowTryAgainModal(false);
    setSpinResult(null);
  };

  // const handleNewGame = () => {
  //   setShowWheel(false);
  //   setCurrentMobile("");
  //   setCustomerData(null);
  //   setSpinResult(null);
  //   setShowWinnerModal(false);
  //   setShowTryAgainModal(false);
  // };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #7e57c2, #42a5f5, #26c6da)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ position: "relative", zIndex: 50, bgcolor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <Container sx={{ py: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#ffd600",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🎰
              </Box>
              <Typography variant="h5" color="white" fontWeight="bold" fontFamily="Fredoka">
                Lucky Spin
              </Typography>
            </Grid>
            {/* <Grid item display="flex" gap={2}>
              <Button onClick={handleNewGame} variant="outlined" color="inherit">
                🎮 New Game
              </Button>
              <Link href="/admin">
                <Button variant="contained" sx={{ bgcolor: "#ffd600", color: "black", fontWeight: 600 }}>
                  ⚙️ Admin
                </Button>
              </Link>
            </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      {!showWheel ? (
        <>
          <Container sx={{ py: 8, textAlign: "center" }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography variant="h3" color="white" fontFamily="Fredoka" mb={2}>
                🎉 Spin & Win Amazing Prizes! 🎉
              </Typography>
            </motion.div>
            <Typography variant="h6" color="white" mb={5}>
              Get ready for the ultimate spinning experience! Win incredible prizes every month!
            </Typography>

            <Grid container spacing={4} justifyContent="center" mb={8}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", textAlign: "center" }}>
                  <Typography variant="h4">🏆</Typography>
                  <Typography variant="h6" color="white">70% Win Rate</Typography>
                  <Typography variant="body2" color="white">Most players win something amazing!</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", textAlign: "center" }}>
                  <Typography variant="h4">🎁</Typography>
                  <Typography variant="h6" color="white">8+ Prizes</Typography>
                  <Typography variant="body2" color="white">From gadgets to cash rewards!</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 3, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", textAlign: "center" }}>
                  <Typography variant="h4">⚡</Typography>
                  <Typography variant="h6" color="white">Instant Results</Typography>
                  <Typography variant="body2" color="white">Know your prize immediately!</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>

          <MobileInput onSuccess={handleMobileSuccess} />

          <Container sx={{ py: 8 }}>
            <Typography variant="h4" color="white" fontFamily="Fredoka" textAlign="center" mb={4}>
              🎁 Amazing Prizes Await! 🎁
            </Typography>
            <Grid container spacing={3}>
              {prizes?.map((prize, index) => (
                <Grid item xs={12} sm={6} md={3} key={prize.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Paper elevation={4} sx={{ overflow: "hidden" }}>
                      <Box
                        sx={{
                          height: 128,
                          background: "linear-gradient(to bottom right, #7e57c2, #42a5f5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: 32,
                        }}
                      >
                        {prize.icon}
                      </Box>
                      <Box p={2}>
                        <Typography variant="subtitle1" fontWeight={600}>{prize.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{prize.value}</Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      ) : 
      (
        <SpinWheel
          // mobile={currentMobile}
          // customerData={customerData}
          onSpinComplete={handleSpinComplete}
          prizes={prizes || []}
        />
      )}

      {/* Modals */}
      {showWinnerModal && spinResult && (
        <WinnerModal
          isOpen={showWinnerModal}
          onClose={() => setShowWinnerModal(false)}
          mobile={currentMobile}
          spin={spinResult.spin}
        />
      )}

      {/* {showTryAgainModal && spinResult && (
        <TryAgainModal
          isOpen={showTryAgainModal}
          onClose={() => setShowTryAgainModal(true)}
          // attemptsLeft={spinResult.attemptsLeft}
          onTryAgain={handleTryAgain}
        />
      )} */}

      {showConfetti && <ConfettiCelebration />}
    </Box>
  );
}
