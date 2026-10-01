export type KnowledgeSource = { id: string; name: string; enabled: boolean; source: string };

export const aiSeed = {
  knowledgeSources: [{ id: "knowledge-1", name: "Quick replies", enabled: false, source: "Zaapi System" }] as KnowledgeSource[],
};
