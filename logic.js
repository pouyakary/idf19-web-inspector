
var idf = ""


async function compute ( ) {
    try {
        if ( idf === "" ) {
            throw "An IDF file should be selected"
        }

        setModalVisibilityTo( false )

        const runnerSettings =
            createRunnerSettings( )
        const result =
            await request( runnerSettings )

        setHTMLToView( result )

        setModalVisibilityTo( true )


    } catch ( error ) {
        setModalVisibilityTo( true )

        if ( typeof error === "string" ) {
            alert ( error )
        } else if ( error instanceof Error ) {
            alert ( error.message )
        } else {
            alert ( "Unknown Error. Check logs." )
            console.error( error )
        }
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
