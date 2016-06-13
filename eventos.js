/* 
 * Executa a bibliteca de controle de formulários
 * e dispara eventos dos botões.
 */


// Formulário de alteração de senha =========================================================
var form = new Formulario('form_alterarsenha');

// simular o submit
$('#bt_salvar').on('click', function(){
    var objLer = form.ler();
    console.log(objLer);
    if(form.isValid()) {
        console.log('Validação OK');
    } else {
        console.log('Validação Errada ou não definida');
    }
});

// simular um preenchimento (normalmente são dados do servidor)
$('#bt_preencherdados').on('click', function(){
    var objPreencher = {};
    objPreencher.senhaatual = "teste";
    objPreencher.senha = "teste1234";
    objPreencher.confirmar_senha = "teste1234";

    form.preencher(objPreencher);
});

// simular reset
$('#bt_limpar').on('click', function(){
    form.limpar();
});

// Aplicar validação do formulário (normalmente isso é automático, mas aqui é apenas para efeito de teste)
$('#bt_aplvalidacao').on('click', function(){
    form.definirValidador();
});


// Formulário de alteração de e-mail ========================================================
var form2 = new Formulario('form_alteraremail');

// simular o submit
$('#bt2_salvar').on('click', function(){
    var objLer = form2.ler();
    console.log(objLer);
    if(form2.isValid()) {
        console.log('Validação OK');
    } else {
        console.log('Validação Errada ou não definida');
    }
});

// simular um preenchimento (normalmente são dados do servidor)
$('#bt2_preencherdados').on('click', function(){
    var objPreencher = {};
    objPreencher.emailatual = "email@teste.com";
    objPreencher.email = "email@teste.abc.de";
    objPreencher.confirmar_email = "email@teste.abc.de";

    form2.preencher(objPreencher);
});

// simular reset
$('#bt2_limpar').on('click', function(){
    form2.limpar();
});

// Aplicar validação do formulário (normalmente isso é automático, mas aqui é apenas para efeito de teste)
$('#bt2_aplvalidacao').on('click', function(){
    form2.definirValidador();
});