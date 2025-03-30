const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth')

module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql')
    }

    

    async function login(usuario, password) {
        try {
            console.log('Datos recibidos:', usuario, password);
    
            // Consulta a la base de datos
            const data = await db.query(TABLA, { usuario: usuario });
            console.log('Resultado de la consulta:', data);
    
            // Verifica si el usuario existe
            if (!data || data.length === 0) {
                console.error('No se encontró el usuario:', usuario);
                throw new Error('Usuario no encontrado');
            }
    
            // Toma el primer registro
            const user = data;
            
            // Compara la contraseña
            const resultado = await bcrypt.compare(password, user.password);
            
            if (resultado) {
                return auth.asignarToken({ ...user });
            } else {
                throw new Error('Contraseña incorrecta');
            }
        } catch (err) {
            console.error('Error en login:', err.message);
            throw new Error('Error de autenticación: ' + err.message);
        }
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

        return db.agregar(TABLA, authData);
    }

    return {
        agregar,
        login
    }
}