var express = require("express");
var router = express.Router();
var controller = require("./controller");
var dataBase = require("../../config/connection");
var mongod = require("mongodb");
var bcrypt = require("bcrypt");

router.get("/", controller.userIndex);

router.get('/faq',controller.userfaq)

router.get("/singleproduct/:id", controller.findProduct);

router.get("/allcategory/:id", controller.allProduct);

router.get("/register", controller.register);

router.post("/register", (req, res) => {
  let info = {
    user: req.body.name,
    email: req.body.email,
    password: req.body.pass,
    status: 1,
  };
  dataBase
    .then((db) => {
      bcrypt.hash(req.body.pass, 10).then((pwd) => {
        info.password = pwd;

        db.collection("register")
          .insertOne(info)
          .then((result) => {
            // console.log("result", result);
          });
      });
    })
    .catch((err) => console.log(err));
  res.redirect("/login");
});

router.get("/login", controller.login);

router.post("/login", (req, res) => {
  let detail = {
    Email: req.body.email,
    Password: req.body.pass,
  };

  if (!detail.Email || !detail.Password) {
    
    const msg = "You must fill in both the email and password fields.";
    return res.render("user/login", { msg });
  }

  dataBase.then((db) => {
    db.collection("register")
      .findOne({ email: detail.Email })
      .then((result) => {
        let user = result;
        if (user) { 
          bcrypt.compare(detail.Password, user.password).then((pass) => {
            if (pass) {
              if (user.status == 0) {
                req.session.user = user;
                res.redirect("/admin");
              } else {
                req.session.user = user;
                res.redirect("/");
              }
            } else {
              const err = "Invalid credentials";
              res.render("user/login", { err });
            }
          });
        } else {
         
          const err = "No user with that email exists.";
          res.render("user/login", { err });
        }
      });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// router.get("/card/:id", controller.cart);

router.get("/card/:id",(req, res) => {
    const Admin = false;
    if (req.session.user) {
        var login=true;
        let reg=req.session.user
        dataBase.then(async (db) => {
            const cartItem = {
                user_id: req.session.user._id,
                commodity_id: req.params.id,
                status:1
            };
            const cartinfo=await db.collection('cart').insertOne(cartItem);
            res.redirect('/');
        });
    } else {
        res.redirect('/login');
    }
})

router.get("/cart",controller.carts)

router.get("/cart/:id",(req,res)=>{
  const req_id=req.params.id;
  console.log(req_id)
  dataBase.then((db)=>{
      db.collection('cart').deleteOne({_id : new mongod.ObjectId(req_id)}).then((result)=>{
          // console.log('deleted')
      })
  }).catch(err=>console.log(err))
  res.redirect("/cart")
})

router.get('/order',(req,res)=>{
  const Admin = false;
    let reg=req.session.user
    if (req.session.user) {
      var login=true;
      dataBase.then(async (db) => {
        const user =await db.collection('cart').aggregate([
        {
            $match: {
            user_id: req.session.user._id,
            status:0
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
        // console.log(user);
        const Status = user.every(item => item.status === 1);
        res.render('user/order',{user,layout: 'layout',Admin,login,reg,Status})
    })
    }else {
      res.redirect('/login');
    }  
})

router.post("/cart",(req,res)=>{
  const Admin = false;
  let reg=req.session.user
  if (req.session.user) {
    var login=true;
    dataBase.then(async(db)=>{
      var item=await db.collection('cart').updateMany({user_id:req.session.user._id},{$set:{status:0}})
      var fin = await db.collection("cart").find({ user_id: req.session.user._id }).toArray();
      console.log(fin);
      res.render("user/user",{ layout: 'layout', Admin,login,reg,fin})
    }).catch(err=>console.log(err))
  }
})



module.exports = router;
