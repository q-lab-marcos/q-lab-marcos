# Site do grupo de computação quântica

Site estático em HTML, CSS, JavaScript e Bootstrap. Abra `index.html` ou publique a pasta em qualquer hospedagem estática.

Para adicionar a foto do grupo, salve a imagem dentro do projeto (por exemplo, em `assets/foto-grupo.jpg`) e preencha `groupPhoto` no arquivo `config.js` com esse caminho.

## Integração com Google Sheets

Crie duas planilhas (ou mais, se preferir) e publique cada aba usada como CSV em **Arquivo → Compartilhar → Publicar na Web**. Cole as URLs resultantes em `config.js`.

Colunas aceitas:

- **Alunos:** `nome`, `funcao`, `foto`, `link`, `email`, `agencia`, `numero da bolsa`, `titulo do trabalho`, `status`
- **Professores e pós-docs:** `nome`, `funcao`, `foto`, `link`, `email`, `agencia`, `numero da bolsa`, `status`
- **Artigos:** `ano`, `titulo`, `autores`, `revista`, `volume`, `numero`, `paginas`, `tipo`, `doi`, `link`, `favorito`
- **Projetos:** `titulo`, `descricao`, `agencia`, `periodo`, `status`, `link`

Os cabeçalhos não diferenciam maiúsculas e minúsculas, e também há suporte a algumas variações em inglês. A foto deve ser uma URL pública direta para uma imagem. Para usar duas planilhas, uma sugestão é manter as abas **Alunos**, **Artigos** e **Projetos** na primeira, e a aba **Equipe** na segunda; cada aba terá sua própria URL CSV.

Se uma URL estiver vazia ou indisponível, o site exibe conteúdo demonstrativo automaticamente. Para trocar textos institucionais, endereço e links fixos, edite `index.html`.

## Teste local

Alguns navegadores bloqueiam leitura remota de CSV quando o arquivo é aberto diretamente. Nesse caso, rode um servidor local na pasta, por exemplo:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.
