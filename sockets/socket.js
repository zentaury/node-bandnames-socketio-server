const {io} = require('../index');
const BandsModel = require('../models/bands_model');
const BandModel = require('../models/band_model');

const bands = new BandsModel();
bands.addBand(new BandModel('Queen'));
bands.addBand(new BandModel('Metallica'));
bands.addBand(new BandModel('Megadeth'));
bands.addBand(new BandModel('Anthrax'));
bands.addBand(new BandModel('Slayer'));

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { console.log('Cliente Desconectado') });

    client.on('mensaje', (payload)=>{
        console.log('Mensaje!!!', payload);
    });

    client.on('vote-band', (payload) =>{
       bands.voteBand(payload.id);
       io.emit('active-bands', bands.getBands());
    });

    //escuchar add-band
    client.on('add-band', (band) => {
        const newBand = new BandModel(band.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    //delete-band
    client.on('delete-band', (band) =>{
        bands.deleteBand(band.id);
        io.emit('active-bands', bands.getBands());
    });

    /* client.on('emitir-mensaje', (payload) => {
        console.log(payload);
        client.broadcast.emit('emitir-mensaje', payload);
    }); */
  });