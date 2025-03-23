import express from 'express';
import {
  sendConnectionRequest,
  unsendConnectionRequest, 
  updateConnectionStatus,
  getConnections,
  getPendingRequests
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/request', sendConnectionRequest); 
router.delete('/unsend', unsendConnectionRequest);
router.put('/status', updateConnectionStatus);
router.get('/', getConnections);  
router.get('/pending', getPendingRequests);  

export default router;
