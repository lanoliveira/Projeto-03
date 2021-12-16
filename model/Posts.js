const MongoClient = require('mongodb').MongoClient;

module.exports = class Post {

    static async search(data) {
        const conn = await MongoClient.connect('mongodb://localhost:27017/dribbble'),
            db = conn.db();
        let result;
        if(data)
            result = await db.collection('users').find({'username': data}).toArray();
        else    
            result = await db.collection('users').find().toArray();

        conn.close();
        return result;
    }

    static async login(data) {
        const conn = await MongoClient.connect('mongodb://localhost:27017/dribbble'),
            db = conn.db();
        let result1, result2;
        let result = {0: true, 1: {} };
        result1 = await db.collection('users').find({'email': data.email}).toArray();
        result2 = await db.collection('users').find({'password': data.password}).toArray();
        if ( result1.length == 0 || result2.length == 0)
            result[0] = false;
        else {
            result[1] = result1;
        }
        conn.close();
        return result;
    }

    static async find_user(data) {
        const conn = await MongoClient.connect('mongodb://localhost:27017/dribbble'),
            db = conn.db();
        let result, result1, result2;

        if (data) {
            result1 = await db.collection('users').find({ 'email': data.email }).toArray();
            result2 = await db.collection('users').find({ 'username': data.username }).toArray();
            result = { 0: result1, 1: result2 };
        }
        else
            result = await db.collection('users').find({}).toArray();
        conn.close();
        return result;
    }

    static async create(new_user) {
        const conn = await MongoClient.connect('mongodb://localhost:27017/dribbble'),
            db = conn.db();
        const a = await this.find_user();
        const b = await this.find_user(new_user);
        let result;
     
        if (a.length == 0) {
            db.collection('users').insertOne({ 'name': new_user.name, 'username': new_user.username, 'email': new_user.email, 'password': new_user.password, 'admin': new_user.admin });
            result = 10;
        } else if (b[0] == 0 && b[1] == 0){
            db.collection('users').insertOne({ 'name': new_user.name, 'username': new_user.username, 'email': new_user.email, 'password': new_user.password, 'admin': new_user.admin });
            result = 10;
        } else if (b[0].length != 0 && b[1].length == 0)
            result = 1;
         else if (b[0].length == 0 && b[1].length != 0)
            result = 2;
         else if (b[0].length != 0 && b[1].length != 0)
            result = 3;
        // conn.close();
        return result;
    }

}