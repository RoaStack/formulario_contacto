require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/formulario_db';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Conectado a MongoDB correctamente');
        const db = client.db(process.env.DB_NAME || 'formulario_db');
        
        // Verificación adicional de conexión
        await db.command({ ping: 1 });
        console.log('🔄 Ping a MongoDB exitoso');
        
        return db;
    } catch (err) {
        console.error('❌ Error de conexión a MongoDB:', err);
        process.exit(1);
    }
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Rutas
// Debe coincidir con tu estructura
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'formulario.html'));
});

app.post('/api/contacto', async (req, res) => {
    try {
        const db = await connectDB();
        const contactos = db.collection('contactos');
        
        const result = await contactos.insertOne({
            ...req.body,
            fecha: new Date()
        });
        
        console.log('📩 Nuevo mensaje guardado ID:', result.insertedId);
        
        res.json({
            success: true,
            message: 'Mensaje enviado correctamente',
            id: result.insertedId
        });
    } catch (err) {
        console.error('❌ Error al guardar mensaje:', err);
        res.status(500).json({
            success: false,
            message: err.code === 11000 ? 'Este correo ya existe' : 'Error al guardar el mensaje'
        });
    }
});

// Función para probar la conexión al iniciar
async function testConnection() {
    try {
        const db = await connectDB();
        const testDoc = { 
            test: 'Prueba de conexión inicial',
            timestamp: new Date() 
        };
        const result = await db.collection('test_connection').insertOne(testDoc);
        console.log('✅ Documento de prueba insertado ID:', result.insertedId);
    } catch (err) {
        console.error('❌ Error en prueba de conexión:', err);
    }
}

// Iniciar servidor
app.listen(port, async () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
    await testConnection(); // Ejecutar prueba de conexión al iniciar
});