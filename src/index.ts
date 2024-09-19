import express, { Request, Response } from 'express';
import joinLocking from "./middleware/join-locking";

const app = express();
const port = 3000;

app.use(express.json());


app.post('/join', joinLocking(), (req: Request, res: Response) => {
  const { userId, rewardId, round } = req.body;

  // Validate received data
  if (!userId || !rewardId || typeof round !== 'number') {
    return res.status(400).send("Invalid or missing data: userId, rewardId, and round are required.");
  }

  console.log(`Processing join request: userId=${userId}, rewardId=${rewardId}, round=${round}`);

  // Simulate a delay to emulate some processing time
  setTimeout(() => {
    res.send(`User ${userId} joined reward ${rewardId} in round ${round}`);
  }, 1000);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
