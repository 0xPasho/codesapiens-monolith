// import { OpenAIEmbeddings } from "langchain/embeddings";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { db } from "~/server/db";
// import { makeChain } from "~/server/ask/makechain";
// import { supabaseClient } from "~/server/ask/supabase-client";
import { env } from "~/env.mjs";
import { createClient } from "@supabase/supabase-js";
import { PassThrough } from "stream";
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode("<p>One</p>");
  await sleep(5500);
  yield encoder.encode("<p>Two</p>");
  await sleep(1500);
  yield encoder.encode("<p>Three</p>");
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { question, projectSlug } = await req.json();

  if (!question) {
    return NextResponse.json({ message: "No question in the request" });
  }
  const project = await db.project.findFirst({
    where: {
      slug: projectSlug,
    },
  });
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    client, //supabaseClient,
    new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY }),
  );
  vectorStore.tableName = "DocumentEmbeedingChunk";
  vectorStore.queryName = "match_documents";
  const funcFilterProject = (rpc) =>
    rpc.filter("metadata->>projectId", "eq", project.id);
  const resultB = await vectorStore.similaritySearch(
    question,
    4,
    funcFilterProject,
  );
  console.log({ resultB });
  console.log({ resultB });
  console.log({ resultB });
  //   res.writeHead(200, {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache, no-transform",
  //     Connection: "keep-alive",
  //   });
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);

  return new Response(stream);
  // OpenAI recommends replacing newlines with spaces for best results
  //   const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  //   /* create vectorstore*/
  //   const vectorStore = await SupabaseVectorStore.fromExistingIndex(
  //     null, //supabaseClient,
  //     new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY }),
  //   );
  //   vectorStore.tableName = "DocumentEmbeedingChunk";
  //   vectorStore.queryName = "match_documents";

  //   res.writeHead(200, {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache, no-transform",
  //     Connection: "keep-alive",
  //   });

  //   const sendData = (data: string) => {
  //     res.write(`data: ${data}\n\n`);
  //   };
  //   console.log(JSON.stringify({ data: "" }));
  //   console.log(JSON.stringify({ data: "" }));
  //   console.log(JSON.stringify({ data: "" }));

  //   sendData(JSON.stringify({ data: "" }));

  //   // create the chain
  //   const chain = makeChain(vectorStore, (token: string) => {
  //     console.log({ token });
  //     sendData(JSON.stringify({ data: token }));
  //   });

  //   try {
  //     //Ask a question
  //     const response = await chain.call({
  //       question: sanitizedQuestion,
  //       chat_history: history || [],
  //     });

  //     console.log("response", response);
  //   } catch (error) {
  //     console.log("error", error);
  //   } finally {
  //     sendData("[DONE]");
  //     res.end();
  //   }
}
