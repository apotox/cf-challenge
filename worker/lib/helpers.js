export const success = (entity = {}, statusCode = 200) => {
    return new Response(JSON.stringify({success: true, ...entity}), {
        status: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'Access-Control-Allow-Credentials': 'true'
        }
    })
}

export const failed = (entity = {}, statusCode = 400) => {
    return new Response(JSON.stringify({success: false, ...entity}), {
        status: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json',
            'Access-Control-Allow-Credentials': 'true'
        }
    })
}

export const notFound = ()=> new Response('Not Found.', { status: 404 , headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
} })
