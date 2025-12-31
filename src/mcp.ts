import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js"
import {z, ZodType} from "zod";

const apiKey: string = process.env.XBY_APIKEY || '';
// const mcpID: string = process.env.MCP_ID;
const mcpID: string = '1777316659619843';

console.log("apiKey: " + apiKey)
console.log("mcpID: " + mcpID)

const state = {
    isLoading: false
};

const calcXiaoBenYangApi = async function (fullArgs: Record<string, any>) {
    // 发起 POST 请求
    let response = await fetch('https://mcp.xiaobenyang.com/api', {
        method: 'POST',
        headers: {
            'XBY-APIKEY': apiKey,
            'func': fullArgs.toolName,
            'mcpid': mcpID
        },
        body: new URLSearchParams(fullArgs)
    });
    const apiResult = await response.text();

    return {
        content: [
            {
                type: "text",
                text: apiResult // 将字符串结果放入 content 中
            }
        ]
    } as { [x: string]: unknown; content: [{ type: "text"; text: string }] };
};


const handleXiaoBenYangApi = async (args: Record<string, any>, toolName: string) => {
    // 校验aid是否存在
    if (toolName === undefined || toolName === null) {
        throw new Error("缺少必要参数 'aid'");
    }
    // 合并参数
    const fullArgs = {...args, toolName: toolName};
    // 调用API
    return calcXiaoBenYangApi(fullArgs);
};

const addToolXiaoBenYangApi = function (
    name: string,
    desc: string,
    params: Record<string, ZodType>
) {
    server.registerTool(
        name,
        {
            title: name,
            description: desc,
            inputSchema: params,
        }
        ,
        async (args: Record<string, any>) => handleXiaoBenYangApi(args, name)
    )
};

const server = new McpServer({
    name: "Say Hello",
    version: "1.0.0",
})

let  isRegistered = false;
const getServer = async () => {
    console.log("getServer start.........")
    if(!isRegistered) {
        try {
            state.isLoading = true;

            const res = await fetch('https://mcp.xiaobenyang.com/getMcpDesc?mcpId=' + mcpID, {
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error(`请求失败：${res.status}`);
            }

            const data = await res.json();
            const apiDescList = data.tools;

            for (const apiDesc of apiDescList) {
                let inputSchema = JSON.parse(apiDesc.inputSchema);
                const zodDict: Record<string, z.ZodTypeAny> = {};

                Object.entries(inputSchema.properties).forEach(([name, propConfig]) => {
                    let zodType;
                    let pt = (propConfig as { type: string }).type;
                    switch (pt) {
                        case 'string':
                            zodType = z.string();
                            break;
                        case 'number':
                            zodType = z.number();
                            break;
                        case 'boolean':
                            zodType = z.boolean();
                            break;
                        case 'integer':
                            zodType = z.int32();
                            break;
                        case 'array':
                            zodType = z.array(z.any());
                            break;
                        case 'object':
                            zodType = z.object(z.any());
                            break;
                        default:
                            zodType = z.any();
                    }

                    if (inputSchema.required?.includes(name)) {
                        zodDict[name] = zodType;
                    } else {
                        zodDict[name] = zodType.optional();
                    }
                });


                addToolXiaoBenYangApi(
                    apiDesc.name,
                    apiDesc.description ? apiDesc.description : apiDesc.name,
                    zodDict);
            }
            isRegistered = true;
            state.isLoading = false;
            console.log("state.isLoading: " + state.isLoading)
            return server;
        } catch (error) {
            console.error("getServer 执行失败：", error);
            state.isLoading = false; // 异常时也需要重置加载状态
            throw error; // 抛出错误，让调用方捕获
        }
    } else {
        return server;
    }
}

getServer().then(r => {
    console.log("getServer end.........")
});

export {getServer, state, server}
