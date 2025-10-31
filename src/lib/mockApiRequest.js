export async function mockApiRequest(
    method,
    url,
    data,
  ){
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock responses based on URL and method
    const mockResponses = {
      'GET:/api/prizes': {
        status: 200,
        data: [
          { id: 1, name: "Smartphone", value: "₹25,000", icon: "📱", probability: 0.1 },
          { id: 2, name: "Gaming Laptop", value: "₹75,000", icon: "💻", probability: 0.05 },
          { id: 3, name: "Bluetooth Headphones", value: "₹5,000", icon: "🎧", probability: 0.2 },
          { id: 4, name: "Gift Voucher", value: "₹1,000", icon: "🎁", probability: 0.3 },
          { id: 5, name: "Smart Watch", value: "₹15,000", icon: "⌚", probability: 0.15 },
          { id: 6, name: "Cash Prize", value: "₹10,000", icon: "💰", probability: 0.2 }
        ]
      },
      
      'POST:/api/check-mobile': {
        status: 200,
        data: {
          customer: {
            id: 1,
            mobile: data?.mobile || "1234567890",
            attemptsThisMonth: Math.floor(Math.random() * 3), // 0, 1, or 2
            canSpin: true
          }
        }
      },
      
      'POST:/api/spin': {
        status: 200,
        data: {
          spin: {
            id: Date.now(),
            customerId: 1,
            mobile: "1234567890",
            won: Math.random() > 0.3, // 70% win rate
            prizeId: Math.random() > 0.5 ? 1 : 4, // Random prize
            prize: Math.random() > 0.5 
              ? { id: 1, name: "Smartphone", value: "₹25,000", icon: "📱" }
              : { id: 4, name: "Gift Voucher", value: "₹1,000", icon: "🎁" },
            spinDate: new Date().toISOString()
          }
        }
      },
      
      'POST:/api/claim-prize': {
        status: 200,
        data: {
          message: "Prize claimed successfully",
          winner: {
            id: Date.now(),
            customerId: 1,
            name: data?.name || "Test User",
            email: data?.email || "test@example.com",
            address: data?.address || "Test Address"
          }
        }
      },
      
      'GET:/api/admin/stats': {
        status: 200,
        data: {
          totalSpins: 1250,
          totalWins: 875,
          totalCustomers: 450,
          winRate: 70,
          popularPrizes: [
            { name: "Gift Voucher", count: 350 },
            { name: "Smartphone", count: 125 },
            { name: "Bluetooth Headphones", count: 175 }
          ]
        }
      }
    };
    
    const key = `${method}:${url}`;
    const mockResponse = mockResponses[key];
    
    if (!mockResponse) {
      // Return 404 for unknown endpoints
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Simulate occasional errors
    if (Math.random() > 0.95) { // 5% error rate
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(mockResponse.data), {
      status: mockResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Usage example: Replace apiRequest import with mock
  // import { mockApiRequest as apiRequest } from './mockApiRequest';