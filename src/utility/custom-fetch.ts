const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY

type CustomTuple = [string, string][];

export const customFetch = async (url: string, method: "POST" | "GET" | "PATCH" | "DELETE", body: any = null, queryparams: CustomTuple = [], headers: CustomTuple = []): Promise<Response> => {
    if (/rest\/v1/.test(url)) {
        const additionalKey = method === "GET" ? "Accept-Profile" : "Content-Profile";
        headers.push([additionalKey, "caps"])
    }

    url = baseUrl + url;

    if (queryparams.length > 0) { url = url + "?" + new URLSearchParams(queryparams); }

    if (body) { body = JSON.stringify(body); }

    headers = [
        ...headers,
        ["Content-Type", "application/json"],
        ["Authorization", `Bearer ${supabaseKey}`],
        ["apikey", supabaseKey ?? '']
    ];

    try {
        return await fetch(url, { body, method, headers });
    } catch (err) {
        return new Response(JSON.stringify({ error: `Something went wrong while fetching : ${err}` }), { status: 424 })
    }
}