'use strict';
const AWS = require('aws-sdk');

const patients = [
  { id: 1, name: 'Maria', birthDate: '1984-11-01' },
  { id: 2, name: 'Joao', birthDate: '1980-01-16' },
  { id: 3, name: 'Jose', birthDate: '1998-06-06' },
];

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
      body: JSON.stringify(data)
    };
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

/**
 * Get a patient for a given id.
 * @return {[object]} A JSON response with 200 status code and the patient
 */
module.exports.getPatient = async (event) => {
  const { id } = event.pathParameters;
  const patient = patients.find(patient => patient.id == id)

  if (!patient) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Patient does not exists.'
      }, null, 2),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      patient
    }, null, 2),
  };
};
