javascript-forms
==========

O javascript-forms é formado pela biblioteca fomulario.js contendo os métodos necessários para manipulação de formulários html.

Além dela, é utilizado o jQuery v1.12.2 e o plugin jQuery Validation v1.15.0.

### Como incluir ao seu arquivo HTML

* baixe o formulario.js

* Adicione isto ao cabeçalho do seu arquivo HTML

`<script type="text/javascript" src="formulario.js"></script>`

* Pronto! Agora basta instanciar seu formulário e utilizar seus métodos.

### Declarando um novo formulário

##### new Formulario()

* Passe como argumento o ID do formulário para utilização dos métodos. É importante ressaltar também que, a propriedade "name" tenha o mesmo valor da propriedade "id". Por exemplo:

`<form name="frm_contato" id="frm_contato">`

`var frm_contato = new Formulario("frm_contato");`

* OU

`var id = document.getElementById("frm_contato");`
`var frm_contato = new Formulario(id);`

### Métodos

##### Formulario.prototype.ler()

`var frm_contato = new Formulario("frm_contato");`

`var campos = frm_contato.ler(); \\ retorna um array com o valor de todos os campos`

##### Formulario.prototype.preencher()

`var frm_contato = new Formulario("frm_contato");`

`frm_contato.preencher(obj_dados); \\ preenche os campos com um objeto ou array, desde que, cada chave tenha o mesmo ID do campo`

##### Formulario.prototype.limpar()

`var frm_contato = new Formulario("frm_contato");`

`frm_contato.limpar(); \\ limpa todos os campos do formulário`

##### Formulario.prototype.definirValidador()

`var frm_contato = new Formulario("frm_contato");`

`frm_contato.definirValidador('function_validar_contato'); \\ define uma função customizada para validar o formulário.`

`frm_contato.definirValidador(); \\ define uma função padrão para validar o formulário, encontrando pela sintaxe: "validador_" + ID do formulário`

##### Formulario.prototype.isValid()

`var frm_contato = new Formulario("frm_contato");`

`if( frm_contato.isValid() ) \\ valida se a função retorna verdadeiro para o formulário`
