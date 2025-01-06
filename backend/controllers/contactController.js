import User from '../models/User.js';

// Get user's contacts
export const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('contacts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Add a contact
export const addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;

    // Check if contact exists
    const contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Add contact to user's contact list
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { contacts: contactId } },
      { new: true }
    );

    res.status(200).json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ message: 'Error adding contact', error: error.message });
  }
};

// Remove a contact
export const removeContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;

    // Remove contact from user's contact list
    await User.findByIdAndUpdate(
      userId,
      { $pull: { contacts: contactId } },
      { new: true }
    );

    res.status(200).json({ message: 'Contact removed successfully' });
  } catch (error) {
    console.error('Error removing contact:', error);
    res.status(500).json({ message: 'Error removing contact', error: error.message });
  }
};
