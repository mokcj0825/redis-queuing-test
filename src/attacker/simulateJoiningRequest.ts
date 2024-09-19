import axios from 'axios';

const baseURL = 'http://localhost:3000/join'; // Adjust if your server URL is different

// Generate 20 unique userIds and rewardIds
const userIds = Array.from({ length: 20 }, (_, i) => `user-${i + 1}`);
const rewardIds = Array.from({ length: 20 }, (_, i) => `reward-${i + 1}`);

let failedAttempts = 0;

// Function to send a join request
async function sendJoinRequest(userId: string, rewardId: string, round: number) {
  try {
    const response = await axios.post(baseURL, {
      userId,
      rewardId,
      round
    });
    console.log(`[${new Date().toISOString()}] Success: User ${userId} joined reward ${rewardId} in round ${round}: ${response.data}`);
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Error: ${error.response ? error.response.data : error.message}`);
    failedAttempts++;
  }
}

// Function to simulate multiple requests
async function simulateRequests() {
  console.log(`[${new Date().toISOString()}] Simulation start.`);
  const requests = [];
  for (let i = 0; i < 400; i++) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const rewardId = rewardIds[Math.floor(Math.random() * rewardIds.length)];
    requests.push(sendJoinRequest(userId, rewardId, i));
  }

  // Wait for all requests to complete
  await Promise.all(requests);
  console.log(`[${new Date().toISOString()}] All requests have been sent., Failed attempts: ${failedAttempts}`);
}

simulateRequests();
