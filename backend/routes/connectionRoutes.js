import express from 'express';
import {
  sendConnectionRequest,
  updateConnectionStatus,
  getConnections,
  getPendingRequests
} from '../controllers/connectionController.js';
const router = express.Router();

router.post('/request', sendConnectionRequest);
router.put('/:id',  updateConnectionStatus);
router.get('/',  getConnections);
router.get('/pending', getPendingRequests);

export default router;