import express from 'express';
import { validateLocaleAndSetLanguage } from 'typescript';
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors());

var data

app.post('/sendLocation', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.sendStatus(400)
        return;
    }
    console.log(req.body)
    data = req.body
    console.log(data)
    console.log(new Date(data.location[0].timestamp).toLocaleTimeString())
    res.sendStatus(200)
})

app.get('/getLocation', (req, res) => {
    res.send(data)
})

app.listen(3000, () => {
    console.log('Listening On Port 3000!')
})
