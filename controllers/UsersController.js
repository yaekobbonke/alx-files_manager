<<<<<<< HEAD
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    // ... existing code ...

    const newUser = {
      email,
      password: hashedPassword,
    };

    try {
      const collection = dbClient.client.db().collection('users');

      const result = await collection.insertOne(newUser);

      const { _id } = result.ops[0];

      res.status(201).json({ email, _id });
    } catch (error) {
      console.error('Error creating new user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const key = `auth_${token}`;
      const userId = await redisClient.get(key);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const collection = dbClient.client.db().collection('users');
      const user = await collection.findOne({ _id: ObjectId(userId) }, { projection: { email: 1, _id: 1 } });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
=======
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
>>>>>>> d738f0520d292e9e2d31f6adbda65e6317c1c82c
