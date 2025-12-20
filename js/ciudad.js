class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = null;
        this.centro = null;
    }

    rellenar(poblacion, centro) {
        this.poblacion = poblacion;
        this.centro = centro;
    }

    getNombre() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.nombre;
        document.body.appendChild(mensaje);
    }

    getPais() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.pais;
        document.body.appendChild(mensaje);
    }

    getInfo() {
        const mensaje = document.createElement("ul");

        const item1 = document.createElement("li");
        item1.textContent = this.gentilicio;
        mensaje.appendChild(item1);

        const item2 = document.createElement("li");
        item2.textContent = this.poblacion;
        mensaje.appendChild(item2);

        document.body.appendChild(mensaje);
    }


    getCentro() {
        const mensaje = document.createElement("p");
        mensaje.textContent = this.centro;
        document.body.appendChild(mensaje);
    }

    getMeteorologiaCarrera() {
        const lat = 14.99;
        const lon = 103.08;

        const fecha = "2024-10-27";

        const url = "https://archive-api.open-meteo.com/v1/archive";

        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: fecha,
                end_date: fecha,
                hourly: "temperature_2m,apparent_temperature,relativehumidity_2m,rain,windspeed_10m,winddirection_10m",
                daily: "sunrise,sunset",
                timezone: "Asia/Bangkok"
            }
        }).catch(function (err) {
            console.error("Error al obtener la meteorología:", err);
        });
    }

    procesarJSONCarrera(json) {
        let procesado = {
            fecha: json.hourly.time[0].slice(0, 10),
            sol: {
                amanecer: json.daily.sunrise[0],
                anochecer: json.daily.sunset[0]
            },
            horas: []
        };

        for (let i = 0; i < json.hourly.time.length; i++) {
            procesado.horas.push({
                hora: json.hourly.time[i],
                temperatura: json.hourly.temperature_2m[i],
                sensacion: json.hourly.apparent_temperature[i],
                humedad: json.hourly.relativehumidity_2m[i],
                lluvia: json.hourly.rain[i],
                viento_velocidad: json.hourly.windspeed_10m[i],
                viento_direccion: json.hourly.winddirection_10m[i]
            });
        }

        return procesado;
    }

    mostrarMeteorologiaCarrera() {
        this.getMeteorologiaCarrera()
            .then(jsonOriginal => {
                const jsonProcesado = this.procesarJSONCarrera(jsonOriginal);

                // Función para formatear horas a HH:MM
                const formatoHora = (isoString) => {
                    const fecha = new Date(isoString + "Z"); // 'Z' para UTC
                    const horaLocal = fecha.getUTCHours() + 7; // Asia/Bangkok UTC+7
                    const horaEn24 = (horaLocal >= 24) ? horaLocal - 24 : horaLocal;
                    const minutos = fecha.getUTCMinutes().toString().padStart(2, "0");
                    return `${horaEn24.toString().padStart(2, "0")}:${minutos}`;
                }

                // Mostrar datos diarios (amanecer y anochecer)
                const tituloDiarios = document.createElement("h3");
                tituloDiarios.textContent = "Datos diarios de la carrera";
                document.body.appendChild(tituloDiarios);

                const amanecer = document.createElement("p");
                amanecer.textContent = `Amanecer: ${formatoHora(jsonProcesado.sol.amanecer)}`;
                document.body.appendChild(amanecer);

                const anochecer = document.createElement("p");
                anochecer.textContent = `Anochecer: ${formatoHora(jsonProcesado.sol.anochecer)}`;
                document.body.appendChild(anochecer);

                // Definir franja horaria de la carrera
                const horaInicio = 14;
                const horaFin = 16;

                // Mostrar datos por hora solo dentro de la franja
                const tituloHoraria = document.createElement("h3");
                tituloHoraria.textContent = "Datos por franja horaria (14:00-16:00)";
                document.body.appendChild(tituloHoraria);

                jsonProcesado.horas.forEach(hora => {
                    const fechaHora = new Date(hora.hora + "Z");
                    let horaLocal = fechaHora.getUTCHours() + 7;
                    horaLocal = (horaLocal >= 24) ? horaLocal - 24 : horaLocal;

                    if (horaLocal >= horaInicio && horaLocal <= horaFin) {
                        const p = document.createElement("p");
                        p.textContent = `Hora: ${formatoHora(hora.hora)}, Temp: ${hora.temperatura}°C, Sensación: ${hora.sensacion}°C, Humedad: ${hora.humedad}%, Lluvia: ${hora.lluvia}mm, Viento: ${hora.viento_velocidad}m/s (${hora.viento_direccion}°)`;
                        document.body.appendChild(p);
                    }
                });
            })
            .catch(err => console.error("Error al mostrar meteorología:", err));
    }

    getMeteorologiaEntrenos() {
        const lat = 14.99;
        const lon = 103.08;

        const start_date = "2024-10-24";
        const end_date = "2024-10-26";

        const url = "https://archive-api.open-meteo.com/v1/archive";

        return $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                latitude: lat,
                longitude: lon,
                start_date: start_date,
                end_date: end_date,
                hourly: "temperature_2m,rain,windspeed_10m,relativehumidity_2m",
                timezone: "Asia/Bangkok"
            }
        }).catch(err => console.error("Error al obtener meteorología de entrenamientos:", err));
    }

    procesarJSONEntrenos(json) {
        let procesado = [];

        const times = json.hourly.time;
        const temps = json.hourly.temperature_2m;
        const rains = json.hourly.rain;
        const vientos = json.hourly.windspeed_10m;
        const humeds = json.hourly.relativehumidity_2m;

        let dias = {};
        for (let i = 0; i < times.length; i++) {
            const dia = times[i].slice(0, 10);
            if (!dias[dia]) {
                dias[dia] = { temp: [], lluvia: [], viento: [], humedad: [] };
            }
            dias[dia].temp.push(temps[i]);
            dias[dia].lluvia.push(rains[i]);
            dias[dia].viento.push(vientos[i]);
            dias[dia].humedad.push(humeds[i]);
        }

        for (let dia in dias) {
            const d = dias[dia];
            const media = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);

            procesado.push({
                fecha: dia,
                temperatura: media(d.temp),
                lluvia: media(d.lluvia),
                viento: media(d.viento),
                humedad: media(d.humedad)
            });
        }

        return procesado;
    }

    mostrarMeteorologiaEntrenos() {
        this.getMeteorologiaEntrenos()
            .then(jsonOriginal => {
                const datosProcesados = this.procesarJSONEntrenos(jsonOriginal);

                const h3 = document.createElement("h3");
                h3.textContent = "Medias meteorológicas de los entrenamientos";
                document.body.appendChild(h3);

                datosProcesados.forEach(dia => {
                    const p = document.createElement("p");
                    p.textContent = `Día: ${dia.fecha}, Temp media: ${dia.temperatura}°C, Lluvia media: ${dia.lluvia}mm, Viento medio: ${dia.viento}m/s, Humedad media: ${dia.humedad}%`;
                    document.body.appendChild(p);
                });
            })
            .catch(err => console.error("Error al mostrar meteorología de entrenamientos:", err));
    }

}