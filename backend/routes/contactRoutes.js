import express from 'express';
import { 
  getContacts,
  addContact,
  removeContact
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's contacts
router.get('/', protect, getContacts);

// Add a contact
router.post('/', protect, addContact);

// Remove a contact
router.delete('/', protect, removeContact);

export default router;
