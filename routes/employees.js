const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, () => console.log('get all'));
router.get('/:id', auth, () => console.log('get one'));
router.post('/add', auth, () => console.log('add new'));
router.post('/remove/:id', auth, () => console.log('remove one'));
router.put('/edit/:id', auth, () => console.log('change one'));

module.exports = router;
