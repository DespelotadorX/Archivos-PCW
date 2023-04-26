'use strict'

function obtenerNav( mostrar ) // Genera la barra de navegación
{
    if( mostrar.length != 4 ) mostrar = [1,1,1,1];

    <nav class="menufijo">
    <ul>
      <li><a href="index.html" title="Inicio"><span class="icomenu1 icon-home"></span><span class="iconos">Inicio</span></a></li>
      <li><a href="buscar.html" title="Buscar"><span class="icomenu1 icon-search"></span><span class="iconos">Buscar</span></a></li>
      <li><a href="nueva.html" title="Nueva"><span class="icomenu1 icon-new"></span><span class="iconos">Nueva</span></a></li>
      <li><a href="login.html" title="Iniciar sesi&oacute;n"><span class="icomenu1 icon-login"></span><span class="iconos">Iniciar sesi&oacute;n</span></a></li>
      <li><a href="index.html" title="Cerrar sesi&oacute;n"><span class="icomenu1 icon-logout"></span><span class="iconos">Cerrar sesi&oacute;n</span></a></li>
      <li><a href="registro.html" title="Registrarse"><span class="icomenu1 icon-register"></span><span class="iconos">Registrarse</span></a></li>
  </ul>
  </nav>



    
    // MOSTRAR: Inicio, Buscar, Login/Nueva, Registro/Cerrar sesión

    // Opciones comunes para todos los usuarios
    let inicio = ( mostrar[0] ) ? '<li><a href="index.html" title="Inicio"><span class="icomenu1 icon-home"></span><span class="iconos">Inicio</span></a></li>'    : '',
        buscar = ( mostrar[1] ) ? ' <li><a href="buscar.html" title="Buscar"><span class="icomenu1 icon-search"></span><span class="iconos">Buscar</span></a></li>' : '',
        tercera = '', cuarta = '';

    if( sessionStorage['sesion'] ) // Opciones para usuarios logueados
    {
        let infoUsuario = JSON.parse( sessionStorage['sesion'] );

        if( mostrar[2] ) tercera = '<li><a href="nueva.html" title="Nueva"><span class="icomenu1 icon-new"></span><span class="iconos">Nueva</span></a></li>';
        if( mostrar[3] ) cuarta  = '<li><a class="infoLogoutA" onclick="cerrarSesion();" title="Cerrar sesi&oacute;n"><span class="ico icon-logout"></span><span class="navt">Cerrar sesi&oacute;n<span class="infoLogout"><img class="fotoUsuarioNav" src="fotos/usuarios/' + infoUsuario.foto + '" alt="Foto de perfil de ' + infoUsuario.nombre + '" > <i>(' + infoUsuario.login + ')</i></span></span></a></li>';
    }

    else // Opciones para usuarios no logueados
    {
        if( mostrar[2] ) tercera = '<li><a href="login.html" title="Iniciar sesi&oacute;n"><span class="icomenu1 icon-login"></span><span class="iconos">Iniciar sesi&oacute;n</span></a></li>';
        if( mostrar[3] ) cuarta  = '<li><a href="registro.html" title="Registrarse"><span class="icomenu1 icon-register"></span><span class="iconos">Registrarse</span></a></li>';
    }

    let htmlNav = '<ul>' + inicio + buscar + tercera + cuarta;

    // Cerrar tags html
    let htmlDefNav = htmlNav + '</ul>',
        htmlColNav =
       `<div>
        <label for="showMenu" class="desplegable icon-menu" title="Men&uacute; desplegable"></label>
        <input type="checkbox" id="showMenu">`
        + htmlNav + '</ul></div>';

    document.getElementById( 'defnav' ).innerHTML = htmlDefNav;
    document.getElementById( 'colnav' ).innerHTML = htmlColNav;
}



function mostrarImagen( entrada )
{
    let img = entrada.parentNode.querySelector('img');
    let fr = new FileReader();

    if( !img || !entrada || !entrada.files[0] ) return false;

    fr.onload = function()
    {
        img.src = fr.result;

        let caption =
        `${entrada.files[0].name}&nbsp;(${img.width}x${img.height},
        ${(entrada.files[0].size/1000).toFixed(2)}&nbsp;kB)`;

        entrada.parentNode.querySelector('figcaption').innerHTML = caption;

        return true;
    };

    fr.readAsDataURL( entrada.files[0] );
}



function subirFoto()
{
    // Obtiene los campos con información clonable y la galería
    let fotos      = document.getElementById('fotografias'),
        fotoASubir = document.getElementById('fotoASubir'),
        textoFoto  = document.getElementById('textoFoto'),
    // Crea una nueva figura con la información y la añade al final de la galería
        fig =
        `<div class="foto2">
            <img src="${fotoASubir.src}" alt="Foto de la publicación">
            <p>${textoFoto.value}</p>
            <input type="text" class="fotoSubida" value="${textoFoto.value}" name="texto">
        </div>`;

    fotos.insertAdjacentHTML( 'beforeend' , fig );

    // Añade un nuevo campo invisible para seleccionar fotos y ajusta los labels
    let fichero    = document.getElementById( 'subeFoto' ).lastElementChild,
        no         = parseInt( fichero.getAttribute( 'id' )[7] ) + 1,
        nuevoId    = `fichero${no}`,
        campoInput = `<input type="file" accept="image/*" id="${nuevoId}" class="fichero" name="fichero" onchange="mostrarImagen( this ); botonSubirFoto();">`;

    fichero.parentNode.insertAdjacentHTML( 'beforeend' , campoInput );

    document.getElementById( 'ficheropreview' ).setAttribute( 'for' , nuevoId );
         document.getElementById( 'submitpfp' ).setAttribute( 'for' , nuevoId );
}


