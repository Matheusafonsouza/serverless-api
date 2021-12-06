'use-strict';
const { fake } = require('faker/locale/pt_BR');
const faker = require('faker/locale/pt_BR');
const fs = require('fs');
const path = require('path');

const MAX_ITEMS = 100;

const fixtureFile = path.normalize(
  path.join(__dirname, '..', 'migrations', 'patients-seed.json')
);

const callback = err => {
  if (err) throw err;
  console.log(`Seed generated in "${fixtureFile}"`);
};

let patients = [];

for (let i = 0; i < MAX_ITEMS; i++) {
  const name = faker.name.findName();
  const data = {
    patient_id: faker.datatype.uuid(),
    birth_date: faker.date.between('1900-01-01', '2020-01-01'),
    name: name,
    email: name.replace(/[^A-Za-z0-9]+/, '_').toLowerCase() + '@email.com',
    phone: faker.phone.phoneNumberFormat(1),
    status: true
  };

  patients.push(data);
  console.log(data);
};

fs.writeFile(fixtureFile, JSON.stringify(patients), 'utf8', callback);