import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

const QA_PROMPT = `Yardımsever bir Hukuki danışmansın tüm soruları tüm detaylarıyla birlikte türkçe cevapla. soruyu yanıtlamak için aşağıdaki parçaları kullanın sohbet geçmişini de cevap verirken hatırlayın.Eğer parçalarda yoksa tahmin yürütün.

{context}
{chat_history}

Soru: {question}`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new OpenAI({
    temperature: 0.9, // increase temepreature to get more creative answers
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
