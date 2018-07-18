/*  Funcao assincrona que procura reacoes especificas em textos
 * e retorna o usuario que teve a reacao.
 */
module.exports = async function(base, by_text, by_reaction) {
    try{
        let users = []

        // Pega apenas os objetos reactions com a reacao 'by_reaction'.
        let found_reactions = await base.reactions.find({
            reaction  :  by_reaction,
        })

        // Popula os atributos para poderem ser acessados diretamente no filtro.
        .populate('post')
        .populate('user')

        // Filtra apenas os posts com a string 'by_text' no texto e no titulo.
        found_reactions = found_reactions.filter((reaction) => {
            return (reaction.post.title.includes(by_text)) && (reaction.post.text.includes(by_text))
        })

        // Pega os usuarios que tiveram a reacao 'by_reaction' nos posts filtrados
        for(let r = 0; r < found_reactions.length; r++) {
            let found_user = found_reactions[r].user
            if(found_user && users.indexOf(found_user.username) === -1) {
                users.push(found_user.username)
            }
        }

        // Retorna um vetor de users ordenados.
        return users.sort((user_a, user_b) => user_a.localeCompare(user_b))
    }catch(err){
        console.error(err)
    }
}
