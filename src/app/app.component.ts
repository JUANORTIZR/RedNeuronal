import { Component, OnInit } from '@angular/core';

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
  funcionDeActivacion: string = "";

  listaFuncionesActivacion: string[] = [];
  algoritmoDeEntrenamiento: string;


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
    console.log(vectorDeUmbrales);
    console.log(matrizDePesos);
  }

  generarValoresAleatorios(menor: number, mayor: number) {
    return Number((Math.random() * (mayor - menor) + menor).toFixed(2));
  }


  getTipoRed(datos) {
    this.tipoRed = datos.target.value;
    if (this.tipoRed === "Unicapa") {
      this.inicializarMatrizPesosVectorUmbrales();
    }
  }

  getTipoRedF(datos) {
    this.tipoRed = datos.target.value;
    if (this.tipoRed === "BACKPROPAGATION") {
      this.listaFuncionesActivacion = ["SIGMOIDE", "TANGENTE HIPERBOLICA"];
      this.algoritmoDeEntrenamiento = "PROPAGACION INVERSA";
    }
    if (this.tipoRed === "PERCEPTRON") {
      this.listaFuncionesActivacion = ["ESCALON"]
      this.algoritmoDeEntrenamiento = "REGLA DELTA";
    } else {
      this.listaFuncionesActivacion = ["LINEAL"];
      this.algoritmoDeEntrenamiento = "REGLA DELTA";
    }
  }

  getFuncionDeActivacion(datos) {
    this.funcionDeActivacion = datos.target.value;
    console.log(this.funcionDeActivacion);
    if (this.funcionDeActivacion === "ESCALON") {
      this.escalon();
    }
    if (this.funcionDeActivacion === "LINEAL") {
      this.lineal();
    }

  }
  
  lineal() {
    throw new Error('Method not implemented.');
  }
  escalon() {
    throw new Error('Method not implemented.');
  }




}
