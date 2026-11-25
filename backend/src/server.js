import dotenv from 'dotenv';
dotenv.config();

const { createApp } = await import('./app.js');
const port = Number(process.env.PORT || 3000);
const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`Mercado Seguro API disponible en el puerto ${port}.`);
});
