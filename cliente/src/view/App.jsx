//@flow
import React, { useEffect, useReducer } from 'react'
import jwt from 'jsonwebtoken'

import Login from './Login.jsx'
import PublicaLembrete from './PublicaLembrete.jsx'
import MostraLembretes from './MostraLembretes.jsx'
import Autores from './Autores.jsx'

import 'bulma/css/bulma.min.css'

import type { Token, TokenDecodificado, Autor } from '../tipos_flow'

type Estado = {|
  token: Token | void,
  tokenDecodificado: TokenDecodificado | void,
  mostrandoAutores: boolean,
  autores: Array<Autor>
|}

type Acao =
  {| type: 'REGISTRE_TOKEN', token: Token, tokenDecodificado: TokenDecodificado |}
  | {| type: 'RECEBA_NOVO_TOKEN', token: Token |}
  | {| type: 'REGISTRE_USUARIO_SAIU' |}
  | {| type: 'MOSTRE_AUTORES' |}
  | {| type: 'ESCONDA_AUTORES' |}

const autor1: Autor = {nome: "João Fellipe Uller", matricula: 17102812}
const autor2: Autor = {nome: "João Gabriel Trombeta", matricula: 15200598}
const autor3: Autor = {nome: "Leonardo Kreuch", matricula: 16206390}
const autor4: Autor = {nome: "Mateus Antonio T. Lehmkuhl", matricula: 19100869}
const autor5: Autor = {nome: "Rafael Lazzaretti Madalóz", matricula: 16200658}

const estadoInicial: Estado = {
  token: undefined,
  tokenDecodificado: undefined,
  mostrandoAutores: false,
  autores: [autor1, autor2, autor3, autor4, autor5]
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
    case 'REGISTRE_TOKEN':
      return { token: acao.token, tokenDecodificado: acao.tokenDecodificado }

    case 'RECEBA_NOVO_TOKEN':

      return { token: acao.token, tokenDecodificado: jwt.decode(acao.token) }

    case 'REGISTRE_USUARIO_SAIU':
      return estadoInicial

    case 'MOSTRE_AUTORES':
      return { ...estado, mostrandoAutores: true, autores: estadoInicial.autores }

    case 'ESCONDA_AUTORES':
      return { ...estado, mostrandoAutores: false }

    default:
      throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function tokenValido(tokenDecodificado: TokenDecodificado): boolean {
  const agora: number = Date.now()
  const exp = tokenDecodificado.exp * 1000
  return agora < exp
}

// FIXME Não há nade de errado com esta aplicação. A tarefa consiste em
// colocar a aplicação na sua máquina virtual na nuvem da UFSC.

function App() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  useEffect(() => {
    let token = window.localStorage.getItem('token')
    let tokenDecodificado

    if (token === null)
      token = undefined
    else {
      tokenDecodificado = jwt.decode(token)
      if (tokenValido(tokenDecodificado))
        dispatch({ type: 'REGISTRE_TOKEN', token, tokenDecodificado })
      else
        window.localStorage.removeItem('token')
    }
  }, [])

  useEffect(() => {
    if (estado.token !== undefined) {
      window.localStorage.setItem('token', estado.token)
    }
    else {
      window.localStorage.removeItem('token')
    }
  }, [estado.token])


  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
          UFSC - CTC - INE - INE5646 :: App lembretes
        </div>

        <div className='message-body'>
          { !estado.mostrandoAutores &&
            <button className='button is-warning' onClick={() => dispatch({ type: 'MOSTRE_AUTORES' })}>Mostrar Autores</button>
          }
          { estado.mostrandoAutores &&
          <Autores
              onEsconde={() => dispatch({ type: 'ESCONDA_AUTORES' })}
              livros={[{'livro': 'livro1'}, {'livro': 'livro2'}]}
              autores={estado.autores}
          />
          }
          { !estado.mostrandoAutores &&
            <Login onToken={token => dispatch({ type: 'RECEBA_NOVO_TOKEN', token })}
              onSaiu={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })}
              token={estado.token}
              tokenDecodificado={estado.tokenDecodificado} />
          }
          {
            estado.token && !estado.mostrandoAutores &&
            <PublicaLembrete token={estado.token}
              onTokenInvalido={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })} />
          }
          {
            estado.token && !estado.mostrandoAutores &&
            <MostraLembretes token={estado.token}
              onTokenInvalido={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })} />
          }
        </div>
      </div>
    </div>
  )
}

export default App
