'use strict';
const patients = [
  { id: 1, name: 'Maria', birthDate: '1984-11-01' },
  { id: 2, name: 'Joao', birthDate: '1980-01-16' },
  { id: 3, name: 'Jose', birthDate: '1998-06-06' },
];

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
