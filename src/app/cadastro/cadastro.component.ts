import { Component, OnInit, inject } from '@angular/core';

import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [
    
    MatCardModule,
    MatFormFieldModule, 
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
    MatSelectModule,
    CommonModule
  ], providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})

export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snackbar: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(private service: ClienteService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ) {

}

 ngOnInit(): void {
  this.route.queryParamMap.subscribe(query => {
    const id = query.get('id');

    if (id) {
      const clienteEncontrado = this.service.buscarClientePorId(id);

      if (clienteEncontrado) {
        this.atualizando = true;
        this.cliente = clienteEncontrado;
      }
    } else {
      this.atualizando = false;
      this.cliente = Cliente.newCliente();
     
    }
  });

  this.carregarUFs();

}

carregarUFs(){
  // Observable  subscriber
  this.brasilApiService.listarUFs().subscribe({
    next: listaEstados => this.estados = listaEstados,
    error: erro => console.log("ocorrreu um erro: ", erro)
  });

  console.log("Passou aqui depois da Api")
  
}

carregarMunicipios(event: MatSelectChange) {
  
  const ufSelecionada = event.value;
  this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
    next: listaMunicipios => this.municipios = listaMunicipios,
    error: erro => console.log("Ocorreu um erro: ", erro)
  })

}

  salvar() {
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Usuário salvo com sucesso!')
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta'])
      
    }
  }

  cancelar(){
    this.router.navigate(['/consulta'])
  }

  mostrarMensagem(mensagem: string){
    this.snackbar.open(mensagem, "Ok", {
      duration: 3000
    }); 
  }
}
