'use strict';
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const params = { TableName: 'patient' };

/**
 * List all the patients for this application.
 * @return {[object]} A JSON response with 200 status code and all the patients
 */
module.exports.listPatients = async (event) => {
  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.name || 'Exception',
        message: err.message || 'Unknown error',
      })
    }
  }
};

/**
 * Get a patient for a given id.
 * @return {[object]} A JSON response with 200 status code and the patient
 */
module.exports.getPatient = async (event) => {
  try {
    const { patient_id } = event.pathParameters;

    const { Item } = await dynamoDB.get({
      ...params,
      Key: { patient_id }
    }).promise()

    if (!Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Patient does not exists.' }, null, 2)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(Item, null, 2)
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.name || 'Exception',
        message: err.message || 'Unknown error',
      })
    };
  }
};
