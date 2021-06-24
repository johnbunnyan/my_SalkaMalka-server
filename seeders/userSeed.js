//seeding
const me = new User({
    name:"Mike",
    age:27,
})

me.save()
.then(()=>{
    console.log(me)
})
.catch((err)=>{
    console.log("Error: "+ err)
})