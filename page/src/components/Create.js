import React, { useEffect, useMemo, useState } from 'react'
import { Button, Container, FormGroup, Input, Label } from 'reactstrap'
import Axios from 'axios'

const baseURL = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_CF_DEV : process.env.REACT_APP_CF_WORKER
const apiClient = Axios.create({
    baseURL
})

function Create() {
    const [longUrl, setLongUrl] = useState('')
    const [allCountries, setAllCountries] = useState([])
    const [newTargetCountry, setNewTargetCountry] = useState('')
    const [targetCountries, setTargetCountries] = useState({})
    const [loading, setLoading] = useState(false)
    const [shortlink,setShortlink] = useState(null)
    const removeTarget = (code) => () => {
        targetCountries[code] && delete targetCountries[code];
        setTargetCountries({ ...targetCountries })
    }

    const availableCountries = useMemo(() => {
        const selected = Object.keys(targetCountries)
        return allCountries.filter(c => !selected.includes(c.code))

    }, [targetCountries, allCountries])


    useEffect(() => {
        (async () => {
            const response = await apiClient.get(`/countries`);
            setAllCountries(response.data.list)
        })()
    }, [])

    const addNewTarget = () => {
        setTargetCountries({
            ...targetCountries,
            [newTargetCountry]: {
                code: newTargetCountry,
                url: ''
            }
        })

        setNewTargetCountry('')
    }

    const updateCountryUrl = (code, url) => {
        setTargetCountries({
            ...targetCountries,
            [code]: {
                code,
                url
            }
        })
    }

    const createShortLink = () => {


        let payload = {
            ...targetCountries,
            global: {
                code: 'global',
                url: longUrl
            }
        }
        setLoading(true)
        apiClient.post('/link/create', payload)
            .then(resp => {

                setShortlink(`${baseURL}/link/${resp.data.linkId}`)

            })
            .catch(err => {

                console.log(err)
            })
            .finally(() => setLoading(false))



    }

    const isDisabled = useMemo(()=>{
        return loading || !longUrl
    }, [loading,longUrl])

    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(shortlink);
    }
    return (
        <Container style={{ maxWidth: 560 }}>

            <FormGroup >
                <Label for="longUrl"><h4>your Long url</h4></Label>
                <Input type="search"
                    style={{ backgroundColor: 'aliceblue' }}
                    value={longUrl}
                    onChange={e => setLongUrl(e.target.value)}
                    name="longUrl"
                    id="longUrl"
                    placeholder="https://"
                />
            </FormGroup>

            <ul className="urls">

                <li key={'global'}>
                    <Label for="longUrl">target url for global</Label>
                    <Input type="search"
                        value={longUrl}
                        disabled={true}
                        name="longUrl"
                        id={`long-url-global}`}
                        placeholder="https://"
                    />

                </li>
                {
                    Object.values(targetCountries).map(country => <li key={country.code}>
                        <Label for="longUrl">target url for {country.code}</Label>
                        <Input type="search"
                            value={country.url}

                            onChange={e => updateCountryUrl(country.code, e.target.value)}
                            name="longUrl"
                            id={`long-url-${country.code}`}
                            placeholder="https://"
                        />
                        <Button size="sm" color="danger" outline onClick={removeTarget(country.code)}>delete</Button>
                    </li>)
                }

                <li>
                    <FormGroup>
                        <Label for="select-country">new country url</Label>
                        <Input type="select" name="select" id="select-country" onChange={e => e.target.value && setNewTargetCountry(e.target.value)}>
                            <option key={'default'} value={''}>select a country</option>
                            {
                                availableCountries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)
                            }
                        </Input>
                    </FormGroup>
                    <Button size="sm" disabled={newTargetCountry == ''} color="success" outline onClick={addNewTarget}>add new long url</Button>
                </li>

            </ul>


            <div className='btn-container'>
                <Button disabled={isDisabled} onClick={createShortLink} size="sm" color="info" style={{ width: '100%', color: '#fff' }} >Shorten</Button>
            </div>
        
        
            {shortlink && <div className='shortlink-container'>
                 <Input type="search" value={shortlink} contentEditable={false} selected />
                 <Button size='sm' color='success' onClick={copyToClipboard}>copy</Button>
            </div>}
        
        </Container>
    )
}

export default Create
