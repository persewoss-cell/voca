// Cloudflare Worker: 네이버 파파고(NCP Papago Translation) API를 대신 호출해주는
// 작은 중개 서버(프록시)입니다.
//
// 왜 필요한가?
// 파파고 API는 브라우저에서 직접 호출할 수 없습니다(CORS 미지원 + 비밀 키를
// 페이지 소스에 그대로 노출하면 안 되기 때문). 이 Worker가 대신 파파고를 호출하고,
// 비밀 키는 Worker의 환경변수(Secret)로만 보관하며, 결과만 우리 단어장 페이지로
// 돌려줍니다.
//
// 배포 방법은 이 폴더의 README.md를 참고하세요.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let text = "";
    let source = "en";
    let target = "ko";

    if (request.method === "GET") {
      const url = new URL(request.url);
      text = url.searchParams.get("text") || "";
      source = url.searchParams.get("source") || "en";
      target = url.searchParams.get("target") || "ko";
    } else {
      const body = await request.json().catch(() => ({}));
      text = body.text || "";
      source = body.source || "en";
      target = body.target || "ko";
    }

    if (!text) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!env.NCP_CLIENT_ID || !env.NCP_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "NCP_CLIENT_ID / NCP_CLIENT_SECRET secret이 설정되지 않았습니다." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let ncpRes;
    try {
      ncpRes = await fetch("https://papago.apigw.ntruss.com/nmt/v1/translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-NCP-APIGW-API-KEY-ID": env.NCP_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": env.NCP_CLIENT_SECRET,
        },
        body: new URLSearchParams({ source, target, text }).toString(),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "파파고 요청 실패: " + e.message }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await ncpRes.json().catch(() => null);

    if (!ncpRes.ok || !data) {
      return new Response(JSON.stringify({ error: "translation failed", status: ncpRes.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const translatedText = data.message && data.message.result && data.message.result.translatedText;

    return new Response(JSON.stringify({ translatedText: translatedText || "" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
