var dataBase=require('../../config/connection')
var mongod=require('mongodb')

exports.addIndex = (req,res)=>{
    const Admin = true;
    dataBase.then(async(db)=>{
        const addedInfo=await db.collection("Categorys").find({}).toArray();
        res.render('admin/addProduct',{ layout: 'layout',Admin,addedInfo})
    })
}

exports.productFind=(req,res)=>{
    const Admin = true;
    let req_id=req.params.id;
    dataBase.then((db)=>{
        db.collection('Categorys').findOne({_id : new mongod.ObjectId(req_id)}).then((result)=>{
            // console.log(result)
            res.render('admin/editProduct',{layout: 'layout',result,Admin})
        })
    }).catch(err=>console.log(err))
}

exports.subIndex=(req,res)=>{
    dataBase.then(async (db)=>{
        const categoryInfo = await db.collection('Categorys').find({}).toArray()
        const subcategoryInfo = await db.collection('subCategorys').aggregate([
            {'$addFields':{"categoryid":{"$toObjectId":"$Parent"}}},
            {
                $lookup:
                {
                    from:'Categorys',
                    localField:'categoryid',
                    foreignField:'_id',
                    as:'newdata'
                }
            },
            {$unwind: "$newdata"}
        ]).toArray()
		console.log(subcategoryInfo)
        res.render('admin/subCategory',{categoryInfo,subcategoryInfo})
    })
}
exports.subcategoryFind=(req,res)=>{
    const Admin = true;
    let req_id=req.params.id
    dataBase.then(async (db)=>{
        const categoryInfo = await db.collection('Categorys').find({}).toArray()
        const updateInfo=await db.collection('subCategorys').findOne({_id : new mongod.ObjectId(req_id)})
        res.render('admin/editsubcategory',{layout: 'layout',Admin,categoryInfo,updateInfo})
    }).catch(err=>console.log(err))
}

exports.commoIndex = (req, res) => {
    const Admin = true;
    dataBase.then(async (db) => {
        const categoryInfo = await db.collection('Categorys').find({}).toArray();
        const subcategoryInfo = await db.collection('subCategorys').find({}).toArray();
        const commodityInfo = await db.collection('Commoditys').aggregate([
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
            },
            {
                '$addFields':{"subcategoryid":{"$toObjectId":"$SubCategory"}}
            },
            {
                $lookup: {
                    from: 'subCategorys',
                    localField: 'subcategoryid', 
                    foreignField: '_id',
                    as: 'subcategory'
                }
            },           
            {
                $unwind: '$subcategory'
            },
        ]).toArray();
        console.log();
        console.log(commodityInfo)
        res.render('admin/commodity', {layout: 'layout',Admin,categoryInfo,commodityInfo,subcategoryInfo});
    });
};

exports.commoFind=(req,res)=>{
    const Admin = true;
    let req_id=req.params.id
    dataBase.then(async (db)=>{
        const categoryInfo = await db.collection('Categorys').find({}).toArray();
        // console.log(categoryInfo)
        const subcategoryInfo = await db.collection('subCategorys').find({}).toArray();
        // console.log(subcategoryInfo)
        const updateInfo=await db.collection('Commoditys').findOne({_id : new mongod.ObjectId(req_id)})
        // console.log(updateInfo);
        res.render('admin/editcommodity',{layout: 'layout',Admin,categoryInfo,subcategoryInfo,updateInfo})
    }).catch(err=>console.log(err))
}


