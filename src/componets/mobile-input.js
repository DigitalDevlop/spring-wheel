import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { mockApiRequest as apiRequest } from "../lib/mockApiRequest";
import {countryOptions} from "../lib/helper"

export default function MobileInput({ onSuccess }) {
  const [mobile, setMobile] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [countryCode, setCountryCode] = useState("+94");

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const checkMobileMutation = useMutation({
    mutationFn: async (mobile) => {
      const response = await apiRequest("POST", "/api/check-mobile", { mobile });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data?.customer?.canSpin) {
        onSuccess(mobile, data);
      } else {
        showSnackbar(
          "You have used all your attempts for this month. Come back next month!",
          "warning"
        );
      }
    },
    onError: (error) => {
      showSnackbar(error.message || "Please enter a valid mobile number", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[0-9]{9}$/.test(mobile)) {
      showSnackbar("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    checkMobileMutation.mutate(mobile);
  };

  return (
    <>
      <Box component="section" sx={{ maxWidth: 400, mx: "auto", py: 8, px: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card elevation={6}>
            <CardContent sx={{ pt: 4 }}>
              <Box textAlign="center" mb={3}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    backgroundColor: "primary.main",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    fontSize: 28,
                  }}
                >
                  📱
                </Box>
                <Typography variant="h5" fontWeight={600} mb={1}>
                  Enter Your Mobile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start your winning journey!
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography variant="body2" mb={1}>
                    Mobile Number
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="country-code-label">Code</InputLabel>
          <Select
            labelId="country-code-label"
            value={countryCode}
            label="Code"
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {countryOptions.map((country) => (
              <MenuItem key={country.iso} value={country.code}>
                {country.iso} ({country.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
                    <TextField
                      fullWidth
                      type="tel"
                      placeholder="7776543210"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 9))
                      }
                      required
                      inputProps={{ maxLength: 10 }}
                      sx={{
                        "& input": { pl: 1.5 },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0 4px 4px 0",
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" mt={1}>
                    Enter 10-digit mobile number
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={checkMobileMutation.isPending}
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(to right, #1976d2, #fb8c00)",
                    "&:hover": {
                      background: "linear-gradient(to right, #fb8c00, #1976d2)",
                    },
                  }}
                >
                  {checkMobileMutation.isPending ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Checking...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: 8 }}>▶️</span>
                      Start Spinning!
                    </>
                  )}
                </Button>
              </form>

              <Box mt={4} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  🛡️ Two spins per month per mobile number
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
