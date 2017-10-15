import React,{Component} from 'react';
import $ from 'jquery';
import InputCustomizado from "./componentes/InputCustomizado";
import ButtonCustomizado from "./componentes/ButtonCustomizado";
import SelectCustomizado from "./componentes/SelectCustomizado";
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';
import autor from './autor';

class FormularioLivro extends Component {
  constructor(){
    super();
    this.state = {titulo:'',preco:'',autorId:''};
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();
    $.ajax({
      url: "https://cdc-react.herokuapp.com/api/livros",
      contentType: "application/JSON",
      dataType: "JSON",
      type: "POST",
      data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
      success: function(resposta){
      PubSub.publish("atualiza-lista-livros",resposta);
      this.setState({titulo:"",preco:"",autorId:""});

      }.bind(this),
      error: function(resposta){
        if(resposta.status === 400) {
         new TratadorErros().publicaErros(resposta.responseJSON);
       }
      },
      beforeSend: function(){
        PubSub.publish("limpa-erros",{});
      }

    });
    return false;

  }


  salvaAlteracao(nomeInput,evento){
    var campo = [];
    campo[nomeInput] = evento.target.value;
    this.setState(campo);
  }

  render(){
    var autores = this.props.autores.map(function(autor){
      return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
    });
    return(

      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post" action="">
             <InputCustomizado id="titulo" name="titulo" type="text" label="Titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this,'titulo')} />
             <InputCustomizado id="preco" name="preco" type="number" label="Preço" value={this.state.preco} onChange={this.salvaAlteracao.bind(this,'preco')} />
              <SelectCustomizado name="autorId" id="autorId" onChange={this.salvaAlteracao.bind(this,'autorId')} value={this.state.autorId} options={autores} />
             <ButtonCustomizado nome="Gravar"/>
        </form>
      </div>
    );
  }
}

class TabelaLivros extends Component{
  render(){
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Preço</th>
              <th>Autor</th>

            </tr>
          </thead>
          <tbody>
           {
             this.props.lista.map(function(livro){
               return (
                 <tr key={ livro.id }>
                 <td> { livro.titulo } </td>
                 <td> { livro.preco } </td>
                 <td> { livro.autor.nome } </td>

                 </tr>
               );
             })
           }
          </tbody>
        </table>
      </div>
    );
  }
}

export default class LivroBox extends Component{
  constructor(props){
    super();
    this.state = {lista: [], autores: []};
  }

  componentDidMount(){
    $.ajax({
      url: "https://cdc-react.herokuapp.com/api/livros",
      dataType: "JSON",
      success:function(data){
        this.setState({lista : data});
        console.log(data);
      }.bind(this)
    });

    $.ajax({
     url: "https://cdc-react.herokuapp.com/api/autores",
     dataType: 'json',
     success: function(data) {
       this.setState({autores: data});
     }.bind(this)
   });

    PubSub.subscribe('atualiza-lista-livros',function(topico,novaLista){
      this.setState({lista:novaLista});
    }.bind(this));
  }

  render(){
    return (
      <div>
       <div className="header">
         <h1>Cadastro de Livros</h1>
       </div>
       <div className="content" id="content">
         <FormularioLivro autores={this.state.autores}/>
         <TabelaLivros lista={this.state.lista}/>
       </div>
     </div>
    );
  }

}
