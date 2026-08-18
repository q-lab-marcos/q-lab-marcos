# Site do grupo de computação quântica

Site estático em HTML, CSS, JavaScript e Bootstrap. Abra `index.html` ou publique a pasta em qualquer hospedagem estática.

## Integração com Google Sheets

Crie duas planilhas (ou mais, se preferir) e publique cada aba usada como CSV em **Arquivo → Compartilhar → Publicar na Web**. Cole as URLs resultantes em `config.js`.

Colunas aceitas:

- **Alunos / Professores e pós-docs:** `nome`, `funcao`, `foto`, `link`
- **Artigos:** `ano`, `titulo`, `autores`, `revista`, `link`
- **Projetos:** `titulo`, `descricao`, `link`

Os cabeçalhos não diferenciam maiúsculas e minúsculas, e também há suporte a algumas variações em inglês. A foto deve ser uma URL pública direta para uma imagem. Para usar duas planilhas, uma sugestão é manter as abas **Alunos**, **Artigos** e **Projetos** na primeira, e a aba **Equipe** na segunda; cada aba terá sua própria URL CSV.

Se uma URL estiver vazia ou indisponível, o site exibe conteúdo demonstrativo automaticamente. Para trocar textos institucionais, endereço e links fixos, edite `index.html`.

## Teste local

Alguns navegadores bloqueiam leitura remota de CSV quando o arquivo é aberto diretamente. Nesse caso, rode um servidor local na pasta, por exemplo:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.
