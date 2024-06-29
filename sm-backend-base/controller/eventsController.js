const eventsModel = require("../models/eventsModel");
const moment = require("moment-timezone");
const { setCache, getCache } = require("../utils/cache");
const axios = require("axios");

/**
 * function to get all the booked events
 * @param {payload.startDate} startDate
 * @param {payload.endDate} endDate
 * @param {requestedTimezone} requestedTimezone
 * @returns {Object} Date wise list of available slots
 */
const getAllEvents = async (payload) => {
  // This is dummy API for the testing part

  console.log("payload data", payload);

  const cacheKey = "demoKey2";
  console.time("redisTime");
  const cachedValue = await getCache(cacheKey);
  console.timeEnd("redisTime");
  if (cachedValue) {
    console.log("cached value", cachedValue);
  } else {
    console.time("redisTimeNew");
    await setCache(cacheKey, Math.floor(1000 + Math.random() * 9000), 10);
    console.timeEnd("redisTimeNew");
  }
  return new Promise(function (resolve, reject) {
    const { skip, limit } = payload;
    const skipNumber = parseInt(skip) || 0;
    const limitNumber = parseInt(limit) || 100;
    let startDate = payload.startDate ? moment(payload.startDate) : moment();
    let endDate = payload.endDate
      ? moment(payload.endDate).add(1, "day")
      : moment().add(7, "days");
    console.time("dbTime");
    return eventsModel
      .getAllEvents(startDate, endDate, { skipNumber, limitNumber })
      .then((events) => {
        console.timeEnd("dbTime");
        return resolve(events);
      })
      .catch((error) => {
        return reject(error, error.statusCode || 500);
      });
  });
};

const executeProxy = async (payload) => {
    const { url, method, headers, params, data, auth } = payload;

    if (!url || !method) {
        throw new Error("URL and method are required");
    }

    try {
        const response = await axios({
            url,
            method,
            headers,
            params,
            data,
            auth
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data);
        } else if (error.request) {
            throw new Error("No response received from the API");
        } else {
            throw new Error(error.message);
        }
    }
};
module.exports = {
  getAllEvents,
  executeProxy
};
