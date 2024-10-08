import {Hono} from 'hono'
import {cors} from "hono/cors";
import {ChatOpenAI} from "@langchain/openai";

const app = new Hono<{
    Bindings: {
        OPEN_AI_APIKEY: string
    }
}>()

app.use(cors({
    origin: ["*"],
    allowHeaders: ["*"],
    allowMethods: ["*"]
}))

app.get("/", (c) => {
    return c.text(`${new Date()}`)
})

app.post("/api/v1/openai/batch", async (c) => {
    const body = await c.req.json<{
        inputs: string[],
        openAI: {
            temperature?: number,
            model?: string
        },
    }>()
    const ai = new ChatOpenAI({
        ...body.openAI,
        apiKey: c.env.OPEN_AI_APIKEY,
        model: body.openAI.model ?? "gpt-4o-mini"
    })
    const chunks = await ai.batch(body.inputs)
    return c.json({
        data: chunks.map(k => k.content).join("")
    })
})

export default app
