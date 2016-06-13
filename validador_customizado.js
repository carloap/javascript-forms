/* Função de validação do formulário de alteração de senha
 *
 * Ela foi colocada aqui por um propósito: 
 * Evitar alterar o arquivo do prototype "ValidaFormulario", 
 * mas inserir a função usando o método "definirValidador('NomePersonalizado')" de "Formulario", isso vai incorporar a função externa ao prototype...
 * 
 * Porém... aparentemente você pode inserir direto ao prototype seguindo a sintaxe: "ValidaFormulario.prototype.validador_form_alteraremail", pois ele já foi carregado
 */

//ValidaFormulario.prototype.validador_form_alteraremail = function() {
function validador_form_alteraremail() {
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