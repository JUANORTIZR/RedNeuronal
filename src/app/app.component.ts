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
  modeloDeRed: string = "";
  funcionDeActivacion: string = "";



  cantidadDeCapas: number = 0;

  listaCapas: Capa[] = [];

  listaFuncionesActivacion: string[] = [];
  algoritmoDeEntrenamiento: string;
  matrizDePesosUnicapa: any[];
  vectorDeUmbrales: any[];
  listaMatrices: any[];
  funcionDeActivacionCapaSalida: any;


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
    for (let index = 0; index < this.cantidadDeCapas; index++) {
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
    console.log("cantidad neuronas", this.listaCapas[0].cantidadNeurona);
    console.log("Cantidad capas ", this.cantidadDeCapas);
    console.log("Cantidad entradas", this.totalEntradas);

    if (this.cantidadDeCapas == 1) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizSalida = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      console.log("Matriz entrada", matrizEntrada);
      console.log("Matriz salida", matrizSalida);
      console.log("Vector de umbral 1", umbral1);
      console.log("Vector de umbral S", umbralS);
    }
    if (this.cantidadDeCapas == 2) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizC1 = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.listaCapas[1].cantidadNeurona);
      matrizC2 = this.crearMatriz(this.listaCapas[1].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbral2 = this.crearVectorDeUmbral(this.listaCapas[1].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      console.log("Matriz entrada", matrizEntrada);
      console.log("Matriz c12", matrizC1);
      console.log("Matriz c2s", matrizC1);
      console.log("Vector de umbral 1", umbral1);
      console.log("Vector de umbral 2", umbral2);
      console.log("Vector de umbral salida", umbralS);
    }
    if (this.cantidadDeCapas == 3) {
      matrizEntrada = this.crearMatriz(this.totalEntradas, this.listaCapas[0].cantidadNeurona);
      matrizC1 = this.crearMatriz(this.listaCapas[0].cantidadNeurona, this.listaCapas[1].cantidadNeurona);
      matrizC2 = this.crearMatriz(this.listaCapas[1].cantidadNeurona, this.listaCapas[2].cantidadNeurona);
      matrizC3 = this.crearMatriz(this.listaCapas[2].cantidadNeurona, this.totalSalidas);
      umbral1 = this.crearVectorDeUmbral(this.listaCapas[0].cantidadNeurona);
      umbral2 = this.crearVectorDeUmbral(this.listaCapas[1].cantidadNeurona);
      umbral3 = this.crearVectorDeUmbral(this.listaCapas[2].cantidadNeurona);
      umbralS = this.crearVectorDeUmbral(this.totalSalidas);
      console.log("Matriz entrada", matrizEntrada);
      console.log("Matriz c12", matrizC1);
      console.log("Matriz c23", matrizC2);
      console.log("Matriz c3s", matrizC3);
      console.log("Vector de umbral 1", umbral1);
      console.log("Vector de umbral 2", umbral2);
      console.log("Vector de umbral 3", umbral3);
      console.log("Vector de umbral salida", umbralS);
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



  generarArchivo() {
    if (this.tipoRed == "Unicapa") {
      if (!this.matrizDePesosUnicapa) {
        alert("Por favor complete los campos");
      } else {
        var blob = new Blob([
          JSON.stringify("Matriz de pesos unicapa") + "\n",
          JSON.stringify(this.matrizDePesosUnicapa) + "\n",
          JSON.stringify("Vector de umbrales") + "\n",
          JSON.stringify(this.vectorDeUmbrales) + "\n",
        ], { type: "text/csv;charset=utf-8" });
        saveAs(blob, 'config_' + "nombre_archivo.csv");
      }
    }else{
      alert("Selecciona un tipo de red");
    }

  }




}
