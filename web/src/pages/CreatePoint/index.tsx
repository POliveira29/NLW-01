import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { Map, TileLayer, Marker} from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'
import $ from 'jquery'
import Dropzone from '../../components/Dropzone'

import './styles.css'
import logo from '../../assets/logo.svg'

// Sempre que se criar um array ou objeto: É preciso informar manualmente o tipo de variável
interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse{
    sigla: string
}

interface IBGECityResponse{
    nome: string
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0])
    const [selectedFile, setSelectedFile] = useState<File>()

    const history = useHistory()

    // Chamada para posição inicial do endereço
    useEffect(() => {
        // Função do navegador que retorna a localização atual
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])

    // Chamada para os items cadastrados
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    // Chamada para as UFs
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla)
            
            setUfs(ufInitials)
        })
    }, [])

    // Chamada para as cidades correspondentes a UF
    useEffect(() => {
        // Carregar as cidades toda vez que uma UF for selecionada
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)

            setCities(cityNames)
        })
    }, [selectedUF])

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value

        setSelectedUF(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value

        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target

        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id: number){
        const alreadySelected = selectedItems.findIndex(items => items === id)

        if (alreadySelected >=0) {
            const filteredItems = selectedItems.filter(items => items !== id)

            setSelectedItems(filteredItems)
        } else{
            setSelectedItems([...selectedItems, id])
        }
        
    }

    $(".submit").click(function () {
        $(".modal-message").show().delay(2000).hide(0);
      });

    async function handleSubmit(event: FormEvent){
        event.preventDefault()

        const {name, email, whatsapp} = formData
        const uf = selectedUF
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()
        
        data.append('name',name)
        data.append('email',email)
        data.append('whatsapp',whatsapp)
        data.append('uf',uf)
        data.append('city',city)
        data.append('latitude',String(latitude))
        data.append('longitude',String(longitude))
        data.append('items', items.join(','))
        
        if(selectedFile){
            data.append('image', selectedFile)
        }

        await api.post('points', data)

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                
                <Dropzone onFileUploaded={setSelectedFile} />
                
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer 
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUF} 
                                onChange={handleSelectUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                   <option key={uf} value={uf}>{uf}></option> 
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city" 
                                value={selectedCity} 
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                   <option key={city} value={city}>{city}></option> 
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione os ítens de coleta</span>
                    </legend>
                    <ul className="items-grid">
                        
                        {items.map(items => (
                            <li 
                            key={items.id} 
                            onClick={() => handleSelectItem(items.id)}
                            className={selectedItems.includes(items.id) ? 'selected' : ''}
                            >
                                <img src={items.image_url} alt={items.title}/>
                                <span>{items.title}</span>
                            </li>
                        ))}

                        
                    </ul>
                </fieldset>

                <button className="submit" type="submit">Cadastro ponto de coleta</button>
                
                <div className="modal-message">
                    <div className="modal-content">
                        <span><FiCheckCircle /></span>
                        <p>Cadastro concluído!</p>
                    </div>
                </div>
            </form>
        </div>
    )
    
}

export default CreatePoint


/**Sempre que se realizar um map(percorre o array) no react, o primeiro
 * elemento dentro desse retorno precisa ter uma propriedade obrigatória
 * que se chama key(Faz com que o react encontre o elemento quando atualizar
 *  de forma mais rapida)
 * 
 * O valor da key precisa ser um valor unico entre cada um dos items
 * que representa aquele elemento
 */