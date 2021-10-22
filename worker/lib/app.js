import { Router } from 'itty-router'
import { randomBytes } from 'crypto'
import { success, notFound, failed } from './helpers'
import countries from './countries'


export const appRouter = Router()



/** get original link by id */
appRouter.get('/', async (req) => {

    return success({
        message: 'welcome!'
    })
})


/** get original link by id */
appRouter.get('/link/:id', async (req) => {
    const linkId = req.params.id
    const originalLinksString = await KV_SHORTID_2.get(`link:${linkId}`)

    if(!originalLinksString) return failed({
        message: 'link not found!'
    }, 404)
    console.log('originalLinksString',originalLinksString)
    let originalLinks = null;
    try {
        originalLinks = JSON.parse(originalLinksString)
    } catch (error) {
        return failed({ message: error.message })
    }

    const country = req.cf && req.cf.country ? req.cf.country : 'global'

    const originalLink = originalLinks[country] || originalLinks['global']

    if(originalLink){
        return Response.redirect(originalLink.url)
    }


    return failed({
        country,
        originalLinks,
        message: 'redirect failed!'
    })
})

/** create new shortlink */
appRouter.post('/link/create', async (req) => {
    const content = await req.json()

    const linkId = randomBytes(4).toString('hex')
    await KV_SHORTID_2.put(`link:${linkId}`, JSON.stringify(content))
    return success({
        linkId
    })
})

/** create new shortlink */
appRouter.get('/countries', async (req) => {

    return success({
        list: countries
    })
})

appRouter.options('*', async () => {

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
    })

})

appRouter.all('*', notFound)
