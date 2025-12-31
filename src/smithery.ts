import {z} from "zod";
import {getServer, state, server} from "./mcp.js";

export const configSchema = z.object({})

export default function createServer({config,}: { config: z.infer<typeof configSchema> }) {
    console.log('createServer')

    setTimeout(() => {
        console.log('10 秒后执行');
    }, 10000);


    return server.server;
}
