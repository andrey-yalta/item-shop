const express = require("express")
const path =require("path")
const app = express()
const homeRoutes = require("./routes/auth")
const mongoose = require("mongoose")
const User = require("./models/user")
const session = require("express-session")
const varMiddlevare = require("./middleware/variables")
const MongoStore = require("connect-mongodb-session")(session)
const MONGODB_URI = "mongodb+srv://Andrey:ItNhQr7tkGwVm7lN@cluster0.g0no9.mongodb.net/items"
const ordersRoutes = require("./routes/orders")
const itemsRoutes = require("./routes/items")




const PORT = process.env.PORT || 8000

// app.listen(PORT, ()=>{
//     console.log(`server is running on port ${PORT}`)
// })

//создаем сессию в бд
const store = new MongoStore({
    collection:'sessions',
    uri:MONGODB_URI
})

// две хуйни чобы читать json из пост запросов
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "some secret value",
    resave:false,
    saveUninitialized: false,
    store
}))


app.use(varMiddlevare)

app.use(express.json())
// две хуйни чобы читать json из пост запросов

// хуйня чтобы пропускало политику корс
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// app.use(async (req,res,next)=>{
//     try{
//         //здесь мы ищем пользователя по id
//         const user = await User.findById("60182ce998481d3e63cfc41f")
//         // если он найден то добавляем его в сессию в реквест
//         req.user = user
//         next()
//     }catch (e) {
//         console.log(e)
//     }})

app.use(homeRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/items", itemsRoutes)

app.get('/', (req,res)=>{
    res.status(200)
    res.sendFile(path.join(__dirname, "views", "index.html"))
})

async function start() {

    try{
        await mongoose.connect(MONGODB_URI, {useNewUrlParser:true,useUnifiedTopology:true, useFindAndModify:false })

        //далее сделаем проверку, если пользователь есть - ничего делать не будем, если его нет - создаем
        // const candidate = await User.findOne()
        //
        // if(!candidate){
        //     const user = new User({
        //         email:"andrey@mail.ru",
        //         name:"Andrey",
        //         cart:{items:[]},
        //     })
        //     await user.save()
        // }

        app.listen(PORT, ()=>{
            console.log(`server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}
start()
