const UserSchema = new mongoose.Schema({
    name:String,
    age:Number,
    saveDate:{
        type:Date,
        default:Date.now
    }
})