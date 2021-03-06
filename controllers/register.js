const registerCtrl = (req, res, psqldb, bcrypt) => {
  const { name, email, password } = req.body
 
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission")
  } 
    const hash = bcrypt.hashSync(password)
    console.log(password)
      psqldb.transaction(trx => {
        trx.insert({
          hash,
          email
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {  
            return trx("users")
              .returning('*')
              .insert({
                email: loginEmail[0],
                name,
                joined: new Date()
              })
            .then(user => {
              console.log(user)
              res.json(user[0])
            })
        })        
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json("unable to register"))
    }
}

module.exports = {registerCtrl}