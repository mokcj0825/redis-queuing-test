import { Request, Response, NextFunction } from 'express';

// Active operations tracking
const activeUserOperations: { [userId: string]: Promise<void> | null } = {};
const activeRewardOperations: { [rewardId: string]: Promise<void> | null } = {};

export default function joinLocking() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const rewardId = req.body.rewardId;

    if (typeof userId !== 'string' || typeof rewardId !== 'string') {
      return res.status(400).send("Both userId and rewardId must be provided as strings.");
    }

    // Wait for any existing operations for the same userId or rewardId to complete
    const userOperation = activeUserOperations[userId] || Promise.resolve();
    const rewardOperation = activeRewardOperations[rewardId] || Promise.resolve();

    // Setup new promises for the current operation
    let resolveUserOperation: () => void;
    let resolveRewardOperation: () => void;

    const userOperationPromise = new Promise<void>((resolve) => {
      resolveUserOperation = resolve;
    });
    const rewardOperationPromise = new Promise<void>((resolve) => {
      resolveRewardOperation = resolve;
    });

    activeUserOperations[userId] = userOperationPromise;
    activeRewardOperations[rewardId] = rewardOperationPromise;

    try {
      await Promise.all([userOperation, rewardOperation]);

      // Process the current request
      next();
    } catch (error) {
      console.error(`Error processing request for userId: ${userId} or rewardId: ${rewardId}: ${error}`);
      res.status(500).send("An error occurred while processing your request.");
    }

    // Resolve operations when request is completed or encounters an error
    res.on('finish', () => {
      resolveUserOperation();
      resolveRewardOperation();
    });

    res.on('error', () => {
      resolveUserOperation();
      resolveRewardOperation();
    });

    // Ensure that the operations are cleared after they are resolved
    userOperationPromise.then(() => {
      if (activeUserOperations[userId] === userOperationPromise) {
        activeUserOperations[userId] = null;
      }
    });
    rewardOperationPromise.then(() => {
      if (activeRewardOperations[rewardId] === rewardOperationPromise) {
        activeRewardOperations[rewardId] = null;
      }
    });
  };
}
