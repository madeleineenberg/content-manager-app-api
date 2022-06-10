const express = require('express');
const app = express();

const PORT = 3001;
const fs = require('fs');
const path = require('path');
const pathToFile = path.resolve('./data.json');
const cors = require('cors');

app.use(express.json());

// let corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));

const getResources = () => JSON.parse(fs.readFileSync(pathToFile));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/api/resources/:id', (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const resource = resources.find((resource) => resource.id === id);
  console.log(resource);
  res.send(resource);
});

app.get('/api/resources', (req, res) => {
  const resources = getResources();
  res.send(resources);
});

app.post('/api/resources', (req, res) => {
  const resources = getResources();
  const resource = req.body;

  resource.createdAt = new Date();
  resource.status = 'inactive';
  resource.id = Date.now().toString();
  resources.unshift(resource);

  console.log(resources);
  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res.status(422).send('Cannot store data in the file!');
    }

    return res.send('Data has been saved');
  });
});

app.listen(PORT, () => {
  console.log('server is listeningen on port:' + PORT);
});
