/*!
 * The MIT License (MIT)
 * Copyright (c) 2016 Carlos Alberto
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

/**
 * Função prototype genérica para manipulação e validação de campos de formulários.
 * Como usar:
 * 1) Instancie "new Formulario(id)" fornecendo o ID do formulário,
 * 2) use os métodos "ler()" / "preencher()" / "limpar()" para interagir com os campos
 * 3) [opcional] use o método "definirValidador(nomeDaFunçãoDeValidação)" para definir uma função validadora do formulário
 *  3.1) o argumento é o nome da função opcional, por padrão, será usado "validador_"+ o ID do formulário para encontrar a função
 * 4) [opcional] valide o formulário com "isValid()"
 * 
 * Obs: Também é possível inserir a função de validação direto ao prototype, por exemplo:
 * "ValidaFormulario.prototype.validador_form_alteraremail"
 * 
 * @param formID ID do formulário que será manipulado.
 */
function Formulario(id) 
{
	this.form = undefined;
	this.validador = undefined;
	this.prefixoValidador = 'validador_';
	
	var $frm = undefined;
	if(typeof id === "string")
		$frm = document.forms[id];
	else 
		$frm = id;
	
	// se o elemento não foi encontrado, provavelmente ainda não foi criado no DOM
	if(typeof $frm === 'undefined'){
		// TODO
	}
	
	if($frm || typeof $frm !== 'undefined')
		this.form = $frm;
	else 
		console.error('O ID informado ['+ id +'] não pertence à um formulário');
};
Formulario.prototype = (function() {
	// Sem acesso ao escopo 'this' da função principal
	
	/**
	 * Função para preencher os campos de um formulário.
	 * @param obj Objeto contendo chave com o nome dos campos, e seus respectivos valores.
	 * @see veja mais sobre o loop for-in em ES2015, a ordem da sequência não é garantida. 
	 */
	var preencherCampos = function(obj) {
		fields:
		for (var key in obj) {
			var id = document.getElementById(key);
			if(id) {
				// single element
				if(id.tagName=='SELECT') {
					if(id.options[id.selectedIndex].value==obj[key]) {
						id.options[id.selectedIndex].selected=true; continue fields;
					}
				}
				id.value = obj[key];
			} else {
				// multiple elements
				id = document.getElementsByClassName(key);
				if(id){
					options:
					for(i=0, size=id.length; i<size; i++)
						if(id[i].value==obj[key]) {
							id[i].checked=true; break options;
						}
				}
			}
		}
	};
	
	/**
	 * Função para ler os campos de um formulário.
	 * @param form Objeto do formulário mapeado.
	 */
    var lerCampos = function(form) {
    	var len = form.elements.length;
    	var vars = {};
    	for (i=0; i<len; i++) {
			if (form.elements[i].tagName=='TEXTAREA') {
				valtxt = form.elements[i].value;
				valtxt = valtxt.replace(/&/g,'[(e)]');
				vars[form.elements[i].name] = (valtxt); 
			}
			if (form.elements[i].tagName=='INPUT') {
				if ((form.elements[i].type=='text') || (form.elements[i].type=='hidden') || (form.elements[i].type=='password') ) { 
					vars[form.elements[i].name] = (form.elements[i].value); 
				}
				if (form.elements[i].type=='checkbox') {
					if (form.elements[i].checked) { vars[form.elements[i].name] = form.elements[i].value}
					else { vars[form.elements[i].name] = ''}
				}
				if (form.elements[i].type=='radio') {
					if (form.elements[i].checked) { vars[form.elements[i].name] = form.elements[i].value}
				}
			} else if (form.elements[i].tagName=='SELECT') {
				var sel = form.elements[i];
				if(typeof sel.options[sel.selectedIndex] !== 'undefined')
					vars[sel.name] = sel.options[sel.selectedIndex].value;
				else
					vars[sel.name] = '';
			}
		}
    	ret = JSON.parse(JSON.stringify(vars));
    	return ret;
    };
    
    // Com acesso ao escopo 'this' da função principal
    var method = {};
    	method.constructor = Formulario;
    	method.limpar = function() {
    		this.form.reset();
	    };
	    method.preencher = function(dataSource) {
	    	preencherCampos(dataSource);
	    	return true;
	    };
	    method.ler = function() {
	    	var objFields = lerCampos(this.form);
	    	return objFields;
	    };
	    // define um validador para o formulário
	    method.definirValidador = function(nome) {
			this.validador = new ValidaFormulario(this.form, (nome||undefined), (this.prefixoValidador||undefined));
			return;
	    };
	    method.isValid = function() {
            if (typeof this.validador === 'undefined') {
                this.definirValidador(undefined);
            }
	    	return this.validador.isValid();
	    };
    
    return method;
}());


