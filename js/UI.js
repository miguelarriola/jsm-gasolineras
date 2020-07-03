class UI {
  constructor() {
    this.api = new API();

    this.markers = new L.LayerGroup();
    // Iniciar el mapa
    this.mapa = this.inicializarMapa();
  }

  inicializarMapa() {
    // Inicializar y obtener la propiedad del mapa
    const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
    const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + enlaceMapa + ' Contributors',
      maxZoom: 18,
    }).addTo(map);
    return map;
  }

  mostrarEstablecimietnos() {
    this.api.obtenerDatos().then((datos) => {
      const resultado = datos.respuestaJSON.results;
      this.mostrarPines(resultado);
    });
  }

  mostrarPines(datos) {
    this.markers.clearLayers();
    datos.forEach((dato) => {
      const { latitude, longitude, calle, regular, premium } = dato;
      const opcionesPopUp = L.popup().setContent(`
      <p>Calle: ${calle}</p>
      <p><b>Regular:</b> $ ${regular}</p>
      <p><b>Premium:</b> $ ${premium}</p>
      `);
      const marker = new L.marker([
        parseFloat(latitude),
        parseFloat(longitude),
      ]).bindPopup(opcionesPopUp);
      this.markers.addLayer(marker);
    });
    this.markers.addTo(this.mapa);
  }

  obtenerSugerencias(busqueda) {
    this.api.obtenerDatos().then((datos) => {
      const resultados = datos.respuestaJSON.results;
      this.filtrarSugerencias(resultados, busqueda);
    });
  }

  filtrarSugerencias(resultado, busqueda) {
    const filtro = resultado.filter(
      (filtro) => filtro.calle.indexOf(busqueda) !== -1
    );
    this.mostrarPines(filtro);
  }
}
