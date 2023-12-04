const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const crypto = require('crypto');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const encodedCredentials = authHeader.slice(6);
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const collection = dbClient.client.db().collection('users');

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      const user = await collection.findOne({ email, password: hashedPassword });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      const key = `auth_${token}`;

      await redisClient.set(key, user._id.toString(), 'EX', 24 * 60 * 60);

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const key = `auth_${token}`;
      const result = await redisClient.del(key);

      if (result === 0) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      res.status(204).end();
    } catch (error) {
      console.error('Error signing out:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AuthController;