function botonSubirFoto()
{
    let btnAnadirFoto = document.getElementById('anadirFoto'),
        imagenSubida  = document.getElementById('fotoASubir'),
        textoFoto     = document.getElementById('textoFoto'),
        activado = ( btnAnadirFoto.disabled ) ? false : true;

    if( imagenSubida &&
        imagenSubida.src.split('/').pop() !== "picdef.png" &&
        textoFoto && textoFoto.value.length > 0 &&
        textoFoto.value.length < 150 )
    {
        if( !activado )
        {
            btnAnadirFoto.classList.replace( 'enviarBloqueado' , 'enviar' );
            btnAnadirFoto.disabled = false;
        }
    }

    else
    {
        if( activado )
        {
            btnAnadirFoto.classList.replace( 'enviar' , 'enviarBloqueado' );
            btnAnadirFoto.disabled = true;
        }
    }
}


function enviarRuta( formulario )
{
    if( !formulario ) return false; // debe haber formulario

    let fd = new FormData( formulario ), // obtiene la información de la ruta
        titulo = fd.get('titulo'),
        descripcion = fd.get('descripcion'),
        ubicacion = fd.get('ubicacion'),
        fotosSubidas = fd.getAll('fichero');

    if( titulo.length > 0 && titulo.length <= 150 && // comprueba todos los campos
        descripcion.length > 0 && descripcion.length <= 300 &&
        textoFotos.length > 0 )
    {
        if( !sessionStorage['sesion'] ) return false;

        let xhr = new XMLHttpRequest(),
            url = 'api/rutas',

            usuario = JSON.parse( sessionStorage['sesion'] ),
            clave = usuario.login + ':' + usuario.token,

            infoRuta = new FormData(); // construye un formulario sólo con la información
            infoRuta.append( 'titulo' , titulo );
            infoRuta.append( 'descripcion' , descripcion );
            infoRuta.append( 'ubicación' , ubicación );

        xhr.open( 'POST' , url , true );

        xhr.onload = function()
        {
            let r = JSON.parse( xhr.responseText );
            if( r.RESULTADO == 'OK') // si se guarda correctamente, procede con las fotos
            {
                document.getElementById('limpiarFormularioNueva').click();
                document.getElementById('clearpfp').click();

                let url2 = `api/publicaciones/${r.ID}/foto`,
                    fotografias = document.getElementById('fotografias').getElementsByTagName('figure'),
                    cont = 0;

                for( let i = 0 ; i < textoFotos.length ; ++i )
                {
                    let xhr2 = new XMLHttpRequest(),
                        nuevaFoto = new FormData();

                    nuevaFoto.append( 'fichero' , fotosSubidas[i] );
                    nuevaFoto.append( 'texto' , textoFotos[i] );

                    xhr2.open( 'POST' , url2 , true );

                    xhr2.onload = function()
                    {
                        let r2 = JSON.parse( xhr2.responseText );
                        if( r2.RESULTADO == 'OK' )
                        {
                            fotografias[i].style.backgroundColor = '#d0f0c0';
                            ++cont;
                        }
                        else
                        {
                            fotografias[i].style.backgroundColor = '#ff91a4';
                            console.log( r2.DESCRIPCION ); // sale si la foto no se guarda correctamente
                            mensaje( 7 );
                            return false;
                        }
                    };

                    xhr2.onerror = function(){ console.log('ERROR'); }

                    xhr2.setRequestHeader( 'Authorization' , clave );

                    xhr2.send( nuevaFoto );
                }

                let idInterval = setInterval(
                    function()
                    {
                        if( cont == textoFotos.length ) clearInterval( idInterval );
                    },500);

                sessionStorage['nuevaPublicacion'] = nombre;
                mensaje( 4 );
            }
            else
            {
                console.log( r.DESCRIPCION );
                mensaje( 7 );
                return false;
            }
        };

        xhr.onerror = function() { console.log('ERROR'); }

        xhr.setRequestHeader( 'Authorization' , clave );

        xhr.send( infoRuta );
    }
    else mensaje( 7 );

    return false;
}


function clearPfp()
{
    document.getElementById('pfp').value = "";
    document.getElementById('mostrarPfp').src = 'img/usrdef.png';
    document.getElementById('pfpreviewCaption').innerHTML = '';
}

function clearPic()
{
    document.getElementById('textoFoto').value = "";
    document.getElementById('fotoASubir').src = 'img/picdef.png';
    document.getElementById('infoFoto').innerHTML = '';
    document.getElementById('subeFoto').lastElementChild.value = '';
}

function redirigirUsuarioLogueado( login ) // Redirige a usuarios logueados o sin loguear a la página de inicio
{ if( Boolean( sessionStorage['sesion'] ) == login ) window.location.href = 'index.html'; }



function obtenerPie()
{
    document.body.lastElementChild.innerHTML =
    `<div class="f1">&copy; <strong>PCW</strong> <time datetime="2021">2021</time></div>
    <div class="f2"><strong>Pr&aacute;ctica 2</strong></div>
    <div class="f3"><a class="f3" href="acerca.html">Contacto</a></div>`;
}


function obtenerUbicaciones()
{
    fetch('api/zonas')
  .then(response => response.json())
  .then(data => {
    // aquí puedes procesar los datos recibidos
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
}