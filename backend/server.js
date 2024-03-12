import express from 'express';
const app = express();

app.get('/test', (req, res) => {
    res.json({ 'data': ['1', '2', '3']});
});

app.listen(5000, () => console.log('Server started on port 5000'));
