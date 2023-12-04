const thumbnail = require('image-thumbnail');
const path = require('path');
const fs = require('fs');
const dbClient = require('../utils/db');

const fileWorker = async (job) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    throw new Error('Missing fileId');
  }

  if (!userId) {
    throw new Error('Missing userId');
  }

  const collection = dbClient.client.db().collection('files');

  const filter = { _id: ObjectId(fileId), userId };
  const file = await collection.findOne(filter);

  if (!file) {
    throw new Error('File not found');
  }

  const filePath = path.join(__dirname, '..', 'uploads', file.localPath);

  const thumbnail500 = await thumbnail(filePath, { width: 500 });
  const thumbnail250 = await thumbnail(filePath, { width: 250 });
  const thumbnail100 = await thumbnail(filePath, { width: 100 });

  const thumbnail500Path = `${filePath}_500`;
  const thumbnail250Path = `${filePath}_250`;
  const thumbnail100Path = `${filePath}_100`;

  await Promise.all([
    fs.promises.writeFile(thumbnail500Path, thumbnail500),
    fs.promises.writeFile(thumbnail250Path, thumbnail250),
    fs.promises.writeFile(thumbnail100Path, thumbnail100),
  ]);

  console.log('Thumbnails generated for file:', fileId);
};

module.exports = fileWorker;