/**
 * Prototype para validação de preenchimento de formulários utilizando a biblioteca jQuery Validator.
 * 
 * @param id ID do formulário
 * @param method Nome do método/função que será chamada, ou criada se ainda não existir, e chamada pelo prototype.
 */
function ValidaFormulario(id, method, prefixo) {
	this.id = id; // determina o ID
	this.funcPadrao = undefined; // determina o nome padrão da funcão validadora de formulário
	
	// se o ID foi passado como string..
	if (typeof id === 'string' || id instanceof String) {
		this.id = document.getElementById(id);
		this.funcPadrao = id;
	}
	
	// obtém o id/name do formulário para criar a referência para a função validadora, se não existir
	if(typeof this.id.name !== 'undefined')
		this.funcPadrao = this.id.name;
	else 
		this.funcPadrao = this.id.id;
	
	// define o prefixo para as funções, ou não
	if(typeof prefixo !== 'undefined')
		this.funcPadrao = prefixo+'' + this.funcPadrao;
	
	if(typeof method !== 'undefined') {
		if(typeof this[method] !== 'function') {
			console.info('A função de validação ['+ method +'] não existe no prototype, criando uma agora...');
			if(typeof window[method] !== 'function') {
				console.warn('A função ['+ method +'] não pôde ser criada pois não existe.');
			} else {
				this.addMethod(window[method]); // criar
				this[method](); // chamar o método criado
			}
		} else {
			this[method](); // chama o validador de formulário já definido no prototype
		}
	} else {
		if(typeof this[this.funcPadrao] !== 'function') {
			console.info('A função de validação ['+ this.funcPadrao +'] não existe no prototype, criando uma agora...');
			if(typeof window[this.funcPadrao] !== 'function') {
				console.warn('A função ['+ this.funcPadrao +'] não pôde ser criada pois não existe.');
			} else {
				this.addMethod(window[this.funcPadrao]); // criar
				this[this.funcPadrao](); // chamar o método criado
			}
		} else {
			this[this.funcPadrao](); // chama o validador de formulário já definido no prototype
		}
	}
};
/**
 * Adiciona um novo método ao prototype, passando o nome de uma função
 * que se incorporará à instância. 
 * A função deve ser declarada com um nome, impossibilitando o uso de Função Anônima.
 * 
 * @param func O nome da função, propriamente dito.
 * @param alias O apelido para a função, se não for definido, será usado o da própria função. 
 */
ValidaFormulario.prototype.addMethod = function(func, alias) {
	var name = func.name; // ECMAScript 6
	if(typeof name === 'undefined')
		name = /^function\s+([\w\$]+)\s*\(/.exec( func.toString() )[ 1 ] // ECMAScript 5 para navegadores antigos (IE)
	if(typeof alias !== 'undefined')
		name = alias;
	ValidaFormulario.prototype[name] = func;
};
/**
 * Valida se o validador determinado ao formulário está OK ou se possui erros.
 * @return boolean TRUE se ok, FALSE do contrário, aplicando as configurações do validator
 */
ValidaFormulario.prototype.isValid = function() {
	return $(this.id).valid();
};
/**
 * Validador do formulário de alteração de senha
 */
ValidaFormulario.prototype.validador_form_alterarsenha = function() {
	return $(this.id).validate({
        onkeyup:false,
        errorClass: 'error',
        validClass: 'success',
        errorPlacement:function(error, element) {
        },
        submitHandler:function() {
        },
        rules: {
        	senhaatual: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            senha: {
                required: true,
                minlength: 5,
                maxlength: 100
            },
            confirmar_senha: {
                minlength: 5,
                maxlength: 100,
                equalTo: "#senha"
            }
        }
    });
};

/**
 * Validador do formulário de alterar e-mail 
 * Exemplo: 
 * Para não alterar este arquivo, pode-se definir o validador em outro lugar, 
 * desde que siga a nomenclatura: "validador_" + ID do formulário
 * o método "definirValidador()" tentará encontrar no prototype, e se não achar,
 * tentará encontrar a função e vinculá-la ao prototype.
 
ValidaFormulario.prototype.validador_form_alteraremail = function() {
	return $(this.id).validate({
        onkeyup:false,
        errorClass: 'error',
        validClass: 'success',
        errorPlacement:function(error, element) {
        },
        submitHandler:function() {
        },
        rules: {
        	emailatual: {
                required: true,
                minlength: 8,
                maxlength: 120,
                email: true
            },
            email: {
                required: true,
                minlength: 8,
                maxlength: 120,
                email: true
            },
            confirmar_email: {
                minlength: 8,
                maxlength: 120,
                equalTo: "#email"
            }
        }
    });
};
*/