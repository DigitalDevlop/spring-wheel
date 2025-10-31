import { createServer } from "http";
import { storage } from "./storage";
import { insertCustomerSchema, insertSpinSchema } from "@shared/schema";
import { z } from "zod";

const mobileSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

const spinRequestSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

const winnerSchema = z.object({
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  name: z.string().min(1, "Name is required"),
  spinId: z.number(),
});

export async function registerRoutes(app) {
  // Check mobile number eligibility
  app.post("/api/check-mobile", async (req, res) => {
    try {
      const { mobile } = mobileSchema.parse(req.body);

      let customer = await storage.getCustomerByMobile(mobile);
      if (!customer) {
        customer = await storage.createCustomer({ mobile });
      }

      const spinsThisMonth = await storage.getCustomerSpinsThisMonth(mobile);
      const attemptsUsed = spinsThisMonth.length;
      const attemptsLeft = Math.max(0, 2 - attemptsUsed);

      res.json({
        customer,
        attemptsLeft,
        attemptsUsed,
        canSpin: attemptsLeft > 0,
        spinsThisMonth,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // Perform spin
  app.post("/api/spin", async (req, res) => {
    try {
      const { mobile } = spinRequestSchema.parse(req.body);

      const customer = await storage.getCustomerByMobile(mobile);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const spinsThisMonth = await storage.getCustomerSpinsThisMonth(mobile);
      if (spinsThisMonth.length >= 2) {
        return res.status(400).json({ message: "Maximum attempts reached for this month" });
      }

      const prizes = await storage.getActivePrizes();

      const isWinner = Math.random() < 0.7;

      let prizeName = null;
      let prizeValue = null;
      let prizeIcon = null;

      if (isWinner && prizes.length > 0) {
        const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
        let random = Math.random() * totalProbability;

        for (const prize of prizes) {
          random -= prize.probability;
          if (random <= 0) {
            prizeName = prize.name;
            prizeValue = prize.value;
            prizeIcon = prize.icon;
            break;
          }
        }
      }

      const spin = await storage.createSpin({
        customerId: customer.id,
        mobile,
        isWinner,
        prizeName,
        prizeValue,
        prizeIcon,
        attemptNumber: spinsThisMonth.length + 1,
      });

      const attemptsLeft = Math.max(0, 2 - (spinsThisMonth.length + 1));

      res.json({
        spin,
        attemptsLeft,
        customer,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // Update winner name
  app.post("/api/claim-prize", async (req, res) => {
    try {
      const { mobile, name, spinId } = winnerSchema.parse(req.body);

      const customer = await storage.getCustomerByMobile(mobile);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const updatedCustomer = await storage.updateCustomer(customer.id, { name });

      res.json({
        message: "Prize claimed successfully",
        customer: updatedCustomer,
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // Get admin statistics
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getSpinStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  // Get admin reports
  app.get("/api/admin/spins", async (req, res) => {
    try {
      const { dateRange, status, mobile } = req.query;

      const filters = {
        dateRange,
        status,
        mobile,
      };

      const spins = await storage.getAllSpins(filters);

      const enrichedSpins = await Promise.all(
        spins.map(async (spin) => {
          const customer = await storage.getCustomerByMobile(spin.mobile);
          return {
            ...spin,
            customerName: customer?.name || "Unknown",
            customerInitials: customer?.name
              ? customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : spin.mobile.slice(-2),
          };
        })
      );

      res.json(enrichedSpins);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  // Get prizes
  app.get("/api/prizes", async (req, res) => {
    try {
      const prizes = await storage.getActivePrizes();
      res.json(prizes);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
