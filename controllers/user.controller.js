require('dotenv').config();
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserController {
    async createUser(req, res){
        try {
            const validator = validationResult(req);

            const {nickname, email, password} = req.body;
           
            if (await User.isUserExists(email)){
                validator.errors.push({message: "Such user already exists! "})
            }
           
            else if (validator.isEmpty()){
                res.status(201).json(await User.create(nickname, email, await bcrypt.hash(password, 11)));
                return;
            }
                            
            res.status(400).json({error: validator.errors.shift()})
            return;

        } catch (error){
            
            res.status(500).json([{msg: "Something went wrong, try one more time"}, {dev_message: error.message}])
        }
    }
    
    async loginUser(req, res){
        try {
            const validator = validationResult(req);
            const {email, password} = req.body;

            console.log(email, password)

            const user = await User.findOne(email);

           
            if (!user){
                validator.errors.push({msg: "Such user doesnt't exists! "})
            }
            else if (!await bcrypt.compare(password, user.password)){
                validator.errors.push({msg: "Incorrect password! "})
            }
           
            else if (validator.isEmpty()){
              const token = jwt.sign(
                  {userId: user.id},
                  process.env.JWT_SECRET,
                  {expiresIn: '1h'}
              );
              res.status(200).json({token: token, userId: user.id});
              return;
            }
                            
            res.status(400).json({error: validator.errors.shift()})
            return;

        } catch (error){
            
            res.status(500).json([{message: "Something went wrong, try one more time"}, {dev_message: error.message}])
        }

    }
    
    async getUsers(req, res){
        res.send( await User.getAll());
    }
    async getOneUser(req, res){
        res.send(
            await db.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])
        );
    }
    async updateUser(req, res){
        
    }
    async deleteUser(req, res){
        
    }

}

module.exports = new UserController();







