import {Hono} from 'hono'
import {cors} from "hono/cors";
import {compress} from "hono/compress";
import {ChatOpenAI} from "@langchain/openai";

const app = new Hono()

app.get("/", (c) => {
    return c.text(`${new Date()}`)
})

app.use(cors({
    origin: "*",
    allowHeaders: ["*"],
    allowMethods: ["*"]
}))

app.post("/api/openai-summary", async (c) => {
    const body = await c.req.json<{
        startAt: number,
        endAt: number,
        systemMessage: string,
        logText: string,
        openAI: {
            apiKey: string,
            maxTokens: number,
            temperature: number,
            model?: string
        },
    }>()
    const ai = new ChatOpenAI({
        ...body.openAI,
        model: body.openAI.model ?? "gpt-4o-mini"
    })
    const chunks = await ai.batch([])
    return c.json({
        data: chunks.map(k => k.content).join("")
    })
})

export default app
