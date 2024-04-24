import express from 'express';
import { connection_problem } from './connect';
import pool from './connect';
import * as z from 'zod';
const app = express();
app.use(express.json())

console.log(new Date())




app.listen(3000, () => {
    console.log('Server is running on port 3000');
})



app.get('/v1/users', (req, res) => {

    if(connection_problem)
        return res.status(500).json({"id": "api.create_user.read","ver": "1.0","ts": `${new Date()}`,"params": {"err": "Connection to Database failed","status": "Failed","errmsg": "No records found"}})
    
    const offset = 3600*5.5*1000;
    console.log(offset)

    pool.query(`select * from create_user`, (err, result) => {

    if (!err) {
        for(let i=0;i<result.rows.length;i++)
            {
                result.rows[i].date_of_birth = new Date(result.rows[i].date_of_birth.getTime()+offset);
            }
        res.send(result.rows)    
    }

    else{
        res.status(500).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": err.message,"status": "Failed","errmsg": "No records found"}})
    }

    });
})

enum IdType {
    AADHAAR = 'AADHAAR',
    PAN = 'PAN',
    VOTERID = 'VOTERID',
    DRIVING_LICENCE = 'DRIVING LICENCE'
}



const userSchemaaadhaar = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/,"Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g,"mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    address: z.string().regex(/^[a-zA-Z]+$/,"Address should be only characters with length 4-25 ").min(4).max(25),
    id_number: z.string().regex(/^[2-9]{1}[0-9]{11}$/,"AADHAAR should be a 12 digit number"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/,"Should be a pincode of 6 digits")
})

const userSchemapan = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/,"Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g,"mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    address: z.string().regex(/^[a-zA-Z]+$/,"Address should be only characters with length 4-25" ).min(4).max(25),
    id_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,"PAN number should be in the pattern ABCDE1234A"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/,"Should be a pincode of 6 digits")
})

const userSchemavoter = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/,"Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g,"mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    address: z.string().regex(/^[a-zA-Z]+$/,"Address should be only characters with length 4-25").min(4).max(25),
    id_number: z.string().regex(/^[A-Z]{3}[0-9]{7}$/,"Voterid should be in the pattern ABC1234567"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/,"Should be a pincode of 6 digits")
})

const userSchemaDL = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/,"Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g,"mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    address: z.string().regex(/^[a-zA-Z]+$/,"Address should be only characters with length 4-25").min(4).max(25),
    id_number: z.string().regex(/^[A-Z]{2}[0-9]{2}[0-9]{11}$/,"Driving licence should be in the pattern AB1212345678912"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/,"Should be a pincode of 6 digits")
})

app.post('/v1/users/create', (req, res) => {
    if(connection_problem)
        return res.status(500).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": "Connection to Database failed","status": "Failed","errmsg": "No records created"}})
    var concatString: String = " ";
    const idata = req.body;
    const keys = Object.keys(idata)
    const values = Object.values(idata)
    
    idata.id_type = idata.id_type.toUpperCase()
    idata.gender = idata.gender.toUpperCase()

    if((idata.id_type == IdType.AADHAAR||idata.id_type ==IdType.PAN||idata.id_type ==IdType.DRIVING_LICENCE||idata.id_type ==IdType.VOTERID) == false)
        return res.status(400).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": "Field:id_type, Error: id_type value should be AADHAAR | PAN | VOTERID | DRIVING LICENCE","status": "Failed","errmsg": "No records created"}})
    
    if (!idata.date_of_birth || new Date(idata.date_of_birth) > new Date()) 
        return res.status(400).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": "Field:id_type, Error:Future Dates are not allowed","status": "Failed","errmsg": "No records created"}});
    
    try {
        if (idata.id_type == 'AADHAAR')
            userSchemaaadhaar.parse(idata)
        else if (idata.id_type == 'PAN')
            userSchemapan.parse(idata)
        else if (idata.id_type == 'VOTERID')
            userSchemavoter.parse(idata)
        else if (idata.id_type == 'DRIVING LICENCE')
            userSchemaDL.parse(idata)
        
        
        pool.query(`INSERT INTO create_user (${keys.join(",")}) VALUES (${keys.map((keys, index) => `$${index + 1}`).join(",")}) RETURNING *`, values, (err, result) => {
        
            if (!err){
                pool.query(`select unique_id from create_user where id_number = '${idata.id_number}'`,(err,uid) =>{
                    res.status(200).json( {"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": null,"status": "successful","errmsg": null},"responseCode": "OK","result": {"unique_id": uid.rows[0]}}) 
                })    
            }
        
            else
                res.status(400).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": `${err.message}`,"status": "Failed","errmsg": "No records created"}})
        })
    }
    
    catch (error) {
    
        if (error instanceof z.ZodError) {
            error.errors.forEach((validationError) => {
                var emessage: string = ` Field: ${validationError.path.join('.')}, Error: ${validationError.message}`;
                concatString = concatString.concat(emessage);
            });
            res.status(400).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": concatString,"status": "Failed","errmsg": "No records created"}})
        } 
        
        else {
            // Handle other types of errors
            res.status(400).json({"id": "api.create_user.create","ver": "1.0","ts": `${new Date()}`,"params": {"err": error,"status": "Failed","errmsg": "No records created"}})
        }
    }
  
 
})  

