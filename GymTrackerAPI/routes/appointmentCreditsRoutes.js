import express from 'express';
import appointmentCreditsController from '../controllers/appointmentCreditsController.js';

const router = express.Router();

router.get('/:profileId', appointmentCreditsController.getAppointmentCredits);

export default router;

