var express = require('express');
var router = express.Router()
var controller = require('./controller')
var dataBase=require('../../config/connection')
var mongod=require('mongodb')

router.get('/',(req,res)=>{
    const Admin = true;
    res.render('admin/admin',{ layout: 'layout',Admin })
})

router.get('/addProduct',controller.addIndex)

router.post('/addProduct',(req,res)=>{
    let details={
        Category:req.body.category,
        Description:req.body.desp,
        ImageAdd:req.files.image.name
    }
    dataBase.then((db)=>{
        db.collection("Categorys").insertOne(details).then((result)=>{
            const fileupload=req.files.image
            fileupload.mv("./public/images/" + details.ImageAdd).then((data)=>{
                // console.log(data)
            })
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/addProduct")
})

router.get('/faq',(req,res)=>{
    const Admin = true;
    res.render('admin/faq',{ layout: 'layout',Admin })
})

router.get('/addProduct/:id',(req,res)=>{
    const req_id=req.params.id;
    dataBase.then((db)=>{
        db.collection('Categorys').deleteOne({_id : new mongod.ObjectId(req_id)}).then((result)=>{
            // console.log('deleted')
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/addProduct")
})

router.get('/editProduct/:id',controller.productFind)

router.post('/editProduct/:id',(req,res)=>{
    let req_id=req.params.id;
    let details={
        Category:req.body.category,
        Description:req.body.desp,
        ImageAdd:req.files?.image.name
    }
    let info='';
    if(req.files?.image){
        info={
            Category:details.Category,
            Description:details.Description,
            ImageAdd:details.ImageAdd
        }
        let fileupload=req.files.image
        fileupload.mv("./public/images/" +details.ImageAdd)
    }
    else{
        info={
            Category:details.Category,
            Description:details.Description
        }
    }
    dataBase.then((db)=>{
        db.collection("Categorys").updateOne({_id : new mongod.ObjectId(req_id)},{$set:info}).then((result)=>{
            // console.log("hai")    
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/addProduct")
})

router.get('/subCategory',controller.subIndex)

router.post('/subCategory',(req,res)=>{
    let detail = {
        Parent:req.body.parent,
        SubCategory:req.body.subcat
    }
       dataBase.then((db)=>{
        db.collection('subCategorys').insertOne(detail).then((result)=>{
           // console.log("result",result);
        })
    }).catch(err=>console.log(err))
    res.redirect('/admin/subCategory')
})

router.get('/subCategory/:id',(req,res)=>{
    const req_id=req.params.id;
    dataBase.then((db)=>{
        db.collection('subCategorys').deleteOne({_id : new mongod.ObjectId(req_id)}).then((result)=>{
            console.log('deleted')
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/subCategory")
})

router.get('/editsubcategory/:id',controller.subcategoryFind)

router.post('/editsubcategory/:id',(req,res)=>{
    let req_id=req.params.id;
    let detai={
        parent:req.body.parent,
        SubCategory:req.body.subcat
    }
    dataBase.then((db)=>{
        db.collection('subCategorys').updateOne({_id : new mongod.ObjectId(req_id)},{$set:detai}).then((result)=>{
           // console.log("result",result);
        })
    }).catch(err=>console.log(err))
    res.redirect('/admin/subCategory')
})

router.get('/commodity',controller.commoIndex)

router.post('/commodity',(req,res)=>{
    let inform = {
        Categories:req.body.categories,
        SubCategory:req.body.subcategory,
        Product:req.body.prod,
        Quantity:req.body.quantity,
        Price:req.body.price,
        Description:req.body.desc,
        Imagenew:req.files.imag.name
    }
       dataBase.then((db)=>{
        db.collection('Commoditys').insertOne(inform).then((result)=>{
            const uploadfile=req.files.imag
            uploadfile.mv("./public/images/" + inform.Imagenew).then((data)=>{
                // console.log(data)
            })
        })
    }).catch(err=>console.log(err))
    res.redirect('/admin/commodity')
})

router.get('/commodity/:id',(req,res)=>{
    const req_id=req.params.id;
    dataBase.then((db)=>{
        db.collection('Commoditys').deleteOne({_id : new mongod.ObjectId(req_id)}).then((result)=>{
            // console.log('deleted')
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/commodity")
})

router.get('/editcommodity/:id',controller.commoFind)

router.post('/editcommodity/:id',(req,res)=>{
    let req_id=req.params.id;
    let details={
        Categories:req.body.categories,
        SubCategory:req.body.subcategory,
        Product:req.body.prod,
        Quantity:req.body.quantity,
        Price:req.body.price,
        Description:req.body.desc,
        Imagenew:req.files?.imag.name
    }
    let info='';
    if(req.files?.imag){
        info={
            Categories:details.Categories,
            SubCategory:details.SubCategory,
            Product:details.Product,
            Quantity:details.Quantity,
            Price:details.Price,
            Description:details.Description,
            Imagenew:details.Imagenew
        }
        let fileupload=req.files.imag
        fileupload.mv("./public/images/" +details.Imagenew)
    }
    else{
        info={
            Categories:details.Categories,
            SubCategory:details.SubCategory,
            Product:details.Product,
            Quantity:details.Quantity,
            Price:details.Price,
            Description:details.Description
        }
    }
    dataBase.then((db)=>{
        db.collection("Commoditys").updateOne({_id : new mongod.ObjectId(req_id)},{$set:info}).then((result)=>{
            // console.log("hai")    
        })
    }).catch(err=>console.log(err))
    res.redirect("/admin/commodity")
})

module.exports=router

