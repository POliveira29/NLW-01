import React from 'react'
import { FiLogIn } from 'react-icons/fi' // Icones react
import { Link } from 'react-router-dom' // Conceito de SPA(Sigle Page Application) Faz com que a aplicação não carregue do zero, carregando somente o conteudo principal

import './styles.css'
import logo from '../../assets/logo.svg'

const Home = () =>{
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>

                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/create-point">
                        <span><FiLogIn /></span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home