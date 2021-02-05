const {Router} = require('express')
const Order = require("../models/order")
const router = Router()
const auth = require("../middleware/auth")


// router.get("/", async (req,res)=>{
//     res.render("orders", {
//         isOrder: true,
//         title: "заказы",
//     })
// })

router.post("/",auth, async (req,res)=>{
    // const user = await req.user
        // .populate("cart.items.courseId")
        // .execPopulate()
    // const courses = user.cart.items.map(u=>({
    //     count: i.count,
    //     course: {...i.courseId._doc}
    //
    // }))
    const courseItems =req.body.orderList
    const price = req.body.price

    const courses = req.body.orderList.map(u=>({

        item:u
    }))
    console.log(req.session.user.name)
    const order = new Order({
        user:{
            name:req.session.user.name,
            userId:req.session.user._id
        },
        courses:courses,
        price:price

    })
    await order.save()
    res.sendStatus(200)

    // res.redirect('/orders')
})

router.get("/",auth, async (req,res)=>{
    try {
        console.log(req.session.user._id)
        const orders = await Order.find({
            'user.userId': req.session.user._id

        })
            .populate('user.userId')
        res.send(orders)

        // res.render("orders", {
        //     isOrder: true,
        //     title: "заказы",
        //     orders: orders.map(o=>{
        //         return{
        //             ...o._doc,
        //             price:o.courses.reduce((total, c)=>{
        //                 return total +=c.count * c.course.price
        //             },0)
        //
        //         }
        //     })
        //
        // })
    }
    catch (e) {
        console.log(e)
    }

})

router.post("/remove",auth, async(req, res)=>{
    try{
        await Order.deleteOne({_id: req.body.removeId})
        res.sendStatus(200)
    }
    catch (e) {
        console.log(e)
    }


})

module.exports = router
