import express from 'express';
import {
  sendConnectionRequest,
  unsendConnectionRequest, 
  updateConnectionStatus,
  getConnections,
  getPendingRequests,
  approveConnectionRequest
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/request', sendConnectionRequest); 
router.delete('/unsend', unsendConnectionRequest);
router.put('/status', updateConnectionStatus);
router.get('/', getConnections);  
router.get('/pending', getPendingRequests);  
router.post('/approve-request', approveConnectionRequest);

export default router;
