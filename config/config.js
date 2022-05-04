const dotenv=require('dotenv')
dotenv.config();
const DB=process.env.DB;
const PORT=process.env.PORT;
const JWK_KEY=process.env.JWK_KEY

module.exports ={DB,PORT,JWK_KEY}