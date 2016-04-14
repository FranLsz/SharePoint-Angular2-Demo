import {Alumno}                 from '../models/alumno'
import {AlumnoService}          from '../services/alumno.service'
import {Component, OnInit}      from 'angular2/core'

@Component({
    selector: 'app',
    templateUrl: BASE_URL + '/templates/app.template.html',
    providers: [AlumnoService]
})

export class AppComponent {

    public alumno: Alumno;
    public listaAlumnos: Alumno[];
    public accionForm: string;

    constructor(private _alumnoService: AlumnoService) {
        this.alumno = new Alumno();
        this.listaAlumnos = [];
        this.accionForm = "Nuevo";
    }

    public ngOnInit() {
        this.getAlumnos();
    }

    // Get alumnos
    public getAlumnos() {
        this._alumnoService.getAlumnos().subscribe(
            data => {
                this.listaAlumnos = Alumno.fromJsonList(data.d.results);
            },
            err => { console.log("GET Alumnos Error: " + err._body); }
        );
    }

    // Guardar alumno
    public guardarAlumno() {

        if (this.accionForm == "Nuevo") {
            this._alumnoService.addAlumno(this.alumno).subscribe(
                data => {
                    this.listaAlumnos.push(Alumno.fromJson(data.d));
                    this.alumno = new Alumno();
                },
                err => { console.log("POST Alumnos Error: " + err._body); }
            );
        }
        else if (this.accionForm == "Editar") {
            this._alumnoService.putAlumno(this.alumno).subscribe(
                data => {
                    this.accionForm = "Nuevo";
                    this.alumno = new Alumno();
                },
                err => { console.log("PUT Alumnos Error: " + err._body); }
            );
        }

    }

    // Editar alumno
    public editarAlumno(alumno: Alumno) {
        this.alumno = alumno;
        this.accionForm = "Editar";
    }

    // Borrar alumno
    public borrarAlumno(alumno: Alumno) {
        if (this.accionForm == "Editar" && this.alumno.id == alumno.id)
            this.alumno = new Alumno();

        this._alumnoService.deleteAlumno(alumno).subscribe(
            data => {
                var i = this.listaAlumnos.map(function (e) { return e.id; }).indexOf(alumno.id);
                this.listaAlumnos.splice(i, 1);
            },
            err => { console.log("DELETE Alumnos Error: " + err._body); }
        );
    }
}