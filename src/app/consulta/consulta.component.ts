import { Component, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consulta',
  imports: [
    MatInputModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatTableModule,
    CommonModule
    
],
  templateUrl: './consulta.html',
  styleUrl: './consulta.scss',
})
export class ConsultaComponent {

  nomeBusca: string = '';
  listaClientes: Cliente[] = [];
  colunasTable: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email', 'acoes'];
  snackbar: MatSnackBar = inject(MatSnackBar);
 

  constructor(private service: ClienteService,
    private router: Router
  ) {

  }

  ngOnInit(){
    console.log("Passando por aqui");
    this.listaClientes = this.service.pesquisarClientes("");
  }

  pesquisar() {
    this.listaClientes = this.service.pesquisarClientes(this.nomeBusca);
  }

  preparaEditar(id: string){
    console.log("id recebido:", id);
    this.router.navigate(['/cadastro'], { queryParams: { "id": id }});
  }

  cancelarEditar(id: string){
    this.router.navigate(['/consulta']);
  }

  preparaDeletar(cliente: Cliente) {
    cliente.deletando = true;
  }

  deletar(cliente: Cliente){
    this.service.deletar(cliente);
    this.listaClientes = this.service.pesquisarClientes(this.nomeBusca);
    this.mostrarMensagem('Usuário salvo com sucesso!')
    this.mostrarMensagem('Usuário deletado com sucesso!')
  }

  cancelarDeletar(cliente: Cliente){
    console.log("cancelando")
    cliente.deletando = false;
  }

  mostrarMensagem(mensagem: string){
    this.snackbar.open(mensagem, "Ok", {
      duration: 3000
    });
  }
}
