const express = require('express');
<<<<<<< HEAD
=======
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');


>>>>>>> d738f0520d292e9e2d31f6adbda65e6317c1c82c
const router = express.Router();

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
<<<<<<< HEAD
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', FilesController.postUpload);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile);
=======
>>>>>>> d738f0520d292e9e2d31f6adbda65e6317c1c82c

module.exports = router;
