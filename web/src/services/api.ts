import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3333'
})


export default api
//Fetch: API nativa do navegador para fazer requisições