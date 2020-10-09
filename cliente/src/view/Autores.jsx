import React from 'react'

import type {Autor} from '../tipos_flow'


function Autores (props) {

    function escondeAutores() {
        return props.onEsconde()
    }

    const test = [{'teste': 'ola'}, {'teste': 'ola2'}]

    return (
    <div className='message is-link'>
          <div className='message-header'>Autores</div>

          <div className='message-body'>
            <table class="table">
                <thead>
                    <tr>
                    <th title="Numero">No.</th>
                    <th title="Nome">Nome</th>
                    <th title="Matricula">Matrícula</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    props.autores.map( (autor, i) =>
                        <tr key={i}>
                        <td>{i=1}</td>
                        <td>{autor.nome}</td>
                        <td>{autor.matricula}</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>
            <button className='button is-primary' onClick={escondeAutores}>OK</button>
        </div>
    </div>
  )
}

export default Autores
