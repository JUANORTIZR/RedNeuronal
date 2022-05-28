import { Component, OnInit } from '@angular/core';
import { Capa } from './Modelos/Capa';

import { saveAs } from 'file-saver';

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

  tipoRed: string = "";
  modeloDeRed: string = "--";
  funcionDeActivacion: string = "--";



  cantidadDeCapas: string = "--";

  listaCapas: Capa[] = [];

  listaFuncionesActivacion: string[] = [];
  algoritmoDeEntrenamiento: string;
  matrizDePesosUnicapa: any[];
  vectorDeUmbrales: any[];
  listaMatrices: any[];
  funcionDeActivacionCapaSalida: string ="--";
  listaUmbrales = [];
  numeroDeIteraciones: number=0;
  rataDeAprendizaje: string="";
  errorMaximoPermititdo: string ="";


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
    if (this.tipoRed == "Unicapa") {
      this.inicializarMatrizPesosVectorUmbrales();
    }
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
    console.log(vectorDeUmbrales);
    console.log(matrizDePesos);
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
    } if (this.modeloDeRed == "ADALINE") {
      this.listaFuncionesActivacion = ["LINEAL"];
      this.algoritmoDeEntrenamiento = "REGLA DELTA";
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
      this.listaMatrices = [{matrizEntrada,matrizSalida}];
      this.listaUmbrales = [{umbral1, umbral2}];
    }
    if (Number(this.cantidadDeCapas) == 2) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizC1 = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.listaCapas[1].cantidadNeurona);
      matrizC2 = this.crearMatriz(this.listaCapas[1].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbral2 = this.crearVectorDeUmbral(this.listaCapas[1].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      this.listaMatrices = [{matrizEntrada, matrizC1, matrizC2}];
      this.listaUmbrales = [{umbral1, umbral2,umbralS}]
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
      this.listaMatrices = [{matrizEntrada, matrizC1, matrizC2,matrizC3}];
      this.listaUmbrales = [{umbral1, umbral2,umbral3,umbralS}]
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

  verificarDatosParaUnicapa(){
    if(this.tipoRed == "Unicapa"){

      if(this.modeloDeRed == "--"){
        alert("Primero debes seleccionar un modelo de red en el campo modelo de red")
        return false;
      }
       if(this.funcionDeActivacion == "--"){
        alert("Primero debes seleccionar una función de activación")
        return false;
      }

      if(Number(this.numeroDeIteraciones) <= 0){
        alert("Primero debe digitar un numero de iteraciones [Mayor a 0]")
        return false;
      }

      if(this.rataDeAprendizaje == ""){
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }


      if(!(Number(this.rataDeAprendizaje) > 0 && Number(this.rataDeAprendizaje) <= 1)){
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }
      if(this.errorMaximoPermititdo == ""){
        alert("Dijite un valor para el error maximo permitido comprendido entre 0 y 1\nPor ejemplo: 0.1")
        return false;
      }

      if (!(Number(this.errorMaximoPermititdo) >= 0 && Number(this.errorMaximoPermititdo) <= 1)) {
        alert("El valor para el error maximo permitido es mayor o igual a 0 y menor o igual 1\nPor ejemplo: 0.1")
        return false;
      }

      if(!this.matrizDePesosUnicapa){
        alert("Primero debes cargar los datos");
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }

  }


  verificarDatosParaMulticapa(){
    if(this.tipoRed == "Multicapa"){

      if(this.modeloDeRed == "--"){
        alert("Primero debes seleccionar un modelo de red en el campo modelo de red")
        return false;
      }

      if(Number(this.numeroDeIteraciones) <= 0){
        alert("Primero debe digitar un numero de iteraciones [Mayor a 0]")
        return false;
      }

      if(this.cantidadDeCapas == "--" ){
        alert("Primero debe seleccionar la cantidad de capas ocultas para la neurona")
        return false;
      }

      if(this.funcionDeActivacionCapaSalida =="--"){
        alert("Primero debe seleccionar la funcion de activacion para la capa de salida")
        return false;
      }

      for (let index = 0; index < this.listaCapas.length; index++) {
        if(this.listaCapas[index].cantidadNeurona == undefined){
          alert("Primero debes ingresar la cantidad de neuronas para la capa: "+(index+1));
          return false;
        }
        if(this.listaCapas[index].funcionDeActivacion == undefined){
          alert("Primero debe seleccionar la funcion de activacion para la capa: "+(index+1))
          return false;
        }
      }

      if(this.rataDeAprendizaje == ""){
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }

      if(!(Number(this.rataDeAprendizaje) > 0 && Number(this.rataDeAprendizaje) <= 1)){
        alert("Dijite un valor para la rata de aprendizaje mayor a 0 y menor o igual 1")
        return false;
      }
      if(this.errorMaximoPermititdo == ""){
        alert("Dijite un valor para el error maximo permitido comprendido entre 0 y 1\nPor ejemplo: 0.1")
        return false;
      }

      if (!(Number(this.errorMaximoPermititdo) >= 0 && Number(this.errorMaximoPermititdo) <= 1)) {
        alert("El valor para el error maximo permitido es mayor o igual a 0 y menor o igual 1\nPor ejemplo: 0.1")
        return false;
      }

      if(this.totalPatrones<0){
        alert("Primero debes cargar los datos");
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
  generarArchivo() {
    if (this.verificarDatosParaUnicapa()) {
        var blob = new Blob([
          JSON.stringify("Matriz de pesos unicapa") + "\n",
          this.matrizDePesosUnicapa + "\n",
          JSON.stringify("Vector de umbrales") + "\n",
          this.vectorDeUmbrales + "\n",
        ], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "DatosExportados.csv");
    }

    if(this.verificarDatosParaMulticapa()){
      this.crearMatricesDePesosYUmbralesMulticapa();
      var blob = new Blob([
        JSON.stringify("Lista de matrices de pesos multicapa") + "\n",
        JSON.stringify(this.listaMatrices) + "\n",
        JSON.stringify("Vector de umbrales") + "\n",
        JSON.stringify(this.listaUmbrales) + "\n",
      ], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "DatosExportadosMulticapa.csv");
    }
  }




}
