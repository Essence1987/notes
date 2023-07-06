const express = require('express');
const app = express();
const router = express.Router();

router.get('/db/db.json', (req, res) => {

});

router.post('/db/db.json', (req, res) => {

});

const port = 3000;
app.listen(port, () => {
    console.log(`API server is running on port ${port}`);
});