import type { NextApiRequest, NextApiResponse } from "next";
import { chatCompletionStream } from "@/services/ai/chat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies["insforge-auth-token"];
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const { messages, modo, stream = true } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Mensajes requeridos" });
  }

  if (!stream) {
    const { chatCompletion } = await import("@/services/ai/chat");
    const result = await chatCompletion({ messages, modo });
    return res.status(200).json(result);
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = chatCompletionStream({ messages, modo });

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (error: any) {
    res.write(`data: ${JSON.stringify({ error: error?.message ?? "Error en el chat" })}\n\n`);
  }

  res.end();
}
