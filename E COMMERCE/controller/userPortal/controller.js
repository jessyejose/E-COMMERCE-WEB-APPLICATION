var dataBase=require('../../config/connection')
var mongod=require('mongodb')

exports.userIndex =(req,res)=>{
    if (req.session.user) {
        var login=true;   
        var reg=req.session.user;
        const Admin = false;
        dataBase.then(async (db) => {
            const categoryInfo = await db.collection('Categorys').find({}).toArray();
            const commodityInfo = await db.collection('Commoditys').find({}).toArray();
            res.render('user/user',{ layout: 'layout',Admin,commodityInfo,categoryInfo,login,reg})
        })
    }else {
        res.redirect('/login');
    }
}

exports.userfaq=(req,res)=>{
    if (req.session.user) {
        var login=true;   
        var reg=req.session.user;
        const Admin = false;
        res.render('user/fq',{ layout: 'layout',Admin,login,reg})
    }else {
        res.redirect('/login');
    }
}

exports.findProduct = (req, res) => {
    if (req.session.user) {
        var login=true;
        const Admin = false;
        var reg=req.session.user;
        let req_id=req.params.id
        dataBase.then(async (db)=>{
            const updateInfo=await db.collection('Commoditys').findOne({_id : new mongod.ObjectId(req_id)})
            res.render('user/singleproduct',{layout: 'layout',Admin,updateInfo,login,reg})
        }).catch(err=>console.log(err))
    }
    else {
        res.redirect('/login');
    }
};

exports.allProduct = (req, res) => {
    if (req.session.user) {
        var login=true;
        const Admin = false;
        let req_id = req.params.id;
        var reg=req.session.user;
        // console.log(req_id)
        dataBase.then(async (db) => {
            const updateInfo = await db.collection('Categorys').findOne({ _id: new mongod.ObjectId(req_id) });
            const commodityInfo = await db.collection('Commoditys').aggregate([
                {
                    $match: { Categories: req_id }
                },
                {
                    '$addFields':{"categoryid":{"$toObjectId":"$Categories"}}
                },
                {
                    $lookup: {
                        from: 'Categorys',
                        localField: 'categoryid',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                }
            ]).toArray();
            // console.log(commodityInfo)
            res.render('user/allcategory', { layout: 'layout', Admin, commodityInfo, updateInfo,reg,login });
        }).catch(err => console.log(err));
    }else {
        res.redirect('/login');
    }
}

exports.register = (req, res) => {
    const Admin = false
    if (req.session.user) {
        var login=true;
    }
    var reg=req.session.user;
    dataBase.then(async (db) => {
        res.render('user/register',{ layout: 'layout', Admin,login,reg})
    })
}

exports.login = (req, res) => {
    const Admin = false;
    let reg=req.session.user
    if (req.session.user) {
        var login=true;
    }
    dataBase.then(async (db) => {
        res.render('user/login',{ layout: 'layout', Admin,login,reg})
    })
}

// exports.cart = (req, res) => {
//     const Admin = false;
//     if (req.session.user) {
//         var login=true;
//         let reg=req.session.user
//         dataBase.then(async (db) => {
//             const cartItem = {
//                 user_id: req.session.user._id,
//                 commodity_id: req.params.id,
//                 status:1
//             };
//             const cartinfo=await db.collection('cart').insertOne(cartItem);
//             res.redirect('/');
//         });
//     } else {
//         res.redirect('/login');
//     }
// }

exports.carts = (req, res) => {
    const Admin = false;
    let reg=req.session.user
    if (req.session.user) {
        var login=true;
        dataBase.then(async (db) => {
            const user =await db.collection('cart').aggregate([
            {
                $match: {
                user_id: req.session.user._id,
                status:1
                },
            },
            {
                '$addFields':{"commodityid":{"$toObjectId":"$commodity_id"}}
            },
            {
                $lookup: {
                from: 'Commoditys', 
                localField: 'commodityid',
                foreignField: '_id',
                as: 'commoditydata',
                },
            },
            {
                $unwind: '$commoditydata'
            }
            ]).toArray()

            // let Status = true;
            // for (let i = 0; i < user.length; i++) {
            //     if (user[i].status !== 0) {
            //         Status = false;
            //         break; 
            //     }
            // }
            const Status = user.every(item => item.status === 0);

            // console.log(user);
            res.render('user/cart',{user,layout: 'layout',Admin,login,reg,Status})

        })  
    }else {
        res.redirect('/login');
    }
}




























