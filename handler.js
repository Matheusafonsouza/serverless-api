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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
