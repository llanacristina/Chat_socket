# Chat_websocket
Este projeto foi criado para demonstrar a implementação de um chat simples usando WebSocket com `express` e `ws`. Onde o servidor gerencia as conexões, enquanto o cliente envia e recebe mensagens em tempo real.


## Requisitos
Antes de começar, certifique-se de ter o Node.js instalado em sua máquina.

### Instruções de configuração:

**1. Instale as dependências**

Para baixar os pacotes necessários do Node.js, execute o seguinte comando:

```
npm install
```

**2. Compile o TypeScript para JavaScript**

Para compilar o código Typescript e gerar os arquivos Javascript na pasta `/dist`, utilize:

```
npm run build
```

**3. Execute o cliente**

Para iniciar o cliente a partir da pasta de saída (--outDir) e compilar o código, use o seguinte comando:

```
npm run client
```

**4. Inicie o servidor**

Por fim, para rodar o servidor e abrir o `index.html`, execute:

```
npm start
```

###

> ***OBS:***  Para visualizar o HTML e testar o chat, você pode abrir o arquivo diretamente no navegador a partir do diretório do projeto. Uma maneira prática de fazer isso também é utilizando a extensão ```Live Server``` do Visual Studio Code, só instalar.

### Tecnologias Utilizadas
* Node.js
* TypeScript
* WebSocket (usando a biblioteca ws)
* HTML/CSS







