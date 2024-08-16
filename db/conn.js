const {Sequelize} = require('sequelize')
const sequelize = new Sequelize('pensamentos' , 'root' , 'root',{
    host: 'localhost',
    dialect: 'mysql'
})
try{
    sequelize.authenticate()
    console.log('Você está conectado')
}catch(error){
    console.log('Aconteceu um erro inesperado' , error)
}

module.exports = sequelize