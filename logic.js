
var idf = ""


async function compute ( ) {
    try {
        if ( idf === "" ) {
            throw "An IDF file should be selected"
        }

        setModalVisibilityTo( false )

        const runnerSettings =
            createRunnerSettings( )

        // logs
        const logs =
            await request( runnerSettings )

        // output
        runnerSettings.idf19.serveLog = false
        const output =
            await request( runnerSettings )
        console.log( output )

        // do things in the end
        setHTMLToView( logs )
        downloadOutput( output )

        // download output
        setModalVisibilityTo( true )


    } catch ( error ) {
        setModalVisibilityTo( true )

        if ( typeof error === "string" ) {
            alert ( error )
        } else if ( error instanceof Error ) {
            alert ( error.message )
        } else {
            alert ( "Unknown Error. Check logs." )
        }
        console.error( error )
    }
}


window.onload = function ( ) {
    registerFileMonitor( )
}


function request ( runnerSettings ) {
    const api =
        ( getValue( "api" )  === "production"
            ? "https://idf19-server.kary.us"
            : "https://idf19-server-dev.kary.us"
            )
    return new Promise ( ( resolve, reject ) => {
        axios.post( api, runnerSettings )
            .then( response => {
                resolve( response.data )
            })
            .catch( reject )
    })
}


function downloadOutput ( output ) {
    var element = document.createElement( 'a' )
    element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( output ) )
    element.setAttribute( 'download', "reference.19.idf" )

    element.style.display = 'none';
    document.body.appendChild( element )

    element.click( )

    document.body.removeChild( element )
}

function setHTMLToView ( resultHTML ) {
    document.getElementById( "result-view" ).src =
        `data:text/html;charset=utf-8,${ encodeURIComponent ( resultHTML )}`
}


function setModalVisibilityTo ( status ) {
    document.getElementById( "compiling-modal" ).hidden = status
}

function getValue ( id ) {
    return document.getElementById( id ).value
}

function createRunnerSettings ( ) {
    const energyNeed =
        getValue( "energy-need" )
    const ec =
        getValue( "ec" )
    const buildingGroupType =
        parseInt( getValue( "group" ) )
    const removeGlazing =
        getValue( "glazing" ) === "Remove"

    return {
        idf19: {
            idf, ec, buildingGroupType, removeGlazing, energyNeed,
            serveLog: true
        }
    }
}


function registerFileMonitor ( ) {
    document.getElementById( 'idf' ).addEventListener( 'change', getIDF )

    function getIDF ( ) {
        var files = this.files
        if ( files.length === 0 ) {
            return
        }

        var reader = new FileReader( )

        reader.onload = function ( event ) {
            idf = event.target.result
        }

        reader.readAsText( files[ 0 ] )
    }
}
