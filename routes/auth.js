const {Router} = require("express")
const Item = require("../models/items")
const router = Router()
const User =require("../models/user")
const path =require("path")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")

router.get("/api", (req,res)=>{
    res.sendFile(path.join(__dirname, "../","views", "index.html"))
})

router.post("/api/auth/login", async(req,res)=>{
    try {
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            const isSame = await bcrypt.compare(password, candidate.password)
            if(isSame){
                req.session.user =candidate
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if(err){
                        throw (err)
                    }
                    res.sendStatus(200)
                })

            }else {
                res.send("Bad password")
            }
        }else {
            res.send("User not found")
        }

    }catch (e) {
        console.log(e)
    }

})




router.get("/api/auth/logout",  async(req,res)=>{
    req.session.destroy(()=>{
        res.sendStatus(200)
    })

})

router.get("/api/auth/me", auth, async(req,res)=>{
    const user = req.session.user
    console.log(user)
    res.send(user)

})


router.post("/api/auth/register", async (req,res)=>{
    try {
        const {email, password, repeat, name} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            res.sendStatus(208)
        }else{
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email,name, password: hashPassword, cart:{items:[]}

            })
            await user.save()
            res.sendStatus(201)
        }
    }
    catch (e) {
        console.log(e)
    }
})
module.exports = router

// router.post("/api/add", async (req,res)=>{
//     console.log(req.body.name, req.body.price,req.body.imageUrl, req.body.category)
//
//     const course = new Item({
//         name:req.body.name,
//         price:req.body.price,
//         img: req.body.imageUrl,
//         category:req.body.category,
//         userId: req.user
//     })
//
//     try{
//         await course.save()
//         res.sendStatus(200)
//     }
//     catch (e) {
//         console.log(e)
//     }
//
// })
// router.get("/api/items", async (req,res)=>{
//     const items = await Item.find()
//     res.send(items)
// })



//редактирование отдельного курса
// пост завпрос на редактирование формы
// router.post("/api/edit", async (req,res)=>{
//     console.log(req.body)
//     const {id} = req.body
//     delete req.body.id
//     await Item.findByIdAndUpdate(id, req.body)
//
//     res.sendStatus(200)
// })
//
//
// router.post("/api/remove", async(req, res)=>{
//     try{
//         await Item.deleteOne({_id: req.body.id})
//         res.sendStatus(200)
//     }
//     catch (e) {
//         console.log(e)
//     }
// })






