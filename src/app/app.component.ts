import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AngularFireDatabase]
})
export class AppComponent {
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(db: AngularFireDatabase) {
    this.itemsRef = db.list('pessoas');
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
  inserirItem(Nome: string, Sobrenome: string) {
    this.itemsRef.push({
      nome: Nome,
      sobrenome: Sobrenome
    })
  }
  atualizarCampo(key: string, nomeAntigo: string, sobrenomeAntigo: string, form: NgForm) {
    form.controls.key.setValue(key);
    form.controls.novoNome.setValue(nomeAntigo);
    form.controls.novoSobrenome.setValue(sobrenomeAntigo);
  }
  atualizarItem(form:NgForm) {
    this.itemsRef.update(form.controls.key.value, {
       nome: form.controls.novoNome.value,
       sobrenome: form.controls.novoSobrenome.value
      })
    form.controls.novoNome.setValue('');
    form.controls.novoSobrenome.setValue('');
      
  }
  apagarItem(key: string) {
    this.itemsRef.remove(key);
  }
  apagarTudo() {
    this.itemsRef.remove();
  }
}
