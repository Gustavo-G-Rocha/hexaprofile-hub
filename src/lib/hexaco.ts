// HEXACO calculation logic
export interface HexacoQuestion {
  id: string;
  text: string;
  dimension: 'H' | 'E' | 'X' | 'A' | 'C' | 'O';
  reversed?: boolean;
}

export const hexacoQuestions: HexacoQuestion[] = [
  { id: 'E1', text: 'Costumo me sentir ansioso(a) quando enfrento algo completamente novo.', dimension: 'E' },
  { id: 'C4', text: 'Tenho dificuldade em me manter concentrado(a) em projetos que demoram muito.', dimension: 'C', reversed: true },
  { id: 'A1', text: 'Tendo a perdoar rapidamente quando alguém me magoa.', dimension: 'A' },
  { id: 'H2', text: 'Faria qualquer coisa para me dar bem, ainda que prejudicasse outras pessoas.', dimension: 'H', reversed: true },
  { id: 'O2', text: 'Acho entediante aprender sobre assuntos que não se aplicam diretamente ao meu dia a dia.', dimension: 'O', reversed: true },
  { id: 'E4', text: 'Raramente fico preocupado(a) com algo, quase não me afeta.', dimension: 'E', reversed: true },
  { id: 'X3', text: 'Sinto-me energizado(a) quando sou o foco das atenções.', dimension: 'X' },
  { id: 'H1', text: 'Eu não aceitaria suborno algum, mesmo que fosse uma quantia alta.', dimension: 'H' },
  { id: 'A4', text: 'Se alguém me ofende, costumo guardar rancor por muito tempo.', dimension: 'A', reversed: true },
  { id: 'C1', text: 'Costumo me preparar com antecedência para as minhas tarefas.', dimension: 'C' },
  { id: 'O3', text: 'Gosto de me envolver em atividades artísticas ou culturais que nunca experimentei antes.', dimension: 'O' },
  { id: 'E2', text: 'Consigo manter a calma mesmo em situações muito estressantes.', dimension: 'E', reversed: true },
  { id: 'O4', text: 'Raramente aprecio ler sobre conceitos filosóficos ou teóricos.', dimension: 'O', reversed: true },
  { id: 'A3', text: 'Normalmente evito que pequenas discussões virem grandes conflitos.', dimension: 'A' },
  { id: 'H3', text: 'Não costumo me sentir mal por mentir, se isso me trouxer vantagens.', dimension: 'H', reversed: true },
  { id: 'X4', text: 'Prefiro ficar na minha, mesmo em rodas de amigos.', dimension: 'X', reversed: true },
  { id: 'C3', text: 'Gosto de manter meu ambiente de trabalho e meus pertences bem organizados.', dimension: 'C' },
  { id: 'E3', text: 'Às vezes me sinto sobrecarregado(a) pelas minhas próprias emoções.', dimension: 'E' },
  { id: 'H4', text: 'Prefiro ser totalmente sincero(a), mesmo quando é fácil escapar com uma mentirinha.', dimension: 'H' },
  { id: 'A2', text: 'Frequentemente critico as pessoas quando elas cometem erros.', dimension: 'A', reversed: true },
  { id: 'O1', text: 'Sinto prazer em explorar ideias ou teorias que podem parecer abstratas.', dimension: 'O' },
  { id: 'X1', text: 'Adoro estar em grupos grandes, onde posso conhecer gente nova.', dimension: 'X' },
  { id: 'C2', text: 'Costumo perder tempo em vez de seguir direto para as minhas tarefas.', dimension: 'C', reversed: true },
  { id: 'X2', text: 'Prefiro atividades que me permitam estar com outras pessoas.', dimension: 'X' }
];

export const dimensionNames = {
  H: 'Honestidade-Humildade',
  E: 'Emocionalidade',
  X: 'Extroversão',
  A: 'Amabilidade',
  C: 'Conscienciosidade',
  O: 'Abertura à Experiência'
};

export function calculateHexacoScores(responses: Record<string, number>): Record<string, number> {
  const scores = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };
  const counts = { H: 0, E: 0, X: 0, A: 0, C: 0, O: 0 };

  hexacoQuestions.forEach(question => {
    const response = responses[question.id];
    if (response !== undefined) {
      let score = response;
      if (question.reversed) {
        score = 6 - response; // Reverse scale (1->5, 2->4, 3->3, 4->2, 5->1)
      }
      scores[question.dimension] += score;
      counts[question.dimension]++;
    }
  });

  // Calculate averages and convert to 0-100 scale
  Object.keys(scores).forEach(dim => {
    const dimension = dim as keyof typeof scores;
    if (counts[dimension] > 0) {
      scores[dimension] = ((scores[dimension] / counts[dimension]) - 1) * 25; // Convert 1-5 scale to 0-100
    }
  });

  return scores;
}