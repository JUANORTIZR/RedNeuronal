import { Component, OnInit } from '@angular/core';
import { Capa } from './Modelos/Capa';

import { saveAs } from 'file-saver';
import { RouteReuseStrategy } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'RedNeuronal';
  totalEntradas: number = 0;
  totalSalidas: number = 0;
  totalPatrones: number = 0;

  tipoRed: string = "Unicapa";
  modeloDeRed: string = "--";
  funcionDeActivacion: string = "--";

  datosDeEntrada: number[][] = [];
  datosDeSalida: number[][] = [];

  cantidadDeCapas: string = "--";

  listaCapas: Capa[] = [];

  listaFuncionesActivacion: string[] = [];
  algoritmoDeEntrenamiento: string;
  matrizDePesosUnicapa: number[][] = [];
  vectorDeUmbrales: number[] = [];
  listaMatrices: any[];
  funcionDeActivacionCapaSalida: string = "--";
  listaUmbrales = [];
  numeroDeIteraciones: number = 0;
  rataDeAprendizaje: string = "";
  errorMaximoPermititdo: string = "";
  listaEp: number[] = [];
  listaErrorPorIteraciones: number[] = [];
  iteracionesG: string[] = [];
  errorMaximoGrafi: any;
  valido = false;



  ngOnInit() {

  }


  leerDatos(archivo) {
    var datos = archivo.target.files[0];



    if (datos) {
      let reader = new FileReader();
      reader.onload = () => {
        let registros;
        registros = reader.result;
        this.calcularSEP(registros);

      }

      reader.readAsText(datos);
    }
  }

  calcularSEP(registros) {
    let datos = registros.split("\r\n");
    let identificadores = datos[0].split(";");

    this.totalEntradas = identificadores.filter(x => x === "ENTRADA").length;
    this.totalSalidas = identificadores.filter(x => x === "SALIDA").length;
    this.totalPatrones = datos.length - 1;
    this.separarListas(datos);
    if (this.tipoRed == "Unicapa") {
      this.inicializarMatrizPesosVectorUmbrales();
    }

  }

  separarListas(contenido: any) {
    var titulos = contenido[0].split(";");
    var listaEntradas = [];
    var listaSalidas = [];
    var auxliarEntradas = [];
    var auxSalidas = [];
    for (let i = 1; i < contenido.length; i++) {
      const element1 = contenido[i];
      auxliarEntradas = [];
      auxSalidas = [];
      var aux = element1.split(";");
      for (let j = 0; j < titulos.length; j++) {
        const element = titulos[j];
        if (element == "ENTRADA") {
          auxliarEntradas.push(Number(aux[j]))
        } else {
          auxSalidas.push(Number(aux[j]));
        }
      }
      listaEntradas.push(auxliarEntradas);
      listaSalidas.push(auxSalidas);
    }

    this.datosDeEntrada = listaEntradas;
    this.datosDeSalida = listaSalidas;
  }

  inicializarMatrizPesosVectorUmbrales() {
    let matrizDePesos = [];
    let vectorDeUmbrales = [];
    for (let j = 0; j < this.totalEntradas; j++) {
      let pesos = [];
      for (let index = 0; index < this.totalSalidas; index++) {
        pesos.push(this.generarValoresAleatorios(-1.0, 1.01));
        if (j == 0) {
          vectorDeUmbrales.push(this.generarValoresAleatorios(-1.0, 1.01))
        }
      }
      matrizDePesos.push(pesos);
    }
    this.matrizDePesosUnicapa = matrizDePesos;
    this.vectorDeUmbrales = vectorDeUmbrales;
    this.generarArchivo("Pesos iniciales");
    console.log("Matriz de pesos",this.matrizDePesosUnicapa);

  }

  generarValoresAleatorios(menor: number, mayor: number) {
    return Number((Math.random() * (mayor - menor) + menor).toFixed(2));
  }


  getTipoRed(datos) {
    this.tipoRed = datos.target.value;
    if (this.tipoRed === "Unicapa") {
      if (this.totalEntradas != 0) {
        this.inicializarMatrizPesosVectorUmbrales();
      }

    }
  }

  getModeloDeRed(datos) {
    this.modeloDeRed = datos.target.value;
    this.listaFuncionesActivacion = [];
    if (this.modeloDeRed == "BACKPROPAGATION") {
      this.listaFuncionesActivacion = ["SIGMOIDE", "TANGENTE HIPERBOLICA"];
      this.algoritmoDeEntrenamiento = "PROPAGACION INVERSA";

    }
    if (this.modeloDeRed == "PERCEPTRON") {
      this.listaFuncionesActivacion = ["ESCALON"]
      this.algoritmoDeEntrenamiento = "REGLA DELTA";
      this.funcionDeActivacion = "ESCALON"
    } if (this.modeloDeRed == "ADALINE") {
      this.listaFuncionesActivacion = ["LINEAL"];
      this.algoritmoDeEntrenamiento = "REGLA DELTA";
      this.funcionDeActivacion = "LINEAL"
    }
    if (this.modeloDeRed == "--") {
      this.listaFuncionesActivacion = [];
      this.algoritmoDeEntrenamiento = "Primero seleccione un modelo de red";
    }
    console.log("algoritmo:", this.algoritmoDeEntrenamiento);
    console.log("modelo de red:", this.modeloDeRed);

  }

  getCantidadCapas(datos) {
    this.cantidadDeCapas = datos.target.value;
    console.log(this.cantidadDeCapas);
    this.listaCapas = [];
    for (let index = 0; index < Number(this.cantidadDeCapas); index++) {
      let item = new Capa();
      this.listaCapas.push(item);
    }
  }

  getFuncionDeActivacion(datos) {
    this.funcionDeActivacion = datos.target.value;
    console.log(this.funcionDeActivacion);

  }

  getCantidadNeuronas(index, datos) {
    if (Number(index) == 0) {
      this.listaCapas[0].cantidadNeurona = Number(datos.target.value);
      console.log(index, this.listaCapas[0].cantidadNeurona);
    }
    if (Number(index) == 1) {
      this.listaCapas[1].cantidadNeurona = Number(datos.target.value);
      console.log(index, this.listaCapas[1].cantidadNeurona);
    }
    if (Number(index) == 2) {
      this.listaCapas[2].cantidadNeurona = Number(datos.target.value);
      console.log(index, this.listaCapas[2].cantidadNeurona);
    }
  }

  getFuncionActvacionMulticapa(index, datos) {

    if (Number(index) == 0) {
      this.listaCapas[0].funcionDeActivacion = datos.target.value;
      console.log(index, this.listaCapas[0].funcionDeActivacion);
    }
    if (Number(index) == 1) {
      this.listaCapas[1].funcionDeActivacion = datos.target.value;
      console.log(index, this.listaCapas[0].funcionDeActivacion);
    }
    if (Number(index) == 2) {
      this.listaCapas[2].funcionDeActivacion = datos.target.value;
      console.log(index, this.listaCapas[0].funcionDeActivacion);
    }
  }

  crearMatricesDePesosYUmbralesMulticapa() {
    let matrizEntrada = [];
    let matrizSalida = [];
    let matrizC1 = [];
    let matrizC2 = [];
    let matrizC3 = [];
    let umbral1 = [];
    let umbral2 = [];
    let umbral3 = [];
    let umbralS = [];

    if (Number(this.cantidadDeCapas) == 1) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizSalida = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      this.listaMatrices = [{ matrizEntrada, matrizSalida }];
      this.listaUmbrales = [{ umbral1, umbral2 }];
    }
    if (Number(this.cantidadDeCapas) == 2) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizC1 = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.listaCapas[1].cantidadNeurona);
      matrizC2 = this.crearMatriz(this.listaCapas[1].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbral2 = this.crearVectorDeUmbral(this.listaCapas[1].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      this.listaMatrices = [{ matrizEntrada, matrizC1, matrizC2 }];
      this.listaUmbrales = [{ umbral1, umbral2, umbralS }]
    }
    if (Number(this.cantidadDeCapas) == 3) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizC1 = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.listaCapas[1].cantidadNeurona);
      matrizC2 = this.crearMatriz(this.listaCapas[1].cantidadNeurona, this.listaCapas[2].cantidadNeurona);
      matrizC3 = this.crearMatriz(this.listaCapas[2].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbral2 = this.crearVectorDeUmbral(this.listaCapas[1].cantidadNeurona);
      umbral3 = this.crearVectorDeUmbral(this.listaCapas[2].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      this.listaMatrices = [{ matrizEntrada, matrizC1, matrizC2, matrizC3 }];
      this.listaUmbrales = [{ umbral1, umbral2, umbral3, umbralS }]
    }
  }

  getFuncionActvacionCapaSalida(datos) {
    this.funcionDeActivacionCapaSalida = datos.target.value;
  }

  crearVectorDeUmbral(tamano: number) {
    let vectorDeUmbral = [];
    for (let index = 0; index < tamano; index++) {
      vectorDeUmbral.push(Number((Math.random() * (1.01 - (-1.0)) + (-1.0)).toFixed(2)))
    }
    return vectorDeUmbral;
  }

  crearMatriz(columnas: number, filas: number) {
    let matriz = [];
    let fila = [];
    for (let i = 0; i < columnas; i++) {

      for (let j = 0; j < filas; j++) {
        fila.push(Number((Math.random() * (1.01 - (-1.0)) + (-1.0)).toFixed(2)))
      }
      matriz.push(fila);
      fila = [];
    }
    return matriz;
  }

  verificarDatosParaUnicapa() {
    if (this.tipoRed == "Unicapa") {
      if (this.totalPatrones <= 0) {
        alert("Primero debes cargar los datos a entrenar");
        return false;
      }

      if (this.modeloDeRed == "--") {
        alert("Primero debes seleccionar un modelo de red en el campo modelo de red")
        return false;
      }
      if (this.funcionDeActivacion == "--") {
        alert("Primero debes seleccionar una función de activación")
        return false;
      }

      if (Number(this.numeroDeIteraciones) <= 0) {
        alert("Primero debe digitar un numero de iteraciones [Mayor a 0]")
        return false;
      }

      if (this.rataDeAprendizaje == "") {
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }


      if (!(Number(this.rataDeAprendizaje) > 0 && Number(this.rataDeAprendizaje) <= 1)) {
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }
      if (this.errorMaximoPermititdo == "") {
        alert("Dijite un valor para el error maximo permitido comprendido entre 0 y 1\nPor ejemplo: 0.1")
        return false;
      }

      if (!(Number(this.errorMaximoPermititdo) >= 0 && Number(this.errorMaximoPermititdo) <= 1)) {
        alert("El valor para el error maximo permitido es mayor o igual a 0 y menor o igual 1\nPor ejemplo: 0.1")
        return false;
      }

      if (!this.matrizDePesosUnicapa) {
        alert("Primero debes cargar los datos");
        return false;
      } else {
        return true;
      }
    } else {
      alert("Primero debe seleccionar un tipo de red");
      return false;
    }

  }


  verificarDatosParaMulticapa() {
    if (this.tipoRed == "Multicapa") {

      if (this.modeloDeRed == "--") {
        alert("Primero debes seleccionar un modelo de red en el campo modelo de red")
        return false;
      }

      if (Number(this.numeroDeIteraciones) <= 0) {
        alert("Primero debe digitar un numero de iteraciones [Mayor a 0]")
        return false;
      }

      if (this.cantidadDeCapas == "--") {
        alert("Primero debe seleccionar la cantidad de capas ocultas para la neurona")
        return false;
      }

      if (this.funcionDeActivacionCapaSalida == "--") {
        alert("Primero debe seleccionar la funcion de activacion para la capa de salida")
        return false;
      }

      for (let index = 0; index < this.listaCapas.length; index++) {
        if (this.listaCapas[index].cantidadNeurona == undefined) {
          alert("Primero debes ingresar la cantidad de neuronas para la capa: " + (index + 1));
          return false;
        }
        if (this.listaCapas[index].funcionDeActivacion == undefined) {
          alert("Primero debe seleccionar la funcion de activacion para la capa: " + (index + 1))
          return false;
        }
      }

      if (this.rataDeAprendizaje == "") {
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }

      if (!(Number(this.rataDeAprendizaje) > 0 && Number(this.rataDeAprendizaje) <= 1)) {
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }
      if (this.errorMaximoPermititdo == "") {
        alert("Dijite un valor para el error maximo permitido comprendido entre 0 y 1\nPor ejemplo: 0.1")
        return false;
      }

      if (!(Number(this.errorMaximoPermititdo) >= 0 && Number(this.errorMaximoPermititdo) <= 1)) {
        alert("El valor para el error maximo permitido es mayor o igual a 0 y menor o igual 1\nPor ejemplo: 0.1")
        return false;
      }

      if (this.totalPatrones < 0) {
        alert("Primero debes cargar los datos");
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  funcionSoma(patron: number) {
    let salidasFuncionSoma: number[] = [];
    let aux = 0;
    for (let i = 0; i < this.totalSalidas; i++) {
      aux = 0;
      for (let j = 0; j < this.totalEntradas; j++) {
        aux = aux + (Number(this.datosDeEntrada[patron][j]) * Number(this.matrizDePesosUnicapa[j][i]));
      }
      aux = aux - Number(this.vectorDeUmbrales[i]);
      salidasFuncionSoma.push(Number(aux.toFixed(2)))
    }
    return salidasFuncionSoma;
  }

  salidaDeLaRed(patron: number) {
    let yR = [];
    let s = this.funcionSoma(patron);
    for (let i = 0; i < this.totalSalidas; i++) {
      if (this.funcionDeActivacion == "LINEAL") {
        yR.push(s[i]);
      } else if (this.funcionDeActivacion = "ESCALON") {
        yR.push(s[i] >= 0 ? 1 : 0);
      }
    }
    // console.log("Salida de la red: ", yR);
    return yR;
  }

  errorLineal(patron: number) {
    let eL: number[] = [];
    let yR = this.salidaDeLaRed(patron);
    for (let i = 0; i < this.totalSalidas; i++) {
      let aux = Number((this.datosDeSalida[patron][i] - yR[i]).toFixed(2));
      eL.push(aux);
    }
    // console.log("Error lineal: ", eL);
    return eL;
  }

  errorPatron(patron: number) {
    let eP = 0;
    let aux: number = 0;
    let eL: number[] = this.errorLineal(patron);
    for (let i = 0; i < this.totalSalidas; i++) {
      aux += Math.abs(eL[i]);
    }
    eP = aux / this.totalSalidas;
    this.listaEp.push(eP);
    //  console.log("Error patron: ", eP);
  }

  modificarPesos(patron: number) {
    let aux = 0; let auxUm = 0;
    let eL = this.errorLineal(patron);
    let matriz = this.matrizDePesosUnicapa; let vector = this.vectorDeUmbrales;
    for (let i = 0; i < this.totalSalidas; i++) {
      for (let j = 0; j < this.totalEntradas; j++) {
        aux = 0;
        aux = this.matrizDePesosUnicapa[j][i] + (Number(this.rataDeAprendizaje) * eL[i] * this.datosDeEntrada[patron][j]);
        matriz[j][i] = Number(aux.toFixed(2));
      }
      auxUm = 0;
      auxUm = this.vectorDeUmbrales[i] + (Number(this.rataDeAprendizaje) * eL[i] * 1);
      vector[i] = Number(auxUm.toFixed(2));
    }

    this.vectorDeUmbrales = [...vector];
    this.matrizDePesosUnicapa = [...matriz];

    console.log("Matriz de pesos: ", this.matrizDePesosUnicapa);

    return matriz;
    //  console.log(this.matrizDePesosUnicapa);
  }


  realizarIteraciones(numeroIteraciones: number) {
    //this.inicializarMatrizPesosVectorUmbrales();

    let aux = 2;

    for (let i = 0; i < numeroIteraciones; i++) {
      if (aux <= Number(this.errorMaximoPermititdo)) {
        this.generarArchivo("Pesos ideales");
        i = numeroIteraciones;
        return;
      } else {
        aux = 0;

        this.iteracionesG.push((this.iteracionesG.length + 1).toString());
        this.errorMaximoGrafi.push(this.errorMaximoPermititdo.toString());
        for (let j = 0; j < this.totalPatrones; j++) {
          this.errorPatron(j);
          this.modificarPesos(j);
        }
        aux = this.calcularErrorPorIteracion(this.listaEp);
        this.listaErrorPorIteraciones.push(aux);
        this.listaEp = [];
      }
    }
  }

  calcularErrorPorIteracion(datos) {
    let aux: number = 0;
    let eI: number = 0;

    for (let i = 0; i < datos.length; i++) {
      aux += datos[i];
    }
    eI = Number((aux / this.totalPatrones).toFixed(2));
    aux = 0;
    console.log("Error por iteracion: ", eI);
    return eI;
  }

  entrenarRed() {
    this.valido = this.verificarDatosParaUnicapa();
    if (this.valido) {
      this.listaErrorPorIteraciones = [];
      this.errorMaximoGrafi = [];
      this.iteracionesG = [];
      this.inicializarMatrizPesosVectorUmbrales();
      this.realizarIteraciones(this.numeroDeIteraciones);

      this.chartLabels = this.iteracionesG;
      this.chartDatasets = [
        { data: this.listaErrorPorIteraciones, label: 'Error por iteracion' },
        { data: this.errorMaximoGrafi, label: 'Error maximo permitido' }
      ];
    }
    // if (this.verificarDatosParaMulticapa()) {
    //   this.crearMatricesDePesosYUmbralesMulticapa();
    //   var blob = new Blob([
    //     JSON.stringify("Lista de matrices de pesos multicapa") + "\n",
    //     JSON.stringify(this.listaMatrices) + "\n",
    //     JSON.stringify("Vector de umbrales") + "\n",
    //     JSON.stringify(this.listaUmbrales) + "\n",
    //   ], { type: "text/csv;charset=utf-8" });
    //   saveAs(blob, "DatosExportadosMulticapa.csv");
    // }
  }

  seguirIterando(){
    this.valido = this.verificarDatosParaUnicapa();
    if (this.valido) {
      this.realizarIteraciones(this.numeroDeIteraciones);
      this.chartLabels = this.iteracionesG;
      this.chartDatasets = [
        { data: this.listaErrorPorIteraciones, label: 'Error por iteracion' },
        { data: this.errorMaximoGrafi, label: 'Error maximo permitido' }
      ];
    }
  }

  generarArchivo(nombre) {
    let data = [];
    let aux;
    for (let index = 0; index < this.matrizDePesosUnicapa.length; index++) {
      const element = this.matrizDePesosUnicapa[index];
      for (let index = 0; index < element.length; index++) {
        aux = "";
        if (index == element.length - 1) {
          aux += element[index].toString() + "\n"
        } else {
          aux += element[index].toString() + ";";
        }
        data.push(aux);
      }
    }
    //Falta agregar los umbrales al archivo (creo)
    var blob = new Blob([...data,JSON.stringify("Vector de umbrales") + "\n",this.vectorDeUmbrales], { type: "text/csv;charset=utf-8" });
    saveAs(blob, nombre);
  }

  chartType = 'line';

  chartDatasets = [
    { data: this.listaErrorPorIteraciones, label: 'Error por iteracion' },
    { data: [], label: 'Error maximo permitido' }
  ];



  chartLabels = ["1"];

  chartColors = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(7, 151, 16, .7)',
      borderWidth: 2,
    }
  ];

  chartOptions: any = {
    responsive: true
  };

  chartClicked(event: any) {
    console.log(event);
  }

  chartHovered(event: any) {
    console.log(event);
  }



}
