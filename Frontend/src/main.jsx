import { StrictMode } from 'react' //importa o strictmode do react para ajudar a identificar problemas no aplicativo durante o desenvolvimento
import { createRoot } from 'react-dom/client' //importa a função createRoot do react-dom/client para criar a raiz do aplicativo React
import './index.css'//importa o arquivo de estilo index.css para aplicar estilos globais ao aplicativo
import App from './App.jsx' //importa o componente App do arquivo App.jsx, que é o componente principal do aplicativo

createRoot(document.getElementById('root')).render( 
  <StrictMode>
    <App />
  </StrictMode>,
)/*cria a raiz do aplicativo React no elemento com o id 'root' e renderiza o componente App dentro do StrictMode, 
que ajuda a identificar problemas no aplicativo durante o desenvolvimento*/
