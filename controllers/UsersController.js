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
