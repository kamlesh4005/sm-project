const express = require('express');
const router = express.Router();
const {validationResult } = require('express-validator');
const apiHandler = require("./apiHandler").apiHandler;
const eventsController = require("../controller/eventsController");
const routerUtil = require("../utils/routerUtil");

router.get('/free-slots', routerUtil.validateFreeSlotAPI(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { startDate, endDate, timezone } = req.query;
    apiHandler(req, res, eventsController.getFreeSlots(startDate, endDate, timezone))
})

router.post('/events',/* routerUtil.validateEventsAPI(),*/ async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    // const { title, startTime, timezone } = req.body;
    // apiHandler(req, res, eventsController.createEvent({ title, startTime, timezone }))
    console.log("Came here ....")
    apiHandler(req, res, eventsController.executeProxy(req.body))
})



router.get('/events', async (req, res) => {
    // consider timezone here
    apiHandler(req, res, eventsController.getAllEvents(req.query))
})

router.post('/proxy', async (req, res) => {
    apiHandler(req, res, eventsController.executeProxy(req.body))
})

module.exports = router;