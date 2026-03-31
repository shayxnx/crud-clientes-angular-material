import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
   
  static REPO_CLIENTES = "_CLIENTES";

  salvar(cliente: Cliente) {
    console.log(cliente);
    const storage = this.obterStorage();
    storage.push(cliente);

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  

  atualizar(cliente: Cliente) {
    const storage = this.obterStorage();
    storage.forEach( c => {
      if(c.id === cliente.id){
        Object.assign(c, cliente);
        alert("Cliente atualizado com sucesso!");
      }
    });  

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  pesquisarClientes(nomeBusca: string)  : Cliente[]{
    
    const clientes = this.obterStorage();
    if (!nomeBusca){
      return clientes;
    }
    // cliente.nome : Maria Julia
    // nomeBusca: Maria
    // se tem um nome, não vai ser -1 e vai retornar o cliente, caso contrário, vai ser -1 e não vai retornar o cliente
   return clientes.filter(cliente =>
    cliente.nome?.toLowerCase().startsWith(nomeBusca.toLowerCase())
    );
  }

  buscarClientePorId(id: string) : Cliente | undefined{
    const clientes = this.obterStorage();
    return clientes.find( cliente => cliente.id === id);
  }
  
  editar(colunasTable: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email']) {
      colunasTable.push('editar');
  }

  deletar(cliente: Cliente){
    const storage = this.obterStorage();
    
    const novaLista= storage.filter( c => c.id !== cliente.id);

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista));
  }

  obterStorage() : Cliente[] {
    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if (repositorioClientes) {
      const clientes: Cliente[] = JSON.parse(repositorioClientes);
      return clientes;
    }
    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
    return clientes;
  }
}
