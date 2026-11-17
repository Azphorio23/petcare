export const campanaPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      titulo: 'Campaña de vacunación antirrábica',
      descuento: 20,
      vigencia: 'todo este mes',
      mensaje: 'Reserva la vacuna de tu perro o gato y obtén 20% de descuento.',
    });
  }, 1800);
});
