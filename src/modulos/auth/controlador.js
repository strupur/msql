const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth')

module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql')
    }

    // async function login(usuario, password) {
    //     try {
    //         // Espera a que la consulta a la base de datos se resuelva
    //         const data = await db.query(TABLA, { usuario: usuario });
    
    //         // Valida que `data` y `data.password` existan
    //         if (!data || !data.password) {
    //             throw new Error('Usuario no encontrado o contraseña inválida');
    //         }
    
    //         // Compara la contraseña ingresada con el hash almacenado
    //         const resultado = await bcrypt.compare(password, data.password);
    
    //         if (resultado === true) {
    //             // Devuelve el token de autenticación si la contraseña es correcta
    //             return auth.asignarToken({ ...data });
    //         } else {
    //             throw new Error('Información inválida');
    //         }
    //     } catch (error) {
    //         console.error('Error en login:', error.message);
    //         throw error; // Re-lanza el error para que se maneje en el nivel superior
    //     }
    // }

    async function login (usuario, password) {
        console.log(usuario, password);
        const data = await db.query(TABLA, {usuario: usuario });

        return  bcrypt.compare(password, data.password)
        .then(resultado => {
            if(resultado === true) {
                return auth.asignarToken({...data})
            }else{
                throw new Error('Informacion Invalida');
            }
        })
    }

    async function agregar(data) {
        console.log('data', data);
        

        const authData = {
            id: data.id,
        }
        if(data.usuario){
            authData.usuario = data.usuario
        }

        if(data.password){
            authData.password = await bcrypt.hash(data.password.toString(), 5);
        }

        return db.insertar(TABLA, authData);
    }

    return {
        agregar,
        login
    }
}