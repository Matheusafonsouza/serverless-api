'use strict';
const patients = [
  { id: 1, name: 'Maria', birthDate: '1984-11-01' },
  { id: 2, name: 'Joao', birthDate: '1980-01-16' },
  { id: 3, name: 'Jose', birthDate: '1998-06-06' },
];

/**
 * List all the patients for this application.
 * @return {[object]} A JSON response with 200 status code and all the patients
 */
module.exports.listPatients = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        patients
      },
      null,
      2
    ),
  };
};

/**
 * Get a patient for a given id.
 * @return {[object]} A JSON response with 200 status code and the patient
 */
module.exports.getPatient = async (event) => {
  const { id } = event.pathParameters;
  const patient = patients.find(patient => patient.id == id)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        patient
      },
      null,
      2
    ),
  };
};
