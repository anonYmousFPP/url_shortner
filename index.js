const express = require('express')
const app = express();
const ejs = require('ejs');
const path = require('path')
const cookieParser = require('cookie-parser')

const URL = require('./models/url')
const urlRoute = require('./routes/url')
const staticRouter = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const {connectToMongoDb} = require('./db')
const {restrictToLoggedInUserOnly, checkAuth} = require('./middleware/auth')


connectToMongoDb('mongodb://localhost:27017/short-url')
.then(() => console.log('MongoDb Connected'))


app.set('view engine', 'ejs')   //sets the view engine for your Express application to EJS (Embedded JavaScript)
app.set('views', path.resolve('./views'))  //sets the 'views' setting for your Express application to the absolute path of the 'views' directory 


app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/url', restrictToLoggedInUserOnly, urlRoute);
app.use('/user', userRoute)
app.use('/', checkAuth, staticRouter); 


app.get('/test', async(req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})


app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push: {
            visitHistry: {
                timestamp: new Date(),
            },
        },
    }
);

res.redirect(entry.redirectURL);
});

app.listen(3000);