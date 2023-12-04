const dbClient = require('../utils/db');
const sha1 = require('sha1');

const UsersController = {
  postNew: async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists in DB
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user object
    const newUser = {
      email,
      password: hashedPassword
    };

    // Save the new user to the users collection
    const result = await dbClient.db.collection('users').insertOne(newUser);

    // Return the new user with only the email and id
    res.status(201).json({ email: result.ops[0].email, id: result.insertedId });
  }
};

module.exports = UsersController;