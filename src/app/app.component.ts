import { ɵAnimationGroupPlayer } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angular-singalR';
  private hubConnection: HubConnection;
  public constructor()
  {

  }
  ngOnInit(): void {
    this.connectToHub();
  }
  removeFromCatalog(catalog): void{
    this.hubConnection.invoke("RemoveFromCatalog", catalog.value)
      .catch(err => console.error(err));
  }
  private connectToHub(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5010/catalogHub')
      .build();

    // escucha los eventos del servidor
    this.hubConnection.on("catalogBroadCast", (data: any) => {
      console.log("item recibido", data);
    });
    this.hubConnection.on("removeCat", (catalogItemId: any) => {
      console.log("remove", catalogItemId);
    });
    // escuchando cuando un usuario se añadio al catalogo
    this.hubConnection.on("addCatalog", (message)=> {
      console.log(message);
    });
    this.hubConnection.on("removeCatalog", (message)=> {
      console.log(message);
    })
    // inicia la conexion con el servidor
    this.hubConnection.start()
      .then(res=> console.log("conexion establecida."))
      .catch(err => console.error("No se pudo establecer coneccion con el servidor", err));
  }
  observarCatalogo(catalogId): void {
    if(!(catalogId.value == null || catalogId.value == "")){      
      this.hubConnection.invoke("AddToCatalog", catalogId.value)
        .catch(err => console.error("no se pudo conectar a catalogo : " + catalogId.value, err));
    }   
  }
}
