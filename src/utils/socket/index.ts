/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const SocketIo = require('socket.io');

export const ConfigSocketIo = (server: Express.Application) => {
  /// SOCKET

  const io = SocketIo(server, { cors: {} });

  io.on('connection', (socket: any) => {
    console.log('new connection', socket.id);

    socket.on('new-message', (data: any) => {
      const { text } = data;

      socket.emit('new-message', {
        text: responseText(text),
      });
    });

    io.on('disconnect', function () {
      console.log('Se desonectaron los socket.' + socket.id);
    });
  });
};

const responseText = (text: string) => {
  switch (text) {
    case '¿Con que metodos puedo pagar?':
      return `Puedes pagar directamente con Paypal o mediante trasferencia bancaria, para esto se necesita la confirmacion del pago.`;
    case '¿Como llega mi orden a su lugar de destino?':
      return `Usamos los servicios de servientrega para hacer llegar tu orden y te notificaremos cada movimiento de tu orden por correo.`;
    case '¿Como obtengo cupones para mis compras?':
      return 'Recibiras un cupón gratis cuando te registres por primera vez, tambien puedes invitar a un amigo y recibiras cupones por las ordenes de tu invitado.';
    case '¿Quiero hablar con algun encargado de la tienda?':
      return 'Puedes escribirnos a nuestra linea de WhatsApp (0980 378 869) o en nuestro email (team@cici.beauty)';
    default:
      return 'Cualquier otra duda que tengas escribenos en nuestra lina de WhatsApp (0980 378 869)';
  }
};
