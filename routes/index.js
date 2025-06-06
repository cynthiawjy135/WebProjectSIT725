const express = require('express');
const router = express.Router();

const usersRouter = require('./userRoutes');

const pageRouter = require('./pageRoutes');


const giftRouter = require('./giftRoutes');

const postRouter = require('./postRoutes');
const secretAngelRouter = require('./secretAngelRoutes');
const eventReminderRouter = require('./eventReminderRoutes');


//Quiz Admin Dashboard Routes
const quizAdminRoutes = require('./quizAdminRoutes');

router.use('/', pageRouter);

router.use('/api/users', usersRouter);


router.use('/gifts', giftRouter); // This enables `/gifts`, `/gifts/add`, etc.

router.use('/api/posts', postRouter);
router.use('/api/secretAngel', secretAngelRouter);
router.use('/api/eventReminder', eventReminderRouter);


router.use('/', quizAdminRoutes);

module.exports = router;
