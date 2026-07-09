const express = require('express');
const router = express.Router();

const contactReasonController = require('../controllers/contactReasonController');


router.get('/', contactReasonController.getAllContactReasons);

router.get('/:id', contactReasonController.getContactReasonById);

router.post('/', contactReasonController.createContactReason);

router.put('/:id', contactReasonController.updateContactReason);

router.delete('/:id', contactReasonController.deleteContactReason);

module.exports = router;