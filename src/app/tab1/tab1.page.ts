import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  valorEntrada!: number;
  moedasDisponiveis: string[] = [];
  moedaOrigem!: string;
  moedaDestino!: string;
  resultado: number | undefined;
  moedaDestinoSimbolo: string | undefined;
  moedasSimbolos: { [key: string]: string } = {
    USD: '$',
    AED: 'AED',
    AFN: 'Af',
    ALL: 'Lek',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: '₼',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: '₣',
    BMD: '$',
    BND: '$',
    BOB: 'Bs.',
    BRL: 'R$',
    BSD: '$',
    BTN: 'Nu.',
    BWP: 'P',
    BYN: 'Br',
    BZD: '$',
    CAD: '$',
    // Adicione os símbolos para as outras moedas
  };

  modoEscuro = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarMoedasDisponiveis();
  }

  carregarMoedasDisponiveis() {
    const apiKey = '863dd10f88a18066195ddd75';
    const apiUrl = 'https://v6.exchangerate-api.com/v6/' + apiKey + '/latest/BRL';

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.conversion_rates) {
          this.moedasDisponiveis = Object.keys(data.conversion_rates);
          this.moedaOrigem = this.moedasDisponiveis[0];
          this.moedaDestino = this.moedasDisponiveis[146];
          this.moedaDestinoSimbolo = this.getMoedaSimbolo(this.moedaDestino);
        } else {
          console.error('Resposta da API não contém as taxas de conversão esperadas.');
        }
      },
      (error) => {
        console.error('Erro ao obter lista de moedas:', error);
      }
    );
  }

  converter() {
    if (!this.moedaOrigem || !this.moedaDestino) {
      console.error('Selecione as moedas de origem e destino.');
      this.resultado = undefined;
      return;
    }

    if (this.moedaOrigem === this.moedaDestino) {
      console.error('Selecione moedas diferentes para a conversão.');
      this.resultado = undefined;
      return;
    }

    const apiKey = '863dd10f88a18066195ddd75';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${this.moedaOrigem}/${this.moedaDestino}`;

    this.http.get(apiUrl).subscribe(
      (data: any) => {
        if (data && data.conversion_rate) {
          this.resultado = this.valorEntrada * data.conversion_rate;
        } else {
          console.error('Resposta da API não contém a taxa de câmbio esperada.');
          this.resultado = undefined;
        }
      },
      (error) => {
        console.error('Erro ao obter taxa de câmbio:', error);
        this.resultado = undefined;
      }
    );
  }

  revert() {
    const tempMoedaOrigem = this.moedaOrigem;
    this.moedaOrigem = this.moedaDestino;
    this.moedaDestino = tempMoedaOrigem;
    this.moedaDestinoSimbolo = this.getMoedaSimbolo(this.moedaDestino);
  }

  getMoedaSimbolo(moeda: string): string {
    return this.moedasSimbolos[moeda] || '';
  }
  
  toggleModo() {
    this.modoEscuro = !this.modoEscuro;
    document.body.classList.toggle('dark-mode', this.modoEscuro);
  }

}
