const {Router} = require('express')
const router = Router()
const Item = require("../models/items")
const auth = require("../middleware/auth")

router.post("/add",auth, async (req,res)=>{
    //добавление товара
    console.log(req.body.name, req.body.price,req.body.imageUrl, req.body.category)
    const course = new Item({
        name:req.body.name,
        price:req.body.price,
        img: req.body.imageUrl,
        category:req.body.category,
        userId: req.user
    })

    try{
        await course.save()
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
    }

})

router.get("/", async (req,res)=>{
    //получение товаров
    const items = await Item.find()
    res.send(items)
})



//редактирование отдельного курса
// пост завпрос на редактирование формы
router.post("/edit",auth, async (req,res)=>{
    //изменение товара
    console.log(req.body)
    const {id} = req.body
    delete req.body.id
    await Item.findByIdAndUpdate(id, req.body)

    res.sendStatus(200)
})


router.post("/remove",auth, async(req, res)=>{
    //удаление товара
    try{
        await Item.deleteOne({_id: req.body.id})
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
    }
})


module.exports = router