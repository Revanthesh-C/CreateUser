"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_1 = require("./connect");
const connect_2 = __importDefault(require("./connect"));
const z = __importStar(require("zod"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
app.get('/v1/users', (req, res) => {
    if (connect_1.connection_problem)
        return res.status(500).json({ "id": "api.create_user.read", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": "Connection to Database failed", "status": "Failed", "errmsg": "No records found" } });
    connect_2.default.query(`select * from create_user`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
});
var IdType;
(function (IdType) {
    IdType["AADHAAR"] = "AADHAAR";
    IdType["PAN"] = "PAN";
    IdType["VOTERID"] = "VOTERID";
    IdType["DRIVING_LICENCE"] = "DRIVING LICENCE";
})(IdType || (IdType = {}));
const userSchema = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/, "Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g, "mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    date_of_birth: z.string().date(),
    address: z.string().regex(/^[a-zA-Z]+$/, "Address should be only characters with length 4-25 ").min(4).max(25),
    id_type: z.enum([IdType.AADHAAR, IdType.PAN, IdType.VOTERID, IdType.DRIVING_LICENCE]),
    id_number: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/, "Should be a pincode of 6 digits")
});
const userSchemaaadhaar = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/, "Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g, "mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    date_of_birth: z.string().date(),
    address: z.string().regex(/^[a-zA-Z]+$/, "Address should be only characters with length 4-25 ").min(4).max(25),
    id_type: z.enum([IdType.AADHAAR, IdType.PAN, IdType.VOTERID, IdType.DRIVING_LICENCE]),
    id_number: z.string().regex(/^[2-9]{1}[0-9]{11}$/, "AADHAAR should be a 12 digit number"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/, "Should be a pincode of 6 digits")
});
const userSchemapan = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/, "Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g, "mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    date_of_birth: z.string().date(),
    address: z.string().regex(/^[a-zA-Z]+$/, "Address should be only characters with length 4-25").min(4).max(25),
    id_type: z.enum([IdType.AADHAAR, IdType.PAN, IdType.VOTERID, IdType.DRIVING_LICENCE]),
    id_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN number should be in the pattern ABCDE1234A"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/, "Should be a pincode of 6 digits")
});
const userSchemavoter = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/, "Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g, "mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    date_of_birth: z.string().date(),
    address: z.string().regex(/^[a-zA-Z]+$/, "Address should be only characters with length 4-25").min(4).max(25),
    id_type: z.enum([IdType.AADHAAR, IdType.PAN, IdType.VOTERID, IdType.DRIVING_LICENCE]),
    id_number: z.string().regex(/^[A-Z]{3}[0-9]{7}$/, "Voterid should be in the pattern ABC1234567"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/, "Should be a pincode of 6 digits")
});
const userSchemaDL = z.object({
    name: z.string().regex(/^[a-zA-Z]+$/, "Name should consist only of alphabets").min(3).max(20),
    mobile: z.string().regex(/(\+)\d{2}[789]\d{9}/g, "mobile number should be having a 2 digit country code starting with + followed by 10 numbers"),
    date_of_birth: z.string().date(),
    address: z.string().regex(/^[a-zA-Z]+$/, "Address should be only characters with length 4-25").min(4).max(25),
    id_type: z.enum([IdType.AADHAAR, IdType.PAN, IdType.VOTERID, IdType.DRIVING_LICENCE]),
    id_number: z.string().regex(/^[A-Z]{2}[0-9]{2}[0-9]{11}$/, "ID should be in the pattern AB1212345678912"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]),
    location: z.string().regex(/^[1-9][0-9]{5}$/, "Should be a pincode of 6 digits")
});
app.post('/v1/users/create', (req, res) => {
    if (connect_1.connection_problem)
        return res.status(500).json({ "id": "api.create_user.create", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": "Connection to Database failed", "status": "Failed", "errmsg": "No records created" } });
    var concatString = " ";
    const idata = req.body;
    const keys = Object.keys(idata);
    const values = Object.values(idata);
    idata.id_type = idata.id_type.toUpperCase();
    idata.gender = idata.gender.toUpperCase();
    try {
        if (idata.id_type == 'AADHAAR')
            userSchemaaadhaar.parse(idata);
        else if (idata.id_type == 'PAN')
            userSchemapan.parse(idata);
        else if (idata.id_type == 'VOTERID')
            userSchemavoter.parse(idata);
        else if (idata.id_type == 'DRIVING LICENCE')
            userSchemaDL.parse(idata);
        else
            userSchema.parse(idata);
        connect_2.default.query(`INSERT INTO create_user (${keys.join(",")}) VALUES (${keys.map((keys, index) => `$${index + 1}`).join(",")}) RETURNING *`, values, (err, result) => {
            if (!err) {
                connect_2.default.query(`select unique_id from create_user where id_number = '${idata.id_number}'`, (err, uid) => {
                    res.status(200).json({ "id": "api.create_user.create", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": null, "status": "successful", "errmsg": null }, "responseCode": "OK", "result": { "unique_id": uid.rows[0] } });
                });
            }
            else
                res.status(400).json({ "id": "api.create_user.create", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": `${err.message}`, "status": "Failed", "errmsg": "No records created" } });
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            error.errors.forEach((validationError) => {
                var emessage = ` Field: ${validationError.path.join('.')}, Error: ${validationError.message}`;
                concatString = concatString.concat(emessage);
            });
            res.status(400).json({ "id": "api.create_user.create", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": concatString, "status": "Failed", "errmsg": "No records created" } });
        }
        else {
            // Handle other types of errors
            res.status(400).json({ "id": "api.create_user.create", "ver": "1.0", "ts": `${new Date()}`, "params": { "err": error, "status": "Failed", "errmsg": "No records created" } });
        }
    }
});
