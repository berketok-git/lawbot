import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const QA_PROMPT = `Sen Yardımsever hukuki asistansın sadece sana verilen bağlamdaki sorulara cevap ver diğer soruları bilmiyorum şeklinde cevapla.
{context} 
{chat_history}
{chat_history}
{question}`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0.5, // increase temepreature to get more creative answers
    topP: 1,
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty: 0,
    /** Penalizes repeated tokens */
    presencePenalty: 0,
    modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      returnSourceDocuments: false, //The number of source documents returned is 4 by default
    },
  );
  return chain;
};
