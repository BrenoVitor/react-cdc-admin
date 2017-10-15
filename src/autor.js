import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from "./componentes/InputCustomizado";
import ButtonCustomizado from "./componentes/ButtonCustomizado";
import PubSub from 'pubsub-js';
import TratadorErros from  './TratadorErros';

class FormularioAutor extends Component {
  constructor(){
    super();
    this.state = {nome:'',email:'',senha:''};
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento){
    evento.preventDefault();
    $.ajax({
      url: "https://cdc-react.herokuapp.com/api/autores",
      contentType: "application/JSON",
      dataType: "JSON",
      type: "POST",
      data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
      success: function(resposta){
      PubSub.publish("atualiza-lista-autores",resposta);
      this.setState({nome:"",email:"",senha:""});

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
    return(

      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post" action="">
             <InputCustomizado id="nome" name="nome" type="text" label="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} />
             <InputCustomizado id="email" name="email" type="email" label="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} />
             <InputCustomizado id="senha" name="senha" type="password" label="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} />
             <ButtonCustomizado nome="Gravar"/>
        </form>
      </div>
    );
  }
}

class TabelaAutores extends Component{
  render(){
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
           {
             this.props.lista.map(function(autor){
               return (
                 <tr key={ autor.id }>
                 <td> { autor.nome } </td>
                 <td> { autor.email } </td>
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

export default class AutorBox extends Component{
  constructor(){
    super();
    this.state = {lista: []};
  }

  componentDidMount(){
    $.ajax({
      url: "https://cdc-react.herokuapp.com/api/autores",
      dataType: "JSON",
      success:function(data){
        this.setState({lista : data});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lista-autores',function(topico,novaLista){
      this.setState({lista:novaLista});
    }.bind(this));
  }

  render(){
    return (
      <div>
       <div className="header">
         <h1>Cadastro de autores</h1>
       </div>
       <div className="content" id="content">
         <FormularioAutor/>
         <TabelaAutores lista={this.state.lista}/>
       </div>
     </div>
    );
  }

}
