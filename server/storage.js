class MemStorage {
  constructor() {
    this.customers = new Map();
    this.spins = new Map();
    this.prizes = new Map();
    this.currentCustomerId = 1;
    this.currentSpinId = 1;
    this.currentPrizeId = 1;

    this.initializePrizes();
  }

  initializePrizes() {
    const defaultPrizes = [
      { name: "Smartphone", value: "₹25,000", icon: "📱", probability: 5, isActive: true },
      { name: "Gaming Laptop", value: "₹75,000", icon: "💻", probability: 2, isActive: true },
      { name: "Gift Voucher", value: "₹5,000", icon: "🎁", probability: 15, isActive: true },
      { name: "Cash Prize", value: "₹10,000", icon: "💰", probability: 8, isActive: true },
      { name: "Wireless Earbuds", value: "₹8,000", icon: "🎧", probability: 12, isActive: true },
      { name: "Smartwatch", value: "₹15,000", icon: "⌚", probability: 10, isActive: true },
      { name: "Premium Headphones", value: "₹12,000", icon: "🎵", probability: 8, isActive: true },
      { name: "Tablet", value: "₹20,000", icon: "📟", probability: 6, isActive: true },
    ];

    defaultPrizes.forEach(prize => this.createPrize(prize));
  }

  async getCustomerByMobile(mobile) {
    return Array.from(this.customers.values()).find(c => c.mobile === mobile);
  }

  async createCustomer(insertCustomer) {
    const id = this.currentCustomerId++;
    const customer = { ...insertCustomer, id, createdAt: new Date() };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id, updates) {
    const customer = this.customers.get(id);
    if (!customer) throw new Error("Customer not found");
    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async getCustomerSpinsThisMonth(mobile) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return Array.from(this.spins.values()).filter(
      spin => spin.mobile === mobile && spin.createdAt >= startOfMonth
    );
  }

  async createSpin(insertSpin) {
    const id = this.currentSpinId++;
    const spin = { ...insertSpin, id, createdAt: new Date() };
    this.spins.set(id, spin);
    return spin;
  }

  async getAllSpins(filters) {
    let spins = Array.from(this.spins.values());

    if (filters?.mobile) {
      spins = spins.filter(spin => spin.mobile.includes(filters.mobile));
    }

    if (filters?.status) {
      if (filters.status === "Winners") spins = spins.filter(spin => spin.isWinner);
      else if (filters.status === "Losers") spins = spins.filter(spin => !spin.isWinner);
    }

    if (filters?.dateRange) {
      const now = new Date();
      let startDate;

      switch (filters.dateRange) {
        case "Last 7 days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "Last 30 days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last 90 days":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }

      spins = spins.filter(spin => spin.createdAt >= startDate);
    }

    return spins.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSpinStats() {
    const allSpins = Array.from(this.spins.values());
    const totalSpins = allSpins.length;
    const totalWins = allSpins.filter(spin => spin.isWinner).length;
    const winRate = totalSpins > 0 ? Math.round((totalWins / totalSpins) * 100) : 0;
    return { totalSpins, totalWins, winRate };
  }

  async getActivePrizes() {
    return Array.from(this.prizes.values()).filter(prize => prize.isActive);
  }

  async createPrize(insertPrize) {
    const id = this.currentPrizeId++;
    const prize = { ...insertPrize, id };
    this.prizes.set(id, prize);
    return prize;
  }
}

export const storage = new MemStorage();
