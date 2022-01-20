//MAIN BACKEND FILE 

const db=require("./database");
const express=require("express");
const mongoose = require('mongodb');
const { MongoClient } = require('mongodb');
// console.log(db.books);
// console.log(db.authors);
// console.log(db.publications);

const app=express();
app.use(express.json());


const uri ="mongodb+srv://saijagruthi:<Himeshreddy24>@cluster0.83au4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bcollection = client.db("book-company").collection("books").findOne({ISBN:"12345Three"});
  bcollection.then((data)=>console.log(data)).catch((err)=>console.log(err));
});

// async function listDatabases(client){
//     databasesList=await client.db().admin().listDatabases();
//     console.log("THE DATABASES ARE:");
//     databasesList.databases.forEach(db=>console.log(db.name));
// }

// async function main(){
//     const uri = "mongodb+srv://saijagruthi:<Himeshreddy24>@cluster0.83au4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     try{
//         await client.connect();
//         const result=await client.db("book-company").collection("books").findOne({ISBN:"12345Three"});
//         console.log(result);
//         //await listDatabases(client);
//     }
//     catch(err){
//         console.log(err);
//     }
//     finally{
//         await client.close();
//     }
// }
// main();


//GET APIS 
app.get("/",(req,res) => {
    return res.json({"WELCOME":`to my Backend Software for the Book Company`});
});

app.get("/books",(req,res) => {
    const getAllBooks=db.books;
    return res.json(getAllBooks);
})

app.get("/book-isbn/:isbn",(req,res) => {
    const {isbn}=req.params;
    const getSpecificBook=db.books.filter((book)=>book.ISBN===isbn);
    if(getSpecificBook.length===0){
        return res.json({"error":`No Book found for found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook[0]);
});

app.get("/book-category/:category",(req,res) => {
    const {category}=req.params;
    const getSpecificBook=db.books.filter((book)=>book.category.includes(category));
    if(getSpecificBook.length===0){
        return res.json({"error":`No Book found for found for the category of ${category}`});
    }
    return res.json(getSpecificBook);
});

app.get("/authors",(req,res) => {
    const getAllAuthors=db.authors;
    return res.json(getAllAuthors);
});

app.get("/author-id/:id",(req,res) => {
    let {id}=req.params;
    id=Number(id);
    const getSpecificAuthor=db.authors.filter((author)=>author.id===id);
    if(getSpecificAuthor.length===0){
        return res.json({"error":`No Book found for found for the id of ${isbn}`});
    }
    return res.json(getSpecificAuthor[0]);
});
//author-isbn
app.get("/publications",(req,res) => {
    const getAllPublications=db.publications;
    return res.json(getAllPublications);
});
//publication-isbn


// POST APIS
app.post("/book",(req,res) => {
    //const {newBook}=req.body;
    db.books.push(req.body);
    return res.json(db.books);
});

app.post("/author",(req,res) => {
    //const {newBook}=req.body;
    db.authors.push(req.body);
    return res.json(db.authors);
});
//same publication 


//PUT APIS 

app.put("/book-update/:isbn",(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn}=req.params;
    db.books.forEach((book)=>{
        if(book.ISBN===isbn){
            return {...book, ...req.body};
        }
        return book;
    })
    return res.json(db.books);
});
//same for authors and publications 

//DELETE API 
app.delete("/book-delete/:isbn",(req,res) => {
    const {isbn}=req.params;
    const filteredBooks=db.books.filter((book)=>book.ISBN!==isbn);
    db.books=filteredBooks;
    return res.json(db.books);
});

app.delete("/book-author-delete/:isbn/:id",(req,res) => {
    let {isbn,id}=req.params;
    id=Number(id);
    db.books.forEach((book)=>{
        if(book.ISBN===isbn){
            if(!book.authors.includes(id)){
                return;
            }
            book.authors=book.authors.filter((author)=>author!==id);
            return book;
        }
        return book;
    })
    return res.json(db.books);
});
//author book delete 
app.listen(3000,()=>{
    console.log("My Express App is Running....")
})


