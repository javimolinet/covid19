// funcion para grafico principal ( situacion mundial)

(async () => {
    
    const response = await fetch("http://localhost:3000/api/total");
    let { data } = await response.json();

    dataGrafico = data.filter(e => e.active > 200000)
    // llenado de datos Grafico Principal
    const barChartData = {
        labels: dataGrafico.map(e => e.location),

        datasets: [{
            label: 'Confirmados',

            backgroundColor: "yellow",
            data: dataGrafico.map(e => e.confirmed)
        }, {
            label: 'Fallecidos',

            backgroundColor: "purple",
            data: dataGrafico.map(e => e.deaths)
        },
        {
            label: 'Recuperados',

            backgroundColor: "green",
            data: dataGrafico.map(e => e.recovered),

        },
        {
            label: 'Activos',
            backgroundColor: "red",
            data: dataGrafico.map(e => e.active)
        }
        ]

    };
    const mostrarGraficaPrincipal = (barChartData) => {
        let ctx = document.getElementById('canvas').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Países con más de 200.000 contagios',
                    fontSize: 50,
                    fontColor: ' rgb(30, 30, 122)',
                    fontFamily: 'Dancing Script'
                },

                scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                          if(parseInt(value) >= 1000){
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          } else {
                            return value;
                          }
                        }
                      }
                    }]
                  }

            }
        });
    }


// tabla , a data se le implementa el metodo forEach para recorrer los datos y por medio del metodo append se le agregan los td a la tabla
    const mostrarTabla = () => {
        // tabla y modal
        data.forEach((e) => {
            // codigo para ponerle puntos Intl.NumberFormat().format()
            $('#cuerpo').append(
                ` <tr>
            <td>${e.location}</td>
            <td>${Intl.NumberFormat().format(e.confirmed)
            }</td>
            <td>${Intl.NumberFormat().format(e.deaths)
            }</td>
            <td>${Intl.NumberFormat().format(e.recovered)}</td>
            <td>${Intl.NumberFormat().format(e.active)}</td>
            <td><a href="" data-toggle="modal" data-target="#staticBackdrop" onclick="showModalGraphic('${e.location}')">Ver Detalles</a></td>
          </tr>`)
        }

        )


    }

    try {
        mostrarGraficaPrincipal(barChartData)
        mostrarTabla()
    } catch (error) {
        alert('error en la carga')
    }finally{
        $('#tablita').removeClass("d-none");
        $('#spinnersHome').addClass("d-none")
    }

})();

// para que al recargar la pagina me valide si tengo un token 
$(document).ready(function(){
    const tok = localStorage.getItem('token');
    if(tok){
       mostrarSituacionChile()
    }
    
    
})
// grafico de pie . que se encuentra en el modal al clickear ver detalles
async function showModalGraphic(country) {
    $('.modal-title').html(`${country}`)

    //desde el array se busca el pais
    var ctx = document.getElementById('chart-area').getContext('2d');
    const respuesta = await fetch(`http://localhost:3000/api/countries/${country}`)
    let dataPais = await respuesta.json();


    const activos = dataPais.data.active
    const fallecidos = dataPais.data.deaths
    const confirmados = dataPais.data.confirmed
    const recuperados = dataPais.data.recovered
    //el chart como tal
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["confirmados", "recuperados", "fallecidos", "activos"],
            datasets: [{
                label: 'casos',
                data: [confirmados, recuperados, fallecidos, activos],
                backgroundColor: ["yellow", "green", "red", "black"],
                borderColor: ["yellow", "green", "red", "black"]
            }
            ],


        },

    });
    $('#infoPie').html(`
    <ul>
    <li> Activos : ${Intl.NumberFormat().format(activos)}</li><br>
    <li> Fallecidos : ${Intl.NumberFormat().format(fallecidos)}</li><br>
    <li> Confirmados : ${Intl.NumberFormat().format(confirmados)}</li><br>
    <li> Recuperados : ${Intl.NumberFormat().format(recuperados)}</li><br>
    </ul>`)


}


// token

const postData = async (email, password) => {

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })

    const { token } = await response.json();
    return token

}
const getPostsConfirmed = async () => {

    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/confirmed',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const data = await response.json()
    return data
}
const getPostsDeaths = async () => {

    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/deaths',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const data = await response.json()
    return data
}
const getPostsRecovered = async () => {

    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/recovered',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    const data = await response.json()
    return data
}

//grafico situacion Chile
const mostrarGraficoChile = (recuperados, fallecidos, confirmados) => {

    let ctx = document.getElementById('canvasChile').getContext('2d');
    window.myBar = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fallecidos.data.map((e) => e.date),
            datasets: [{
                label: 'Recuperados',
                backgroundColor: "green",
                borderColor: "green",
                pointBorderWidth: '0',
                pointRadius: '0',


                data: recuperados.data.map((e) => e.total),
                fill: false,
            },
            {
                label: 'Fallecidos',
                backgroundColor: "red",
                borderColor: "red",
                pointBorderWidth: '0',
                pointRadius: '0',


                data: fallecidos.data.map((e) => e.total),
                fill: false,
            },
            {
                label: 'Confirmados',
                backgroundColor: "yellow",
                borderColor: "yellow",
                pointBorderWidth: '0',
                pointRadius: '0',


                data: confirmados.data.map((e) => e.total),
                fill: false,
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Situación de Chile Covid-19',
                fontSize: 50,
                fontColor: ' rgb(30, 30, 122)',
                fontFamily: 'Dancing Script'
            }

        }
    });

}


        
// evento submit para logearme, valido token y muestro grafico Chile
$("#formulario").submit(async (event) => {
    event.preventDefault()
    let correo = $("#email").val();
    let contraseña = $("#password").val(); 
    const JWT = await postData(correo, contraseña);
    localStorage.setItem('token', JWT)
    

    if (JWT) {
        mostrarSituacionChile()
        $('#exampleModal').modal('hide')
        
    }else {
        alert('Nombre de usuario o contraseña incorrecta.')
    }


    console.log(JWT);

})

// funcion para ir a situacion chile 
const mostrarSituacionChile = async ()=>{
  
    $('#inicioSesion').hide();
    $('#situacionChile').removeClass("d-none");
    $('#cierreSesion').removeClass("d-none");
    $('#canvas').hide();
    $('#tablita').hide();
    $('#canvasChile').removeClass("d-none")
    $('#spinners').removeClass("d-none")
    $('#spinnersHome').addClass("d-none")
    const recuperados = await getPostsRecovered();
    const fallecidos = await getPostsDeaths();
    const confirmados = await getPostsConfirmed();
    
    try {
        mostrarGraficoChile(recuperados, fallecidos, confirmados)

    } catch (error) {
        alert('error')

    }
    finally {
        $('#spinners').addClass("d-none")
    }

}

// evento click sobre link situación Chile , me esconde el grafico principal y la tabla , me muestra directamente el grafico de situacion Chile
$('#situacionChile').click(() => {
    $('#canvas').hide();
    $('#tablita').hide();
    $('#canvasChile').removeClass("d-none")



});

// evento click sobre link Home , me esconde el grafico de Chie y me muestra nuevamente el grafico principal y la tabla
$('#home').click(() => {
    $('#canvasChile').addClass("d-none");
    $('#canvas').show();
    $('#tablita').show();


});

// evento click sobre lin cierre Sesión , me saca lo que estaba validado por el token ( cerrar sesion, situacion Chile, grafico chile y me reacrga la pagina tal cual como estaba al principio, con el grafico principal y la tabla )
$('#cierreSesion').click(() => {
    localStorage.removeItem('token');
    location.reload();
})
    
