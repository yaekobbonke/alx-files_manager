const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const { fileQueue } = require('../utils/queue');
const thumbnail = require('image-thumbnail');

class FilesController {
  static async getShow(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const file = await collection.findOne(filter);

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file);
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      const collection = dbClient.client.db().collection('files');

      const files = await collection.find().toArray();

      res.json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putPublish(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const update = { $set: { isPublic: true } };
      const file = await collection.findOneAndUpdate(filter, update);

      if (!file.value) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file.value);
    } catch (error) {
      console.error('Error publishing file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putUnpublish(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const update = { $set: { isPublic: false } };
      const file = await collection.findOneAndUpdate(filter, update);

      if (!file.value) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file.value);
    } catch (error) {
      console.error('Error unpublishing file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async postUpload(req, res) {
    const { name, type, isPublic, data } = req.body;

    if (!name || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const collection = dbClient.client.db().collection('files');

      const file = {
        name,
        type,
        isPublic: Boolean(isPublic),
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(file);
      file._id = result.insertedId;

      // Add job to fileQueue for thumbnail generation
      const { _id: fileId, userId } = file;
      fileQueue.add({ fileId, userId });

      res.status(201).json(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getFile(req, res) {
    const fileId = req.params.id;
    const { size } = req.query;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const file = await collection.findOne(filter);

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (!file.isPublic) {
        const token = req.headers['x-token'];
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userCollection = dbClient.client.db().collection('users');
        const user = await userCollection.findOne({ token });

        if (!user || (file.userId !== user._id.toString())) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }

      const filePath = path.join(__dirname, '..', 'uploads', file.localPath);

      if (!fsSure! Here's an updated version of the `FilesController.js` file that includes the changes you requested:

```javascript
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const { fileQueue } = require('../utils/queue');
const thumbnail = require('image-thumbnail');

class FilesController {
  static async getShow(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const file = await collection.findOne(filter);

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file);
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      const collection = dbClient.client.db().collection('files');

      const files = await collection.find().toArray();

      res.json(files);
    } catch (error) {
      console.error('Error retrieving files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putPublish(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const update = { $set: { isPublic: true } };
      const file = await collection.findOneAndUpdate(filter, update);

      if (!file.value) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file.value);
    } catch (error) {
      console.error('Error publishing file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putUnpublish(req, res) {
    const fileId = req.params.id;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const update = { $set: { isPublic: false } };
      const file = await collection.findOneAndUpdate(filter, update);

      if (!file.value) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(file.value);
    } catch (error) {
      console.error('Error unpublishing file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async postUpload(req, res) {
    const { name, type, isPublic, data } = req.body;

    if (!name || !type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const collection = dbClient.client.db().collection('files');

      const file = {
        name,
        type,
        isPublic: Boolean(isPublic),
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(file);
      file._id = result.insertedId;

      // Add job to fileQueue for thumbnail generation
      const { _id: fileId, userId } = file;
      fileQueue.add({ fileId, userId });

      res.status(201).json(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getFile(req, res) {
    const fileId = req.params.id;
    const { size } = req.query;

    try {
      const collection = dbClient.client.db().collection('files');

      const filter = { _id: ObjectId(fileId) };
      const file = await collection.findOne(filter);

      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (!file.isPublic) {
        const token = req.headers['x-token'];
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userCollection = dbClient.client.db().collection('users');
        const user = await userCollection.findOne({ token });

        if (!user || (file.userId !== user._id.toString())) {
          return res.status(403).json({ error: 'Forbidden' });
        }
      }

      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }

      const filePath = path.join(__dirname, '..', 'uploads', file.localPath);

      if (!fs.existsSync(filePath)) {
        return res.status
