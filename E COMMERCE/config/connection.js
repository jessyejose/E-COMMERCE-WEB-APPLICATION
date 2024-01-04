var MongoClient=require("mongodb").MongoClient
var client=new MongoClient('mongodb://0.0.0.0:27017/')

function dbconnect(){
    return client.connect().then((db)=>{
        let db_data = db.db('WorldOfFashion')
        return db_data;
        }).catch(err=>{
            console.log(err)
        })
}

module.exports = dbconnect()