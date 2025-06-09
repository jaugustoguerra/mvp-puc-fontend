const form = document.getElementById("formAluno");
const divAlunos = document.getElementById("alunos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const aluno = {
    id: form.id.valueOf ? parseInt(form.id.valueOf) : undefined,
    nome: form.nome.value,
    email: form.email.value,
    data_nascimento: form.data_nascimento.value,
  };
  await fetch("http://localhost:5000/cadastrar_aluno", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
  form.reset();
  carregarAlunos();
});

async function carregarAlunos() {
  const res = await fetch("http://localhost:5000/buscar_alunos");
  const alunos = await res.json();
  divAlunos.innerHTML = alunos.map(a => `
    <div class="card">
      <strong>ID: ${a.id}</strong><br>
      <strong>${a.nome}</strong><br>
      Email: ${a.email}<br>
      Nascimento: ${(a.data_nascimento)}<br>
      <button onclick="deletarAluno(${a.id})">Excluir</button>
    </div>
  `).join("");
}

async function deletarAluno(id) {
  await fetch(`http://localhost:5000/deletar_aluno/${id}`, {
    method: "DELETE"
  });
  carregarAlunos();
}

window.onload = carregarAlunos;

async function buscarAlunoPorId() {
  const id = document.getElementById("buscarId").value;
  if (!id) return alert("Informe um ID válido");

  const res = await fetch(`http://localhost:5000/buscar_aluno/${id}`);
  const resultadoDiv = document.getElementById("resultadoBusca");

  if (res.status === 404) {
    resultadoDiv.innerHTML = `<p style="color: red;">Aluno não encontrado.</p>`;
    return;
  }

  const aluno = await res.json();
  resultadoDiv.innerHTML = `
    <div class="card">
      <strong>${aluno.nome}</strong><br>
      Email: ${aluno.email}<br>
      Nascimento: ${aluno.data_nascimento}
    </div>
  `;
}
