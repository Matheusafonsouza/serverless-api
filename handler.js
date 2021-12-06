'use strict';
const AWS = require('aws-sdk');
const { v4 } = require('uuid');

const dynamoDBOfflineOptions = {
  region: 'localhost',
  endpoint: 'http://localhost:8000'
};

const isOffline = () => process.env.IS_OFFLINE;

const dynamoDB = isOffline()
  ? new AWS.DynamoDB.DocumentClient(dynamoDBOfflineOptions)
  : new AWS.DynamoDB.DocumentClient();

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

/**
 * Create a new patient.
 * @return {[object]} JSON response with status code
 */
module.exports.createPatient = async (event) => {
  const body = JSON.parse(event.body);
  const { name, birth_date, email, phone } = body;

  const patient = {
    name,
    birth_date,
    email,
    phone,
    patient_id: v4(),
    created_at: new Date().getTime(),
    updated_at: new Date().getTime()
  }

  try {
    await dynamoDB.put({
      ...params,
      Item: patient
    }).promise();

    return {
      statusCode: 201
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

/**
 * Updates the data from a given patient.
 * @return {[object]} JSON response with status code
 */
module.exports.updatePatient = async (event) => {
  const { patient_id } = event.pathParameters;

  try {
    const body = JSON.parse(event.body);
    const { name, birth_date, email, phone } = body;

    await dynamoDB.update({
      ...params,
      Key: { patient_id },
      UpdateExpression: 'SET name = :name, birth_date = :birth_date, '
        + 'email = :email, phone = :phone, updated_at = :updated_at',
      ConditionExpression: 'attribute_exists(patient_id)',
      ExpressionAttributeNames: {
        ':name': name,
        ':birth_date': birth_date,
        ':email': email,
        ':phone': phone,
        ':updated_at': new Date().getTime()
      }
    }).promise()

    return {
      statusCode: 204
    }
  } catch (err) {
    console.log('Error', err);
    let name = err.name;
    let message = err.message;

    if (name === 'ConditionalCheckFailedException') {
      name = 'Patient does not exists';
      message = `Row with patient_id ${patient_id} does not exists and cannot be updated.`
    }

    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: name || 'Exception',
        message: message || 'Unknown error',
      })
    };
  }
}

/**
 * Deletes a given patient.
 * @return {[object]} JSON response with status code
 */
module.exports.deletePatient = async (event) => {
  const { patient_id } = event.pathParameters;

  try {
    await dynamoDB.delete({
      ...params,
      Key: { patient_id },
      ConditionExpression: 'attribute_exists(patient_id)'
    }).promise();

    return {
      statusCode: 204
    }
  } catch (err) {
    console.log('Error', err);
    let name = err.name;
    let message = err.message;

    if (name === 'ConditionalCheckFailedException') {
      name = 'Patient does not exists';
      message = `Row with patient_id ${patient_id} does not exists and cannot be updated.`
    }

    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: name || 'Exception',
        message: message || 'Unknown error',
      })
    };
  }
}